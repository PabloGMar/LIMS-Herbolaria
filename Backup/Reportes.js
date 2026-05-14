/**
 * ============================================================================
 * ARCHIVO: Reportes.js
 * RESPONSABILIDAD: Generación de indicadores, alertas y reportes vía Supabase.
 * ============================================================================
 */

/**
 * 1. MÓDULO DE INTELIGENCIA (KPIs)
 */
function obtenerDatosInteligenciaKPI() {
    try {
        const muestras = getFromSupabase('muestras', 'select=estatus,fecha_ingreso,lote_interno');
        const resultados = getFromSupabase('resultados_analisis', 'select=evaluacion,prueba,fecha_registro,lote_interno');

        if (!muestras || !resultados) throw new Error("Error al recuperar datos de analítica.");

        let lotesTotales = muestras.length;
        let lotesRechazados = muestras.filter(m => m.estatus === 'Rechazado').length;
        let tasaRechazo = lotesTotales > 0 ? ((lotesRechazados / lotesTotales) * 100).toFixed(2) : 0;

        let totalPruebas = resultados.length;
        let pruebasCumple = resultados.filter(r => r.evaluacion === 'Cumple').length;
        let tasaRFT = totalPruebas > 0 ? ((pruebasCumple / totalPruebas) * 100).toFixed(2) : 0;

        // Pareto de OOS
        let conteoOOS = {};
        resultados.filter(r => r.evaluacion === 'OOS').forEach(r => {
            conteoOOS[r.prueba] = (conteoOOS[r.prueba] || 0) + 1;
        });
        let topOOS = Object.keys(conteoOOS).map(p => ({ prueba: p, cantidad: conteoOOS[p] }))
            .sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

        // Lead Time Promedio (Liberados)
        let totalDias = 0;
        let countLib = 0;
        muestras.filter(m => m.estatus === 'Liberado').forEach(m => {
            const fIng = new Date(m.fecha_ingreso);
            const resLote = resultados.filter(r => r.lote_interno === m.lote_interno);
            if (resLote.length > 0) {
                const fLib = new Date(Math.max(...resLote.map(r => new Date(r.fecha_registro))));
                const diff = (fLib - fIng) / (1000 * 3600 * 24);
                if (diff >= 0) { totalDias += diff; countLib++; }
            }
        });
        let leadTimePromedio = countLib > 0 ? (totalDias / countLib).toFixed(1) : 0;

        return {
            success: true,
            kpis: { lotesTotales, lotesRechazados, tasaRechazo, totalPruebas, tasaRFT, topOOS, leadTimePromedio }
        };
    } catch (error) { return { success: false, error: error.message }; }
}

/**
 * 2. ALERTAS DE CADUCIDAD
 */
function obtenerAlertasCaducidad() {
    try {
        const hoy = new Date();
        let alertas = [];

        // 1. Insumos (90 días)
        const limInsumos = new Date(); limInsumos.setDate(hoy.getDate() + 90);
        const insumos = getFromSupabase('inv_recepcion', `caducidad=lte.${limInsumos.toISOString()}&estatus=neq.Agotado`);
        if (insumos) {
            insumos.forEach(i => {
                const fCad = new Date(i.caducidad);
                alertas.push({
                    lote: i.lote_prov, nombre: i.nombre, categoria: 'Insumo',
                    dias: Math.ceil((fCad - hoy) / (1000 * 60 * 60 * 24))
                });
            });
        }

        // 2. Preparaciones (7 días)
        const limPrep = new Date(); limPrep.setDate(hoy.getDate() + 7);
        const preps = getFromSupabase('inv_preparacion', `caducidad=lte.${limPrep.toISOString()}&estatus=eq.Liberado`);
        if (preps) {
            preps.forEach(p => {
                const fCad = new Date(p.caducidad);
                alertas.push({
                    lote: p.lote, nombre: p.tipo, categoria: 'Preparación',
                    dias: Math.ceil((fCad - hoy) / (1000 * 60 * 60 * 24))
                });
            });
        }

        // 3. Equipos (45 días)
        const limEquipos = new Date(); limEquipos.setDate(hoy.getDate() + 45);
        const equipos = getFromSupabase('equipos_calibracion', `proxima_cal=lte.${limEquipos.toISOString()}`);
        if (equipos) {
            equipos.forEach(e => {
                const fCad = new Date(e.proxima_cal);
                alertas.push({
                    lote: e.codigo, nombre: e.equipo, categoria: 'Equipo',
                    dias: Math.ceil((fCad - hoy) / (1000 * 60 * 60 * 24))
                });
            });
        }

        return alertas.sort((a, b) => a.dias - b.dias);
    } catch (e) { return []; }
}

/**
 * 3. LOGS DE AUDITORÍA (AUDIT TRAIL)
 */
function obtenerAuditTrailBD() {
    try {
        const res = getFromSupabase('audit_trail', 'select=*&order=fecha.desc&limit=100');
        return res || [];
    } catch (e) { return []; }
}

/**
 * 4. REPORTES ANUALES (RAP)
 */
function obtenerListaProductos() {
    try {
        const res = getFromSupabase('productos_pt', 'select=producto');
        if (!res) return [];
        return [...new Set(res.map(r => r.producto))].sort();
    } catch (e) { return []; }
}

function compilarDatosRAP(productoSeleccionado, anioSeleccionado) {
    try {
        const muestras = getFromSupabase('muestras', `producto=eq.${productoSeleccionado}`);
        if (!muestras) throw new Error("No hay muestras para este producto.");

        const filtradas = muestras.filter(m => new Date(m.fecha_ingreso).getFullYear().toString() === anioSeleccionado);
        const lotesIDs = filtradas.map(m => m.lote_interno);

        let conteo = { totales: filtradas.length, aprobados: 0, rechazados: 0, enProceso: 0 };
        filtradas.forEach(m => {
            if (m.estatus === 'Liberado') conteo.aprobados++;
            else if (m.estatus === 'Rechazado') conteo.rechazados++;
            else conteo.enProceso++;
        });

        const queryResultados = `lote_interno=in.(${lotesIDs.join(',')})`;
        const resultados = getFromSupabase('resultados_analisis', queryResultados);

        let desviacionesOOS = [];
        if (resultados) {
            resultados.forEach(r => {
                if (r.evaluacion === 'OOS') {
                    desviacionesOOS.push({ lote: r.lote_interno, prueba: r.prueba, resultado: r.resultado });
                }
                let valorNum = parseFloat(String(r.resultado).replace(/[<>\s≤≥,]/g, ''));
                if (!isNaN(valorNum)) {
                    if (!dataTendencias[r.prueba]) dataTendencias[r.prueba] = { espec: r.especificacion, valores: [] };
                    dataTendencias[r.prueba].valores.push(valorNum);
                }
            });
        }

        let tendencias = Object.keys(dataTendencias).map(prueba => {
            let v = dataTendencias[prueba].valores;
            return {
                prueba, especificacion: dataTendencias[prueba].espec, n_datos: v.length,
                min: Math.min(...v), max: Math.max(...v), promedio: (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2)
            };
        });

        return { success: true, resumenLotes: conteo, tendencias, desviacionesOOS };
    } catch (e) { return { success: false, error: e.message }; }
}