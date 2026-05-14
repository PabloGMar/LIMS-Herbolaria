/**
 * ============================================================================
 * ARCHIVO: Muestras.gs
 * RESPONSABILIDAD: Gestión del ciclo de vida de las muestras (Ingreso a Dictamen).
 * ============================================================================
 */

/**
 * 1. INGRESO DE MUESTRAS
 * Registra una nueva muestra en Supabase.
 */
function ingresarMuestra(datos, usuarioActual) {
    try {
        const payload = {
            lote_interno: datos.loteInterno,
            producto: datos.producto,
            lote_prov: datos.loteProv,
            cantidad: datos.cantidad + " " + datos.unidad,
            estatus: 'Cuarentena',
            fecha_ingreso: new Date().toISOString(),
            num_analisis: datos.numAnalisis,
            es_estabilidad: datos.esEstabilidad,
            cod_estabilidad: datos.codEstabilidad || ""
        };

        postToSupabase('muestras', payload);
        registrarAuditTrail(usuarioActual, 'Muestras', 'Ingreso de Muestra', `Lote: ${datos.loteInterno} | Prod: ${datos.producto}`);

        return { success: true, mensaje: "Muestra registrada en Supabase." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 2. CONTROL DE ESTATUS
 */
function cambiarEstatusMuestra(loteInterno, nuevoEstatus, usuarioActual) {
    try {
        patchSupabase('muestras', `lote_interno=eq.${loteInterno}`, { estatus: nuevoEstatus });
        registrarAuditTrail(usuarioActual, 'Muestras', 'Cambio de Estatus', `Lote: ${loteInterno} -> ${nuevoEstatus}`);

        return { success: true, mensaje: `Estatus actualizado a ${nuevoEstatus}` };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function iniciarAnalisisMasivo(lotesArray, usuarioActual) {
    try {
        lotesArray.forEach(lote => {
            patchSupabase('muestras', `lote_interno=eq.${lote}`, { estatus: 'En Análisis' });
        });
        registrarAuditTrail(usuarioActual, 'Muestras', 'Inicio Analítico', `Lotes: ${lotesArray.join(', ')}`);
        return { success: true, mensaje: "Lotes pasados a En Análisis." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 3. CONSULTAS DE MUESTRAS Y PLANES
 */
function obtenerMuestrasPorEstatus(estatus) {
    try {
        const res = getFromSupabase('muestras', `estatus=eq.${estatus}&order=fecha_ingreso.desc`);
        if (!res) return [];
        return res.map(m => ({
            loteInterno: m.lote_interno,
            producto: m.producto,
            loteProv: m.lote_prov,
            cantidad: m.cantidad,
            estatus: m.estatus,
            fechaIngreso: m.fecha_ingreso,
            numAnalisis: m.num_analisis,
            tipoAnalisis: m.tipo_analisis,
            codEstabilidad: m.cod_estabilidad
        }));
    } catch (e) {
        return [];
    }
}

function obtenerPlanDeAnalisisPT(producto, loteInterno) {
    try {
        const plan = getFromSupabase('productos_pt', `producto=eq.${producto}&order=id.asc`);
        const resultados = getFromSupabase('resultados_analisis', `lote_interno=eq.${loteInterno}`);

        if (!plan || plan.length === 0) return { success: false, error: "No hay plan de análisis configurado para este producto." };

        const resultadosPrevios = {};
        if (resultados && Array.isArray(resultados)) {
            resultados.forEach(r => {
                resultadosPrevios[r.prueba] = {
                    valor: r.resultado,
                    evaluacion: r.evaluacion
                };
            });
        }

        const planFinal = plan.map(p => ({
            prueba: p.prueba,
            especificacion: p.especificacion,
            tipo: p.tipo_analisis || 'FQ',
            valorPrevio: resultadosPrevios[p.prueba] ? resultadosPrevios[p.prueba].valor : '',
            evaluacionPrevia: resultadosPrevios[p.prueba] ? resultadosPrevios[p.prueba].evaluacion : 'En Proceso'
        }));

        return { success: true, plan: planFinal };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * Obtiene todas las muestras y las clasifica por estatus para el Dashboard principal
 */
/**
 * Obtiene todas las muestras en una lista plana para el Dashboard principal
 */
function obtenerMuestrasDashboard() {
    try {
        // Obtenemos todas las muestras desde Supabase ordenadas por fecha
        const res = getFromSupabase('muestras', 'order=fecha_ingreso.desc');

        // Si no hay respuesta o hay error, devolvemos un arreglo vacío
        if (!res || !Array.isArray(res)) return [];

        // Mapeamos los datos de Supabase (snake_case) al formato que espera tu HTML (camelCase)
        const muestrasPlanas = res.map(m => ({
            loteInterno: m.lote_interno,
            producto: m.producto,
            loteProveedor: m.lote_prov,
            cantidad: m.cantidad,
            estatus: m.estatus,
            fechaIngreso: m.fecha_ingreso,
            numAnalisis: m.num_analisis,
            tipoAnalisis: m.tipo_analisis,
            codEstabilidad: m.codigo_estabilidad
        }));

        return muestrasPlanas;

    } catch (e) {
        console.error("Error en obtenerMuestrasDashboard: ", e.message);
        return []; // Siempre devolver un arreglo para que no rompa el forEach
    }
}