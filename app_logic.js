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
                numAnalisis: m.num_analisis,
                esEstabilidad: m.tipo_analisis === 'Estabilidad',
                codEstabilidad: m.codigo_estabilidad
            };
        });

        // Actualizar UI de contadores
        if (document.getElementById('stat-cuarentena')) document.getElementById('stat-cuarentena').textContent = cC;
        if (document.getElementById('stat-analisis')) document.getElementById('stat-analisis').textContent = cA;
        if (document.getElementById('stat-aprobados')) document.getElementById('stat-aprobados').textContent = cL;
        if (document.getElementById('stat-rechazados')) document.getElementById('stat-rechazados').textContent = cR;

        return mapped;
    },

    async obtenerPlanDeAnalisis(producto, loteInterno) {
        // 1. Obtener datos de la muestra
        const { data: muestra, error: e1 } = await sb.from('muestras')
            .select('producto, estatus')
            .eq('lote_interno', loteInterno).eq('producto', producto)
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
            .eq('lote_interno', loteInterno).eq('producto', producto);

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

    async guardarResultado(producto, loteInterno, prueba, valor, usuario) {
        // Obtener especificación para evaluar (desde pruebas_especificas_pt)
        const { data: spec } = await sb.from('pruebas_especificas_pt')
            .select('limite')
            .eq('prueba', prueba)
            .limit(1)
            .single();

        const evaluacion = this.evaluarResultado(valor, spec ? spec.limite : '');

        const payload = {
            lote_interno: loteInterno, producto: producto,
            prueba: prueba,
            resultado: valor,
            evaluacion: evaluacion,
            analista: usuario,
            fecha: new Date().toISOString(),
            especificacion: spec ? spec.limite : ''
        };

        const { error } = await sb.from('resultados_analisis').upsert(payload, { onConflict: 'producto, lote_interno, prueba' });
        if (error) throw error;

        // Intento seguro de Registro de Firma Electrónica por Rol (FQ / MB)
        try {
            const { data: user } = await sb.from('usuarios').select('rol, nombre').eq('usuario', usuario).single();
            if (user) {
                const role = user.rol.toLowerCase();
                const upMuestra = {};
                if (role.includes('fisicoqu')) upMuestra.analista_fq = user.nombre;
                if (role.includes('microbio')) upMuestra.analista_mb = user.nombre;
                
                if (Object.keys(upMuestra).length > 0) {
                    // Update parcial solo si las columnas existen (PostgREST ignorará si fallan o podemos capturar)
                    await sb.from('muestras').update(upMuestra).eq('lote_interno', loteInterno).eq('producto', producto);
                }
            }
        } catch (e) { console.warn("Columnas analista_fq/mb no encontradas en 'muestras'.", e); }

        await this.registrarAudit('Resultados', 'Captura', `Lote: ${loteInterno} | Prueba: ${prueba} | Val: ${valor}`, usuario);
        
        return { evaluacion };
    },

    async dictaminarMuestra(producto, loteInterno, dictamen, usuario) {
        const { data: user } = await sb.from('usuarios').select('nombre').eq('usuario', usuario).single();
        const payload = { 
            estatus: dictamen,
            dictaminador: user?.nombre || usuario
        };

        const { error } = await sb.from('muestras').update(payload).eq('lote_interno', loteInterno).eq('producto', producto);
        if (error) {
            await sb.from('muestras').update({ estatus: dictamen }).eq('lote_interno', loteInterno).eq('producto', producto);
        }

        await this.registrarAudit('Muestras', 'Dictamen', `Lote: ${loteInterno} -> ${dictamen}`, usuario);
    },

    async avanzarEstadoMuestra(producto, loteInterno, nuevoEstado, usuario) {
        const { error } = await sb.from('muestras')
            .update({ estatus: nuevoEstado })
            .eq('lote_interno', loteInterno).eq('producto', producto);
        
        if (error) throw error;
        await this.registrarAudit('Muestras', 'Flujo', `Lote: ${loteInterno} -> ${nuevoEstado}`, usuario);
    },

    async ingresarMuestra(d, usuario) {
        const payload = {
            lote_interno: d.loteInterno,
            producto: d.producto,
            lote_prov: d.loteProv || null,
            cantidad: d.cantidad + " " + d.unidad,
            num_analisis: d.numAnalisis,
            fecha_ingreso: new Date().toISOString(),
            estatus: 'Cuarentena',
            usuario: usuario,
            tipo_analisis: d.esEstabilidad ? 'Estabilidad' : 'Rutina',
            codigo_estabilidad: d.codEstabilidad || ""
        };
        const { error } = await sb.from('muestras').insert([payload]);
        if (error) throw error;
        await this.registrarAudit('Muestras', 'Recepción', `Registro de lote ${d.loteInterno} | Estabilidad: ${d.esEstabilidad ? 'Sí' : 'No'}`, usuario);
    },

    async obtenerListaProductos() {
        const { data, error } = await sb.from('productos_pt').select('nombre').order('nombre');
        if (error) throw error;
        return data.map(p => p.nombre);
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
            resultado = (conc * vol) / 1000; 
        } else if (tipo === 'molar') {
            // Ejemplo: PM Promedio de reactivos comunes = 100 g/mol
            // En producción real esto vendría del inventario
            resultado = conc * (vol / 1000) * 100; 
        } else if (tipo === 'normal') {
            // Asumiendo equivalente de 1 para demo
            resultado = conc * (vol / 1000) * 100;
        }

        resText.textContent = `${resultado.toFixed(4)} ${unidad}`;
        resBox.classList.remove('hidden');
    },

    async guardarNuevaPreparacion(d, usuario) {
        // Nomenclatura Legacy: ID_Insumo-DDMMYY-X (Soluciones) o MED-DDMMYY-X (Medios)
        const hoy = new Date();
        const fechaCod = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '');
        const prefijo = d.tipo === 'medio' ? 'MED' : (d.idInsumoBase || 'PRP');
        const baseLote = `${prefijo}-${fechaCod}`;
        
        // Simular contador (en producción real esto se consultaría en la BD)
        const loteFinal = `${baseLote}-${Math.floor(Math.random() * 900) + 100}`;
        
        // Receta detallada (Legacy D)
        const recetaTexto = `${d.reactivo} -> Teórico: ${d.volTeorico} g | Real: ${d.cantReal} g ${d.tipo === 'medio' ? '| pH Final: ' + d.phFinal : ''}`;

        const payload = {
            lote: loteFinal,
            tipo: d.tipo,
            vol_final: `${d.volumen} mL`,
            receta: recetaTexto,
            concentracion: d.concentracion || "N/A",
            fecha_preparacion: hoy.toISOString(),
            caducidad: d.caducidad,
            ph_inicial: d.phInicial || null,
            ph_final: d.phFinal || null,
            estatus: 'Liberado',
            usuario: usuario
        };

        const { error } = await sb.from('inv_preparacion').insert([payload]);
        if (error) throw error;

        await this.registrarAudit('Inventario', 'Preparación', `Nueva preparación: ${loteFinal} | Real: ${d.cantReal}g`, usuario);
        return loteFinal;
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
        try {
            // Nota: fecha_liberacion removida del select por error 42703 (columna inexistente)
            const { data: muestras, error: e1 } = await sb.from('muestras').select('fecha_ingreso, estatus, created_at');
            const { data: oos, error: e2 } = await sb.from('resultados_analisis').select('prueba').eq('evaluacion', 'OOS');

            if (!muestras) return console.warn("No se pudieron cargar muestras para KPI.");

            // Lead Time Promedio (Días entre ingreso y creación - fallback)
            let totalDays = 0;
            let countLib = 0;
            muestras.forEach(m => {
                if (m.estatus === 'Liberado' && m.fecha_ingreso) {
                    const fin = m.created_at || new Date().toISOString();
                    const diff = (new Date(fin) - new Date(m.fecha_ingreso)) / (1000 * 60 * 60 * 24);
                    totalDays += Math.max(0, diff);
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
            if (paretoEl) {
                if (!oos || oos.length === 0) {
                    paretoEl.innerHTML = '<p class="text-emerald-500 text-xs font-bold">✅ Sin desviaciones OOS registradas.</p>';
                } else {
                    const counts = {};
                    oos.forEach(o => counts[o.prueba] = (counts[o.prueba] || 0) + 1);
                    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    paretoEl.innerHTML = sorted.map(([p, c]) => `
                        <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span class="text-[10px] font-bold text-slate-600">${p}</span>
                            <span class="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-black">${c}</span>
                        </div>
                    `).join('');
                }
            }
            
            this.renderCharts(muestras);
        } catch (err) {
            console.error("Error en cargarKPIs:", err);
        }
    },

    renderCharts(muestras) {
        const ctxEstatus = document.getElementById('chartEstatus');
        const ctxAnalistas = document.getElementById('chartAnalistas');
        if (!ctxEstatus) return;

        // 1. Gráfico de Estatus
        const counts = { Cuarentena: 0, Análisis: 0, Liberado: 0, Rechazado: 0 };
        muestras.forEach(m => {
            if (m.estatus === 'Cuarentena') counts.Cuarentena++;
            else if (m.estatus === 'En Análisis') counts.Análisis++;
            else if (m.estatus === 'Liberado') counts.Liberado++;
            else counts.Rechazado++;
        });

        if (window.myChartEstatus) window.myChartEstatus.destroy();
        window.myChartEstatus = new Chart(ctxEstatus, {
            type: 'doughnut',
            data: {
                labels: ['Cuarentena', 'Análisis', 'Liberado', 'Rechazado'],
                datasets: [{
                    data: [counts.Cuarentena, counts.Análisis, counts.Liberado, counts.Rechazado],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9, weight: 'bold' } } } }
            }
        });

        // 2. Gráfico de Analistas
        if (!ctxAnalistas) return;
        const analistasMap = {};
        muestras.forEach(m => {
            if (m.usuario) {
                analistasMap[m.usuario] = (analistasMap[m.usuario] || 0) + 1;
            }
        });

        const labels = Object.keys(analistasMap);
        const values = Object.values(analistasMap);

        if (window.myChartAnalistas) window.myChartAnalistas.destroy();
        window.myChartAnalistas = new Chart(ctxAnalistas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Muestras Procesadas',
                    data: values,
                    backgroundColor: '#6366f1',
                    borderRadius: 8,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 9 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 9 } } }
                },
                plugins: { legend: { display: false } }
            }
        });
    },

    async compilarDatosRAP(producto, anio) {
        const fechaInicio = `${anio}-01-01T00:00:00`;
        const fechaFin = `${anio}-12-31T23:59:59`;

        // 1. Obtener muestras del periodo
        const { data: muestras, error: e1 } = await sb.from('muestras')
            .select('lote_interno, created_at')
            .eq('producto', producto)
            .gte('created_at', fechaInicio)
            .lte('created_at', fechaFin);
        
        if (e1) throw e1;
        if (!muestras || muestras.length === 0) return { success: false, error: "No hay datos para este producto en el año seleccionado." };

        const lotes = muestras.map(m => m.lote_interno);

        // 2. Obtener resultados de esos lotes
        const { data: resultados, error: e2 } = await sb.from('resultados_analisis')
            .select('*')
            .in('lote_interno', lotes);
        
        if (e2) throw e2;

        // 3. Procesar Tendencias
        const pruebas = {};
        const oos = [];

        resultados.forEach(r => {
            if (!pruebas[r.prueba]) pruebas[r.prueba] = { n: 0, valores: [], min: Infinity, max: -Infinity };
            
            const valNum = parseFloat(r.resultado.replace(/[^\d.-]/g, ''));
            if (!isNaN(valNum)) {
                pruebas[r.prueba].valores.push(valNum);
                pruebas[r.prueba].min = Math.min(pruebas[r.prueba].min, valNum);
                pruebas[r.prueba].max = Math.max(pruebas[r.prueba].max, valNum);
            }
            pruebas[r.prueba].n++;

            if (r.evaluacion === 'OOS') {
                oos.push(r);
            }
        });

        const tendencias = Object.entries(pruebas).map(([nombre, p]) => {
            const sum = p.valores.reduce((a, b) => a + b, 0);
            const prom = p.valores.length > 0 ? (sum / p.valores.length).toFixed(4) : "N/A";
            return {
                prueba: nombre,
                n: p.n,
                min: p.min === Infinity ? "N/A" : p.min,
                max: p.max === -Infinity ? "N/A" : p.max,
                promedio: prom
            };
        });

        return {
            success: true,
            tendencias,
            oos,
            totalLotes: lotes.length
        };
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

    async registrarNuevoEquipo(d, usuario) {
        let frecuencia = parseInt(d.frecuencia) || 12;
        let ultima = new Date(d.ultima);
        let proxima = new Date(ultima);
        proxima.setMonth(proxima.getMonth() + frecuencia);

        const payload = {
            codigo: d.codigo.trim().toUpperCase(),
            equipo: d.equipo.trim(),
            ubicacion: d.ubicacion.trim().toUpperCase(),
            proveedor: d.proveedor.trim(),
            proxima_cal: proxima.toISOString(),
            ultima_intervencion: ultima.toISOString()
        };

        const { error } = await sb.from('equipos_calibracion').insert([payload]);
        if (error) throw error;

        await this.registrarAudit('Equipos', 'Alta de Equipo', `Registrado: ${payload.equipo} (${payload.codigo})`, usuario);
    },

    // --- INSUMOS (STOCK) ---
    async registrarNuevoInsumo(d, usuario) {
        let prefijo = "R";
        if (d.categoria === "Solventes") prefijo = "S";
        else if (d.categoria === "Estándares") prefijo = "SRP";

        const hoy = new Date();
        const fechaCod = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '');
        const baseID = `${prefijo}-${fechaCod}`;
        const idFinal = `${baseID}/${Math.floor(Math.random() * 90) + 10}`;

        const payload = {
            id_insumo: idFinal,
            categoria: d.categoria,
            nombre: d.nombre,
            proveedor: d.proveedor,
            lote_prov: d.loteProv,
            presentacion: d.presentacion,
            fecha_recepcion: hoy.toISOString(),
            fecha_apertura: null,
            caducidad: d.caducidad,
            estatus: 'Cuarentena'
        };

        const { error } = await sb.from('inv_recepcion').insert([payload]);
        if (error) throw error;

        await this.registrarAudit('Inventario', 'Recepción Insumo', `Nuevo ingreso: ${idFinal} (${d.nombre})`, usuario);
        return idFinal;
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

    async prepararDatosParaCoA(producto, loteInterno) {
        // 1. Datos de muestra
        const { data: m, error: e1 } = await sb.from('muestras').select('*').eq('lote_interno', loteInterno).eq('producto', producto).single();
        if (e1) throw e1;

        // 2. Resultados y Firmas
        const { data: resultados, error: e2 } = await sb.from('resultados_analisis').select('*').eq('lote_interno', loteInterno).eq('producto', producto);
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
