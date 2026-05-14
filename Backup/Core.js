/**
 * ============================================================================
 * ARCHIVO: Core.gs
 * RESPONSABILIDAD: Configuración global y funciones de infraestructura (UI/Utilidades).
 * ============================================================================
 */

// 1. CONFIGURACIÓN MAESTRA (LOGO ACORTADO PARA ESTABILIDAD)
const LOGO_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; 

const CONFIG = {
    NOMBRE_SISTEMA: "LIMS Herbolaria",
    VERSION: "2.5.1",
    ZONA_HORARIA: Session.getScriptTimeZone()
};

/**
 * Función principal que sirve la aplicación web.
 */
function doGet(e) {
    return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle(CONFIG.NOMBRE_SISTEMA)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función de utilidad para incluir archivos HTML (CSS, Scripts, Modales)
 */
function include(filename) {
    try {
        return HtmlService.createHtmlOutputFromFile(filename).getContent();
    } catch (e) {
        console.error("Error al incluir archivo: " + filename);
        return "";
    }
}

/**
 * Obtiene la fecha y hora actual formateada según el servidor (CFR 21 Part 11)
 */
function obtenerHoraServidor() {
    return Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, "dd/MM/yyyy HH:mm:ss");
}

/**
 * Formatea una fecha ISO a formato español legible (dd-Mes-aaaa)
 */
function formatearFechaEspanol(isoString) {
    if (!isoString) return '';
    const f = new Date(isoString);
    if (isNaN(f)) return isoString;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${f.getDate().toString().padStart(2, '0')}-${meses[f.getMonth()]}-${f.getFullYear().toString()}`;
}

/**
 * Obtiene el logo procesado para reportes PDF
 */
function obtenerLogoBase64() {
    return "data:image/png;base64," + LOGO_BASE64;
}