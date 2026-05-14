/**
 * ============================================================================
 * ARCHIVO: Equipos.js
 * RESPONSABILIDAD: Control de Equipos, Metrología y Mantenimiento vía Supabase.
 * ============================================================================
 */

/**
 * 1. CONSULTA DE EQUIPOS
 */
function obtenerEquiposBD() {
    try {
        const res = getFromSupabase('equipos_calibracion', 'order=codigo.asc');
        if (!res) return [];
        return res.map(e => ({
            codigo: e.codigo,
            equipo: e.equipo,
            ubicacion: e.ubicacion,
            frecuencia: e.frecuencia,
            ultimaIntervencion: e.ultima_intervencion,
            proximaCal: e.proxima_cal
        }));
    } catch (e) {
        return [];
    }
}

/**
 * 2. REGISTRO DE MANTENIMIENTO / CALIBRACIÓN
 */
function registrarMantenimiento(datos, usuarioActual) {
    try {
        // Validación de Firma (CFR 21 Parte 11)
        const auth = loginInterno(usuarioActual.usuario, computeSHA256(usuarioActual.password));
        if (!auth.success) return { success: false, error: "Firma Electrónica Inválida." };

        // 1. Registrar en el log de mantenimiento
        const payloadLog = {
            equipo_codigo: datos.equipoCodigo,
            fecha: new Date().toISOString(),
            usuario: usuarioActual.usuario,
            actividad: datos.actividad,
            observaciones: datos.observaciones || "",
            tipo: datos.tipo || "Mantenimiento"
        };
        postToSupabase('log_mantenimiento', payloadLog);

        // 2. Actualizar fecha de próxima calibración/mantenimiento en la ficha del equipo
        const payloadEquipo = {
            ultima_intervencion: new Date().toISOString()
        };
        if (datos.nuevaFechaCal) payloadEquipo.proxima_cal = datos.nuevaFechaCal;

        patchSupabase('equipos_calibracion', `codigo=eq.${datos.equipoCodigo}`, payloadEquipo);

        registrarAuditTrail(usuarioActual.usuario, 'Equipos', 'Mantenimiento', `Equipo: ${datos.equipoCodigo} | Actividad: ${datos.actividad}`);

        return { success: true, mensaje: "Intervención registrada correctamente en Supabase." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 3. HISTORIAL DE UN EQUIPO
 */
function obtenerHistorialEquipo(codigo) {
    try {
        return getFromSupabase('log_mantenimiento', `equipo_codigo=eq.${codigo}&order=fecha.desc`);
    } catch (e) {
        return [];
    }
}