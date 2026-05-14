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
        const { data, error } = await sb.from('muestras')
            .select('*')
            .order('fecha_ingreso', { ascending: false });
        
        return (data || []).map(m => ({
            loteInterno: m.lote_interno,
            producto: m.producto,
            estatus: m.estatus,
            fechaIngreso: m.fecha_ingreso,
            tipoAnalisis: m.tipo_analisis
        }));
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
            usuario_registro: usuario
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

        // 1. Cualitativos Directos
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
            // Si no es numérico, comparación de texto simple
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

    // --- CALCULADORA QUÍMICA (INVENTARIOS) ---
    calcularPreparacion(r, d) {
        // r: datos del reactivo, d: datos de la preparación (volumen, concentración, tipo)
        let volL = parseFloat(d.volumen) / 1000;
        let conc = parseFloat(d.concentracion);
        let pureza = (r.pureza || 100) / 100;
        let pm = r.pm || 0;

        if (d.tipo === 'Medio Simple') {
            let factor = r.factor_prep || 0;
            return { teorico: (factor * volL).toFixed(3), unidad: 'g' };
        }
        if (d.tipo === 'Solución Molar') {
            let masa = (conc * volL * pm) / pureza;
            if (r.densidad > 0) return { teorico: (masa / r.densidad).toFixed(2), unidad: 'mL' };
            return { teorico: masa.toFixed(4), unidad: 'g' };
        }
        return { teorico: 0, unidad: '?' };
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
        const { error } = await sb.from('equipos_log').insert([{
            equipo_cod: cod,
            fecha: fecha,
            tipo: 'Calibración Externa',
            descripcion: notas,
            responsable: usuario
        }]);
        if (error) throw error;
        
        // Calcular próxima fecha (ej: +12 meses)
        const proxima = new Date(fecha);
        proxima.setMonth(proxima.getMonth() + 12);
        
        await sb.from('equipos').update({ 
            ultima_calibracion: fecha, 
            proxima_calibracion: proxima.toISOString() 
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
