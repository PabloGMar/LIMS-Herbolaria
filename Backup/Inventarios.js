/**
 * ============================================================================
 * ARCHIVO: Inventarios.js
 * RESPONSABILIDAD: Gestión de Reactivos, Preparaciones y Cepario vía Supabase.
 * ============================================================================
 */

/**
 * 1. GESTIÓN DE RECEPCIÓN
 */
function registrarNuevoInsumo(datos, usuarioActual) {
    try {
        let prefijo = "R";
        if (datos.categoria === "Solventes") prefijo = "S";
        else if (datos.categoria === "Estándares") prefijo = "SRP";

        const hoy = new Date();
        const fechaCod = Utilities.formatDate(hoy, Session.getScriptTimeZone(), "ddMMyy");
        const baseID = `${prefijo}-${fechaCod}`;

        // Obtener contador del día desde Supabase
        const existentes = getFromSupabase('inv_recepcion', `id_insumo=ilike.${baseID}*`);
        const contadorDia = existentes ? existentes.length : 0;
        const idFinal = `${baseID}/${contadorDia + 1}`;

        const payload = {
            id_insumo: idFinal,
            categoria: datos.categoria,
            nombre: datos.nombre,
            proveedor: datos.proveedor,
            lote_prov: datos.loteProv,
            presentacion: datos.presentacion,
            fecha_recepcion: hoy.toISOString(),
            abierto: "No abierto",
            caducidad: datos.caducidad,
            factor: datos.factor,
            pm: datos.pm,
            pureza: datos.pureza,
            densidad: datos.densidad,
            estatus: 'Cuarentena'
        };

        postToSupabase('inv_recepcion', payload);
        registrarAuditTrail(usuarioActual, 'Inventario', 'Alta de Insumo', `ID: ${idFinal} | Lote: ${datos.loteProv}`);

        return { success: true, mensaje: `Insumo registrado en Supabase. ID: ${idFinal}` };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 2. GESTIÓN DE PREPARACIONES
 */
function guardarNuevaPreparacion(datos, usuarioActual) {
    try {
        const abreviatura = datos.idInsumoBase || "MED";
        const hoy = new Date();
        const fechaCod = Utilities.formatDate(hoy, Session.getScriptTimeZone(), "ddMMyy");
        const baseLote = `${abreviatura}-${fechaCod}`;

        const existentes = getFromSupabase('inv_preparacion', `lote=ilike.${baseLote}*`);
        const contador = existentes ? existentes.length : 0;
        const loteFinal = contador === 0 ? baseLote : `${baseLote}-${contador + 1}`;

        let recetaTexto = `${datos.nombreReactivo} [Lote Prov: ${datos.loteProv}] -> Teórico: ${datos.volumenTeorico} ${datos.unidad} | Real: ${datos.cantidadReal} ${datos.unidad}`;
        if (datos.tipo === 'Medio Simple') recetaTexto += ` | pH Final: ${datos.phFinal}`;

        const payload = {
            lote: loteFinal,
            tipo: datos.tipo,
            volumen_final: datos.volumenFinal,
            receta: recetaTexto,
            concentracion_real: datos.concentracionReal || "N/A",
            fecha_preparacion: hoy.toISOString(),
            usuario: usuarioActual,
            caducidad: datos.caducidadInterna,
            ph_inicial: datos.phInicial || null,
            ph_final: datos.phFinal || null,
            estatus: datos.estatusInicial
        };

        postToSupabase('inv_preparacion', payload);
        registrarAuditTrail(usuarioActual, 'Inventario', 'Nueva Preparación', `Lote: ${loteFinal}`);

        return { success: true, loteInterno: loteFinal, mensaje: `Lote ${loteFinal} generado en Supabase.` };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 3. GESTIÓN DE CEPAS
 */
function registrarNuevaCepa(datos, usuarioActual) {
    try {
        let cantidad = parseInt(datos.cantidad) || 1;
        let paseProv = parseInt(datos.paseProv) || 1;

        for (let i = 1; i <= cantidad; i++) {
            let sufijo = cantidad > 1 ? ` (Stick ${i}/${cantidad})` : '';
            const payload = {
                microorganismo: datos.microorganismo,
                atcc: datos.atcc,
                lote_prov: datos.loteProv + sufijo,
                pase: paseProv,
                estatus: 'Sin Rehidratar',
                caducidad_prov: datos.caducidadProv
            };
            postToSupabase('inv_cepas', payload);
        }

        registrarAuditTrail(usuarioActual, 'Cepario', 'Alta Liofilizados', `${datos.microorganismo} | Cant: ${cantidad}`);
        return { success: true, mensaje: `${cantidad} piezas ingresadas en Supabase.` };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 4. CONTROL DE ESTATUS CON FIRMA ELECTRÓNICA
 */
function actualizarEstatusInventarioMasivoConFirma(tipoInv, lotesArray, nuevoEstatus, firma) {
    try {
        const auth = loginInterno(firma.usuario, computeSHA256(firma.password));
        if (!auth.success) return { success: false, error: "Firma Electrónica Inválida." };

        const tabla = tipoInv === 'STOCK' ? 'inv_recepcion' : (tipoInv === 'PREP' ? 'inv_preparacion' : 'inv_cepas');
        const idCol = tipoInv === 'STOCK' ? 'id_insumo' : (tipoInv === 'PREP' ? 'lote' : 'id_tubo');

        lotesArray.forEach(id => {
            patchSupabase(tabla, `${idCol}=eq.${id}`, { estatus: nuevoEstatus });
        });

        registrarAuditTrail(firma.usuario, 'Inventarios', 'Cambio Masivo Estatus', `Tipo: ${tipoInv} | Estatus: ${nuevoEstatus} | Cant: ${lotesArray.length}`);
        return { success: true, mensaje: "Estatus actualizado correctamente en Supabase." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function obtenerInventarioRecepcion() {
    try {
        const res = getFromSupabase('inv_recepcion', 'estatus=neq.Agotado&order=id_insumo.asc');
        return res || [];
    } catch (e) {
        return { error: e.message };
    }
}

function obtenerLotesReactivosDisponibles() {
    try {
        const hoy = new Date().toISOString();
        const res = getFromSupabase('inv_preparacion', `estatus=eq.Liberado&caducidad=gte.${hoy}`);
        return res ? res.map(f => f.lote) : [];
    } catch (e) {
        return [];
    }
}

function obtenerInventariosCompletos() {
    try {
        const stockRaw = getFromSupabase('inv_recepcion', 'order=id_insumo.asc');
        const prepRaw = getFromSupabase('inv_preparacion', 'order=lote.asc');
        const cepasRaw = getFromSupabase('inv_cepas', 'order=id_tubo.asc');

        const stock = stockRaw ? stockRaw.map(i => ({
            idInsumo: i.id_insumo,
            categoria: i.categoria,
            nombre: i.nombre,
            loteProv: i.lote_prov,
            caducidad: i.caducidad,
            estatus: i.estatus
        })) : [];

        const preparaciones = prepRaw ? prepRaw.map(p => ({
            lote: p.lote,
            tipo: p.tipo,
            receta: p.receta,
            fechaPrep: p.fecha_preparacion,
            caducidad: p.caducidad,
            estatus: p.estatus
        })) : [];

        const cepas = cepasRaw ? cepasRaw.map(c => ({
            idTubo: c.id_tubo,
            cepa: c.microorganismo,
            pase: c.pase,
            loteMadre: c.cepa_base,
            fechaSiembra: c.fecha_siembra,
            estatus: c.estatus
        })) : [];

        return {
            success: true,
            inventarios: { stock, preparaciones, cepas }
        };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function procesarMovimientoCepa(atcc, idTubo, microorganismo, accion, datos, usuarioLogin, passwordIntento) {
    try {
        const creds = loginInterno(usuarioLogin, computeSHA256(passwordIntento));
        if (!creds.success) return { success: false, error: "Firma Electrónica Inválida." };

        if (accion === 'REHIDRATAR') {
            const idCLS = datos.abreviatura.trim().toUpperCase() + "-CLS";
            const payload = {
                id_tubo: idCLS,
                microorganismo: microorganismo,
                atcc: atcc,
                lote_prov: datos.loteProv,
                fecha_siembra: new Date().toISOString(),
                pase: datos.paseInicial,
                caducidad: datos.caducidad,
                usuario: creds.nombre,
                estatus: 'Activa',
                cepa_base: datos.abreviatura.trim().toUpperCase()
            };
            patchSupabase('inv_cepas', `atcc=eq.${atcc}&lote_prov=eq.${datos.loteProv}`, payload);
        }
        else if (accion === 'NUEVA_RAMA' || accion === 'SUBCULTIVO') {
            const userCepa = getFromSupabase('inv_cepas', `id_tubo=eq.${idTubo}`);
            if (!userCepa || userCepa.length === 0) throw new Error("Cepa base no encontrada.");
            const cBase = userCepa[0];

            const nuevoPase = (parseInt(cBase.pase) || 0) + 1;
            const letra = accion === 'NUEVA_RAMA' ? String(datos.letraRama).trim().toUpperCase() : idTubo.replace(cBase.cepa_base + '-', '').charAt(0);

            // Crear rama R
            const payloadR = {
                id_tubo: `${cBase.cepa_base}-${letra}${nuevoPase}R`,
                microorganismo: microorganismo,
                atcc: atcc,
                lote_prov: cBase.lote_prov,
                fecha_siembra: new Date().toISOString(),
                pase: nuevoPase,
                caducidad: datos.caducidad,
                usuario: creds.nombre,
                estatus: 'Activa',
                cepa_base: cBase.cepa_base
            };
            postToSupabase('inv_cepas', payloadR);

            // Crear lotes L
            for (let i = 1; i <= parseInt(datos.cantL); i++) {
                const payloadL = { ...payloadR, id_tubo: `${cBase.cepa_base}-${letra}${nuevoPase}L${i}` };
                postToSupabase('inv_cepas', payloadL);
            }

            if (accion === 'SUBCULTIVO') {
                patchSupabase('inv_cepas', `id_tubo=eq.${idTubo}`, { estatus: 'Inactiva' });
            }
        }
        else if (accion === 'INACTIVAR') {
            patchSupabase('inv_cepas', `id_tubo=eq.${idTubo}`, { estatus: 'Inactiva' });
        }

        registrarAuditTrail(usuarioLogin, "Cepario", accion, `Cepa: ${microorganismo} | Tubo: ${idTubo}`);
        return { success: true, mensaje: "Movimiento registrado con éxito en Supabase." };
    } catch (e) {
        return { success: false, error: e.message };
    }
}