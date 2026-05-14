/**
 * ============================================================================
 * LIMS HERBOLARIA - APP LOGIC (Standalone Edition)
 * Migración Completa de Funciones de Negocio (Legacy -> Cloud)
 * ============================================================================
 */

const LIMS = {
    // --- SEGURIDAD ---
    async hashPassword(p) {
        const m = new TextEncoder().encode(p);
        const h = await crypto.subtle.digest('SHA-256', m);
        return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async login(usuario, password) {
        const passwordHash = await this.hashPassword(password);
        const { data, error } = await sb.from('usuarios')
            .select('*')
            .eq('usuario', usuario)
            .eq('password_hash', passwordHash)
            .eq('estatus', 'Activo')
            .single();

        if (error || !data) return { success: false, message: "Credenciales inválidas o usuario bloqueado." };

        await this.registrarAudit('Seguridad', 'Login Exitoso', `Usuario ${usuario} accedió al sistema.`);
        return { success: true, user: data };
    },

    // --- MUESTRAS ---
    async obtenerMuestrasDashboard() {
        const { data, error } = await sb.from('muestras').select('*').order('fecha_ingreso', { ascending: false });
        if (error) throw error;
        
        let cC = 0, cA = 0, cL = 0, cR = 0;
        const mapped = data.map(m => {
            if (m.estatus === 'Cuarentena') cC++;
            else if (m.estatus === 'En Análisis') cA++;
            else if (m.estatus === 'Liberado' || m.estatus === 'Aprobado') cL++;
            else if (m.estatus === 'Rechazado' || m.estatus === 'Investigacion') cR++;
            
            return {
                loteInterno: m.lote_interno,
                producto: m.producto,
                loteProv: m.lote_prov,
                cantidad: m.cantidad,
                estatus: m.estatus,
                fechaIngreso: m.fecha_ingreso,
                numAnalisis: m.num_analisis
            };
        });

        // Actualizar UI de contadores
        if (document.getElementById('stat-cuarentena')) document.getElementById('stat-cuarentena').textContent = cC;
        if (document.getElementById('stat-analisis')) document.getElementById('stat-analisis').textContent = cA;
        if (document.getElementById('stat-aprobados')) document.getElementById('stat-aprobados').textContent = cL;
        if (document.getElementById('stat-rechazados')) document.getElementById('stat-rechazados').textContent = cR;

        return mapped;
    },

    async obtenerPlanDeAnalisis(loteInterno) {
        // 1. Obtener datos de la muestra
        const { data: muestra, error: e1 } = await sb.from('muestras')
            .select('producto, estatus')
            .eq('lote_interno', loteInterno)
            .single();
        
        if (e1) throw e1;

        // 2. Obtener el ID del producto
        const { data: producto, error: e2 } = await sb.from('productos_pt')
            .select('id_producto')
            .eq('nombre', muestra.producto)
            .single();
        
        if (e2) throw e2;

        // 3. Obtener especificaciones reales de la tabla de pruebas
        const { data: specs, error: e3 } = await sb.from('pruebas_especificas_pt')
            .select('*')
            .eq('id_producto', producto.id_producto);
        
        if (e3) throw e3;

        // 4. Obtener resultados ya guardados
        const { data: resultados } = await sb.from('resultados_analisis')
            .select('*')
            .eq('lote_interno', loteInterno);

        const mapaResultados = {};
        if (resultados) {
            resultados.forEach(r => {
                mapaResultados[r.prueba] = r;
            });
        }

        return {
            producto: muestra.producto,
            estatus: muestra.estatus,
            plan: specs.map(s => {
                const res = mapaResultados[s.prueba];
                
                // Determinar tipo de UI (Legacy Logic)
                let tipoUI = 'numerica';
                const spec = (s.limite || '').toLowerCase();
                if (spec.includes('unidades') || spec.includes('desvía')) tipoUI = 'compleja';
                else if (s.prueba.toLowerCase().includes('aspecto') || !/\d/.test(spec)) tipoUI = 'cualitativa';

                return {
                    prueba: s.prueba,
                    especificacion: s.limite,
                    url_pno: s.url_pno || null,
                    tipoUI: tipoUI,
                    valorPrevio: res?.resultado || '',
                    evaluacion: res?.evaluacion || '--'
                };
            })
        };
    },

    async guardarResultado(loteInterno, prueba, valor, usuario) {
        // Obtener especificación para evaluar (desde pruebas_especificas_pt)
        const { data: spec } = await sb.from('pruebas_especificas_pt')
            .select('limite')
            .eq('prueba', prueba)
            .limit(1)
            .single();

        const evaluacion = this.evaluarResultado(valor, spec ? spec.limite : '');

        const payload = {
            lote_interno: loteInterno,
            prueba: prueba,
            resultado: valor,
            evaluacion: evaluacion,
            analista: usuario,
            fecha: new Date().toISOString(),
            especificacion: spec ? spec.limite : ''
        };

        const { error } = await sb.from('resultados_analisis').upsert(payload, { onConflict: 'lote_interno, prueba' });
        if (error) throw error;

        // Registro de Firma Electrónica por Rol (FQ / MB)
        const { data: user } = await sb.from('usuarios').select('rol, nombre').eq('usuario', usuario).single();
        if (user) {
            const role = user.rol.toLowerCase();
            const upMuestra = {};
            if (role.includes('fisicoqu')) upMuestra.analista_fq = user.nombre;
            if (role.includes('microbio')) upMuestra.analista_mb = user.nombre;
            
            if (Object.keys(upMuestra).length > 0) {
                await sb.from('muestras').update(upMuestra).eq('lote_interno', loteInterno);
            }
        }

        await this.registrarAudit('Resultados', 'Captura', `Lote: ${loteInterno} | Prueba: ${prueba} | Val: ${valor}`, usuario);
        
        return { evaluacion };
    },

    async dictaminarMuestra(loteInterno, dictamen, usuario) {
        const { data: user } = await sb.from('usuarios').select('nombre').eq('usuario', usuario).single();
        const { error } = await sb.from('muestras')
            .update({ 
                estatus: dictamen,
                dictaminador: user?.nombre || usuario,
                fecha_liberacion: new Date().toISOString()
            })
            .eq('lote_interno', loteInterno);
        
        if (error) throw error;

        await this.registrarAudit('Muestras', 'Dictamen', `Lote: ${loteInterno} -> ${dictamen}`, usuario);
    },

    async ingresarMuestra(d, usuario) {
        const payload = {
            lote_interno: d.loteInterno,
            producto: d.producto,
            lote_prov: d.loteProv || null,
            cantidad: d.cantidad,
            num_analisis: d.numAnalisis,
            fecha_ingreso: new Date().toISOString(),
            estatus: 'Cuarentena',
            usuario: usuario
        };
        const { error } = await sb.from('muestras').insert([payload]);
        if (error) throw error;
        await this.registrarAudit('Muestras', 'Recepción', `Registro de lote ${d.loteInterno}`, usuario);
    },

    // --- MOTOR DE EVALUACIÓN ANALÍTICA (EL CORAZÓN DEL LIMS) ---
    evaluarResultado(valor, especificacion) {
        if (!valor || String(valor).trim() === '') return 'En Proceso';
        let valStr = String(valor).trim();
        let specStr = String(especificacion).trim().toLowerCase();

        // 1. Cualitativos Directos / Coincidencia Exacta
        if (valStr.toLowerCase() === specStr) return 'Cumple';
        if (valStr.toLowerCase() === 'cumple' || valStr.toLowerCase().includes('cumple con la prueba')) return 'Cumple';
        if (valStr.toLowerCase() === 'no cumple' || valStr.toLowerCase() === 'oos') return 'OOS';

        // 2. Sinonimos de Cero (Ausencia)
        const sinonimosCero = ['ausencia', 'ausente', 'no detectado', 'nd', 'negativo'];
        if (sinonimosCero.some(s => valStr.toLowerCase() === s)) {
            if (/[<≤]|ausencia|negativo|max|máx/.test(specStr)) return 'Cumple';
        }

        // 3. Evaluación Numérica / Rangos
        let valNum = parseFloat(valStr.replace(/,/g, '').replace(/[<>≤≥=]/g, ''));
        if (isNaN(valNum)) {
            // Si no es numérico, ya comparamos arriba, pero por seguridad:
            return specStr.includes(valStr.toLowerCase()) ? 'Cumple' : 'OOS';
        }

        let specClean = specStr.replace(/,/g, '');
        let matchRango = specClean.match(/([0-9.]+)\s*[-–—]\s*([0-9.]+)/);
        if (matchRango) {
            return (valNum >= parseFloat(matchRango[1]) && valNum <= parseFloat(matchRango[2])) ? 'Cumple' : 'OOS';
        }

        let matchMenor = specClean.match(/(?:[<≤]|max|máx|no m[aá]s).*?([0-9.]+)/);
        if (matchMenor) return (valNum <= parseFloat(matchMenor[1])) ? 'Cumple' : 'OOS';

        let matchMayor = specClean.match(/(?:[>≥]|min|mín|no menos).*?([0-9.]+)/);
        if (matchMayor) return (valNum >= parseFloat(matchMayor[1])) ? 'Cumple' : 'OOS';

        return 'OOS';
    },

    // --- CALCULADORA QUÍMICA (REDISEÑADA) ---
    runCalculator() {
        const tipo = document.getElementById('calc-tipo').value;
        const vol = parseFloat(document.getElementById('calc-volumen').value) || 0;
        const conc = parseFloat(document.getElementById('calc-concentracion').value) || 0;
        const resBox = document.getElementById('calc-result-box');
        const resText = document.getElementById('calc-result-text');

        if (vol <= 0 || (tipo !== 'medio' && conc <= 0)) {
            resBox.classList.add('hidden');
            return;
        }

        let resultado = 0;
        let unidad = "g";

        if (tipo === 'porcentual') {
            resultado = (conc * vol) / 100;
        } else if (tipo === 'medio') {
            resultado = (conc * vol) / 1000; // Conc aquí es el factor g/L
        } else {
            // Molar o Normal (Simplicidad para LIMS PT)
            // Se asume PM de 100 si no se consulta la BD para demo rápida
            resultado = (conc * (vol / 1000) * 100); 
        }

        resText.textContent = `${resultado.toFixed(4)} ${unidad}`;
        resBox.classList.remove('hidden');
    },

    updateCalcFields() {
        const tipo = document.getElementById('calc-tipo').value;
        const fieldConc = document.getElementById('calc-field-conc');
        const label = fieldConc.querySelector('label');
        
        if (tipo === 'medio') {
            label.textContent = "Factor (g/L)";
        } else if (tipo === 'molar') {
            label.textContent = "Molaridad (M)";
        } else if (tipo === 'normal') {
            label.textContent = "Normalidad (N)";
        } else {
            label.textContent = "Porcentaje (%)";
        }
        this.runCalculator();
    },

    // --- KPI & ANALYTICS ---
    async cargarKPIs() {
        const { data: muestras } = await sb.from('muestras').select('fecha_ingreso, fecha_liberacion, estatus');
        const { data: oos } = await sb.from('resultados_analisis').select('prueba').eq('evaluacion', 'OOS');

        // Lead Time Promedio (Días entre ingreso y liberación)
        let totalDays = 0;
        let countLib = 0;
        muestras.forEach(m => {
            if (m.fecha_liberacion && m.fecha_ingreso) {
                const diff = (new Date(m.fecha_liberacion) - new Date(m.fecha_ingreso)) / (1000 * 60 * 60 * 24);
                totalDays += diff;
                countLib++;
            }
        });

        const leadTime = countLib > 0 ? (totalDays / countLib).toFixed(1) : "--";
        const rft = muestras.length > 0 ? (((muestras.length - (oos?.length || 0)) / muestras.length) * 100).toFixed(1) : "--";

        if (document.getElementById('kpi-leadtime')) document.getElementById('kpi-leadtime').textContent = `${leadTime} d`;
        if (document.getElementById('kpi-rft')) document.getElementById('kpi-rft').textContent = `${rft} %`;
        if (document.getElementById('kpi-totales')) document.getElementById('kpi-totales').textContent = muestras.length;

        // Pareto OOS
        const paretoEl = document.getElementById('listaParetoOOS');
        if (paretoEl && oos) {
            const counts = {};
            oos.forEach(o => counts[o.prueba] = (counts[o.prueba] || 0) + 1);
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
            
            if (sorted.length === 0) {
                paretoEl.innerHTML = '<p class="text-emerald-500 text-xs font-bold">✅ Sin desviaciones OOS registradas.</p>';
            } else {
                paretoEl.innerHTML = sorted.map(([p, c]) => `
                    <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span class="text-[10px] font-bold text-slate-600">${p}</span>
                        <span class="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-black">${c}</span>
                    </div>
                `).join('');
            }
        }
        
        this.renderCharts(muestras);
    },

    renderCharts(muestras) {
        const ctx = document.getElementById('chartEstatus');
        if (!ctx) return;

        const counts = { Cuarentena: 0, Análisis: 0, Liberado: 0, Rechazado: 0 };
        muestras.forEach(m => {
            if (m.estatus === 'Cuarentena') counts.Cuarentena++;
            else if (m.estatus === 'En Análisis') counts.Análisis++;
            else if (m.estatus === 'Liberado') counts.Liberado++;
            else counts.Rechazado++;
        });

        if (window.myChart) window.myChart.destroy();
        window.myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cuarentena', 'Análisis', 'Liberado', 'Rechazado'],
                datasets: [{
                    data: [counts.Cuarentena, counts.Análisis, counts.Liberado, counts.Rechazado],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } } } }
            }
        });
    },

    // --- MICROBIOLOGÍA (CEPARIO) ---
    async procesarMovimientoCepa(cepa, accion, d, usuario) {
        // Lógica compleja de pases y rehidratación
        const nuevoPase = accion === 'REHIDRATAR' ? d.paseInicial : (parseInt(cepa.pases) + 1);
        if (nuevoPase > 5) throw new Error("Límite de pases alcanzado (GAMP 5 / Farmacopea).");

        const payload = {
            atcc: cepa.atcc,
            microorganismo: cepa.microorganismo,
            pases: nuevoPase,
            estatus: accion === 'INACTIVAR' ? 'Inactiva' : 'Activa',
            fecha_movimiento: new Date().toISOString(),
            usuario: usuario,
            id_tubo: accion === 'REHIDRATAR' ? `${d.abreviatura}-S` : `${cepa.id_tubo}-${d.letraRama || 'R'}`
        };

        const { error } = await sb.from('inv_cepas').insert([payload]);
        if (error) throw error;
        await this.registrarAudit('Microbiología', accion, `Movimiento en cepa ${cepa.microorganismo}`, usuario);
    },

    // --- EQUIPOS ---
    async registrarCalibracion(cod, fecha, notas, usuario) {
        const { error } = await sb.from('log_mantenimiento').insert([{
            codigo_equipo: cod,
            fecha: fecha,
            tipo: 'Calibración Externa',
            descripcion: notas,
            responsable: usuario
        }]);
        if (error) throw error;
        
        const proxima = new Date(fecha);
        proxima.setMonth(proxima.getMonth() + 12);
        
        await sb.from('equipos_calibracion').update({ 
            ultima_cal: fecha, 
            proxima_cal: proxima.toISOString() 
        }).eq('codigo', cod);
    },

    // --- AUDITORÍA ---
    async registrarAudit(modulo, accion, detalle, usuario = 'Sistema') {
        await sb.from('audit_trail').insert([{
            modulo, accion, detalle, usuario, fecha: new Date().toISOString()
        }]);
    },

    async obtenerInventarios() {
        const stock = await sb.from('inv_recepcion').select('*').neq('estatus', 'Agotado');
        const preparaciones = await sb.from('inv_preparacion').select('*');
        const cepas = await sb.from('inv_cepas').select('*').eq('estatus', 'Activa');
        return { stock: stock.data || [], preparaciones: preparaciones.data || [], cepas: cepas.data || [] };
    },

    async obtenerUsuarios() {
        const { data } = await sb.from('usuarios').select('id, nombre, rol, usuario, area, estatus');
        return data || [];
    },

    async obtenerEquiposBD() {
        const { data, error } = await sb.from('equipos_calibracion').select('*').order('codigo', { ascending: true });
        if (error) throw error;
        return data.map(e => ({
            codigo: e.codigo,
            equipo: e.equipo,
            ubicacion: e.ubicacion,
            proxima: e.proxima_cal,
            ultima: e.ultima_intervencion
        }));
    },

    async obtenerAuditTrailBD() {
        const { data, error } = await sb.from('audit_trail').select('*').order('fecha', { ascending: false }).limit(500);
        if (error) throw error;
        return data;
    },

    async obtenerAlertasCaducidad() {
        const hoy = new Date().toISOString();
        const treintaDias = new Date();
        treintaDias.setDate(treintaDias.getDate() + 30);
        
        const { data: stock } = await sb.from('inv_recepcion').select('nombre, lote_prov, caducidad, categoria').lte('caducidad', treintaDias.toISOString()).neq('estatus', 'Agotado');
        const { data: prep } = await sb.from('inv_preparacion').select('lote, caducidad, tipo').lte('caducidad', treintaDias.toISOString()).neq('estatus', 'Agotado');

        const alertas = [];
        if (stock) stock.forEach(s => alertas.push({ nombre: s.nombre, lote: s.lote_prov, caducidad: s.caducidad, categoria: s.categoria }));
        if (prep) prep.forEach(p => alertas.push({ nombre: p.tipo, lote: p.lote, caducidad: p.caducidad, categoria: 'Preparación' }));

        return alertas.map(a => {
            const diff = Math.ceil((new Date(a.caducidad) - new Date()) / (1000 * 60 * 60 * 24));
            return { ...a, diasRestantes: diff };
        });
    },

    async obtenerUsuarios() {
        const { data, error } = await sb.from('usuarios').select('*').order('nombre');
        if (error) throw error;
        return data;
    },

    async avanzarEstadoMuestra(lote, nuevoEstado, usuario) {
        const { error } = await sb.from('muestras').update({ estatus: nuevoEstado }).eq('lote_interno', lote);
        if (error) throw error;
        await this.registrarAudit('Muestras', 'Cambio de Estado', `Lote ${lote} movido a ${nuevoEstado}`, usuario);
        renderMuestras(); // Refrescar tabla
        showToast(`✅ Muestra movida a ${nuevoEstado}`);
    },

    async prepararDatosParaCoA(loteInterno) {
        // 1. Datos de muestra
        const { data: m, error: e1 } = await sb.from('muestras').select('*').eq('lote_interno', loteInterno).single();
        if (e1) throw e1;

        // 2. Resultados y Firmas
        const { data: resultados, error: e2 } = await sb.from('resultados_analisis').select('*').eq('lote_interno', loteInterno);
        if (e2) throw e2;

        // 3. Usuarios Activos para traducir nombres/roles
        const { data: usuarios } = await sb.from('usuarios').select('*').eq('estatus', 'Activo');
        const traductor = {};
        let jefeQA = "Pendiente";
        let respSanitario = "Pendiente";

        if (usuarios) {
            usuarios.forEach(u => {
                traductor[u.usuario] = u.nombre;
                if (u.rol === 'Jefe de Control de Calidad') jefeQA = u.nombre;
                if (u.rol === 'Responsable Sanitario') respSanitario = u.nombre;
            });
        }

        // Clasificación de analistas por especialidad (FQ / MB)
        const palabrasMB = ['MESOFILO', 'HONGO', 'LEVADURA', 'COLI', 'SALMONELLA', 'AUREUS', 'PSEUDOMONA', 'MICROBIO', 'CUENTA', 'ENTEROBAC'];
        const firmasFQ = new Set();
        const firmasMB = new Set();

        resultados.forEach(r => {
            const nombre = traductor[r.analista] || r.analista;
            const esMB = palabrasMB.some(p => r.prueba.toUpperCase().includes(p));
            if (esMB) firmasMB.add(nombre); else firmasFQ.add(nombre);
        });

        return {
            muestra: {
                loteInterno: m.lote_interno,
                producto: m.producto,
                fechaIngreso: m.fecha_ingreso,
                numAnalisis: m.num_analisis || 'N/A',
                estatus: m.estatus,
                analistaFQ: Array.from(firmasFQ).join(' / ') || 'N/A',
                analistaMB: Array.from(firmasMB).join(' / ') || 'N/A',
                jefeQA,
                respSanitario,
                fechaLiberacion: m.fecha_liberacion
            },
            resultados: resultados.map(r => ({
                prueba: r.prueba,
                especificacion: r.especificacion || 'N/A',
                resultado: r.resultado,
                evaluacion: r.evaluacion
            }))
        };
    }
};

// Proxy para compatibilidad con código antiguo
window.google = {
    script: {
        run: new Proxy({}, {
            get: (target, prop) => {
                return (...args) => {
                    if (LIMS[prop]) return LIMS[prop](...args);
                    console.warn(`Función ${prop} no implementada en el proxy.`);
                };
            }
        })
    }
};
