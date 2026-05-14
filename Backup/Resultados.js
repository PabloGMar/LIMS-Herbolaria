/**
 * ============================================================================
 * ARCHIVO: Resultados.gs
 * RESPONSABILIDAD: Captura de resultados, evaluación de límites y firmas.
 * ============================================================================
 */

/**
 * 1. INTELIGENCIA DE EVALUACIÓN
 * Compara el valor ingresado contra la especificación (soporta rangos, min, max y texto).
 */
function evaluarResultadoRealBackend(valorIngresado, especificacion) {
    if (!valorIngresado || String(valorIngresado).trim() === '') return 'En Proceso';

    let valStr = String(valorIngresado).trim();
    let specStr = String(especificacion).trim().toLowerCase();

    // Evaluaciones cualitativas directas
    if (valStr.toLowerCase() === 'cumple con la prueba') return 'Cumple';
    if (valStr.toLowerCase() === 'no cumple con la prueba') return 'OOS';

    const sinonimosCero = ['ausencia', 'ausente', 'no detectado', 'nd', 'negativo'];
    if (sinonimosCero.some(s => valStr.toLowerCase() === s || valStr.toLowerCase().includes(s))) {
        if (/[<≤]|ausencia|negativo|max|máx|menor/.test(specStr)) return 'Cumple';
    }

    if (!/\d/.test(specStr)) {
        if (specStr.includes(valStr.toLowerCase()) || valStr.toLowerCase().includes(specStr)) return 'Cumple';
        return 'OOS';
    }

    let valNumericoStr = valStr.replace(/,/g, '').replace(/[<>≤≥=]/g, '').trim();
    let val = parseFloat(valNumericoStr);
    if (isNaN(val)) return 'OOS';

    // Limpieza de caracteres especiales para lógica matemática
    let specClean = specStr
        .replace(/&le;|&#8804;/g, '≤')
        .replace(/&ge;|&#8805;/g, '≥')
        .replace(/&lt;|&#60;/g, '<')
        .replace(/&gt;|&#62;/g, '>')
        .replace(/,/g, '');

    // Lógica de Rangos (ej: 4.5 - 5.5)
    let matchRango = specClean.match(/([0-9.]+)\s*[-–—]\s*([0-9.]+)/);
    if (matchRango) {
        return (val >= parseFloat(matchRango[1]) && val <= parseFloat(matchRango[2])) ? 'Cumple' : 'OOS';
    }

    // Lógica de Máximos
    let matchMenor = specClean.match(/(?:[<≤]|max|máx|menor|no m[aá]s).*?([0-9.]+)/);
    if (matchMenor) {
        return (val <= parseFloat(matchMenor[1])) ? 'Cumple' : 'OOS';
    }

    // Lógica de Mínimos
    let matchMayor = specClean.match(/(?:[>≥]|min|mín|mayor|no menos).*?([0-9.]+)/);
    if (matchMayor) {
        return (val >= parseFloat(matchMayor[1])) ? 'Cumple' : 'OOS';
    }

    return 'OOS';
}

/**
 * 2. GUARDADO DE RESULTADOS (TRAZABILIDAD ANALÍTICA)
 */
function guardarResultadosYDictamen(loteI, resultadosArray, dictamenFinal, usuarioActual) {
    try {
        resultadosArray.forEach(item => {
            const query = `lote_interno=eq.${loteI}&prueba=eq.${item.prueba}`;
            const existente = getFromSupabase('resultados_analisis', query);

            const payload = {
                lote_interno: loteI,
                prueba: item.prueba,
                especificacion: item.espec,
                resultado: item.resultado,
                evaluacion: item.evaluacion,
                fecha_registro: new Date().toISOString(),
                usuario: usuarioActual
            };

            if (existente && existente.length > 0) {
                patchSupabase('resultados_analisis', `id=eq.${existente[0].id}`, payload);
            } else {
                postToSupabase('resultados_analisis', payload);
            }
        });

        // Actualizar estatus en la tabla de muestras
        patchSupabase('muestras', `lote_interno=eq.${loteI}`, { estatus: dictamenFinal });

        registrarAuditTrail(usuarioActual, 'Resultados', 'Captura de Resultados', `Lote: ${loteI} | Dictamen: ${dictamenFinal}`);
        return { success: true, mensaje: "Resultados guardados correctamente en Supabase." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 3. FIRMA ELECTRÓNICA (DICTAMEN Y LIBERACIÓN)
 */
function dictaminarMuestraConFirma(loteInterno, nuevoEstatus, usuarioLogin, passwordIntento) {
    try {
        const auth = loginInterno(usuarioLogin, computeSHA256(passwordIntento));
        if (!auth.success) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Dictamen", "Firma Fallida", `Intento fallido en lote ${loteInterno}.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        patchSupabase('muestras', `lote_interno=eq.${loteInterno}`, { estatus: nuevoEstatus });
        registrarAuditTrail(usuarioLogin, "Dictamen", "Firma Electrónica Aplicada", `Lote ${loteInterno} -> [${nuevoEstatus}] por ${auth.nombre}.`);

        return { success: true, mensaje: "Firma aplicada correctamente en Supabase." };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function liberarMasivoConFirma(lotesArray, usuarioLogin, passwordIntento) {
    try {
        const auth = loginInterno(usuarioLogin, computeSHA256(passwordIntento));
        if (!auth.success) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Liberación", "Firma Electrónica Fallida", `Intento fallido de liberación masiva.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        lotesArray.forEach(lote => {
            patchSupabase('muestras', `lote_interno=eq.${lote}`, { estatus: 'Liberado' });
        });

        registrarAuditTrail(usuarioLogin, "Liberación", "Firma Electrónica Aplicada", `[${lotesArray.length}] lotes liberados por ${auth.nombre}`);
        return { success: true, mensaje: `${lotesArray.length} lotes Liberados con éxito en Supabase.` };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function obtenerDatosCertificadosMasivo(lotesArray) {
    try {
        const lotesQuery = lotesArray.map(l => `"${l}"`).join(',');
        const muestras = getFromSupabase('muestras', `lote_interno=in.(${lotesQuery})`);
        const resultados = getFromSupabase('resultados_analisis', `lote_interno=in.(${lotesQuery})`);

        if (!muestras || muestras.length === 0) throw new Error("No se encontraron datos para los lotes seleccionados.");

        const certificados = muestras.map(m => {
            const resLote = resultados.filter(r => r.lote_interno === m.lote_interno);
            return {
                muestra: {
                    loteInterno: m.lote_interno,
                    producto: m.producto,
                    loteProv: m.lote_prov,
                    cantidad: m.cantidad,
                    estatus: m.estatus,
                    fechaIngreso: m.fecha_ingreso,
                    numAnalisis: m.num_analisis
                },
                resultados: resLote.map(r => ({
                    prueba: r.prueba,
                    especificacion: r.especificacion,
                    resultado: r.resultado,
                    evaluacion: r.evaluacion
                })),
                fechaAnalisis: resLote.length > 0 ? resLote[0].fecha_registro : m.fecha_ingreso
            };
        });

        return { success: true, certificados };
    } catch (e) {
        return { success: false, error: e.message };
    }
}