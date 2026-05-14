/**
 * ARCHIVO: ConexionSupabase.gs
 * Módulo dedicado exclusivamente a la comunicación con la base de datos externa.
 */

const SB_URL = "https://lbemzbaytsrtbmkskder.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZW16YmF5dHNydGJta3NrZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQwMjM2MywiZXhwIjoyMDkyOTc4MzYzfQ.GTwONBiJFNsU7gEYSonT-EfcI95E0Swq3iaRGDGD8u0";

/**
 * Función Maestra para Insertar (POST)
 * Uso: postToSupabase('nombre_tabla', {columna1: 'valor', columna2: 100})
 */
function postToSupabase(tabla, payload) {
    const url = `${SB_URL}/rest/v1/${tabla}`;
    const options = {
        "method": "post",
        "contentType": "application/json",
        "headers": {
            "apikey": SB_KEY,
            "Authorization": "Bearer " + SB_KEY,
            "Prefer": "return=representation"
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
    };

    try {
        const response = UrlFetchApp.fetch(url, options);
        return JSON.parse(response.getContentText());
    } catch (e) {
        Logger.log("Error en POST Supabase: " + e.message);
        return null;
    }
}

/**
 * Función Maestra para Consultar (GET)
 * Uso: getFromSupabase('nombre_tabla', 'select=*&id=eq.1')
 */
function getFromSupabase(tabla, queryParams = "") {
    const url = `${SB_URL}/rest/v1/${tabla}?${queryParams}`;
    const options = {
        "method": "get",
        "headers": {
            "apikey": SB_KEY,
            "Authorization": "Bearer " + SB_KEY
        },
        "muteHttpExceptions": true
    };

    try {
        const response = UrlFetchApp.fetch(url, options);
        return JSON.parse(response.getContentText());
    } catch (e) {
        Logger.log("Error en GET Supabase: " + e.message);
        return [];
    }
}

/**
 * Función Maestra para Actualizar (PATCH)
 * Uso: patchSupabase('nombre_tabla', 'id=eq.123', {columna: 'nuevo_valor'})
 */
function patchSupabase(tabla, queryParams, payload) {
    const url = `${SB_URL}/rest/v1/${tabla}?${queryParams}`;
    const options = {
        "method": "patch",
        "contentType": "application/json",
        "headers": {
            "apikey": SB_KEY,
            "Authorization": "Bearer " + SB_KEY,
            "Prefer": "return=representation"
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
    };

    try {
        const response = UrlFetchApp.fetch(url, options);
        return JSON.parse(response.getContentText());
    } catch (e) {
        Logger.log("Error en PATCH Supabase: " + e.message);
        return null;
    }
}


function diagnosticoAuditTrail() {
    const payload = {
        fecha: new Date().toISOString(),
        usuario: 'SISTEMA_DEBUG',
        modulo: 'Seguridad',
        accion: 'DEBUG_INSERT',
        detalle: 'Probando escritura forzada'
    };

    const url = `${SB_URL}/rest/v1/audit_trail`;
    const options = {
        method: 'post',
        contentType: "application/json",
        headers: {
            "apikey": SB_KEY,
            "Authorization": "Bearer " + SB_KEY,
            "Prefer": "return=representation"
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true // Clave para ver el error real
    };

    const response = UrlFetchApp.fetch(url, options);

    console.log("CÓDIGO DE ESTADO HTTP:", response.getResponseCode());
    console.log("RESPUESTA DE SUPABASE:", response.getContentText());
}