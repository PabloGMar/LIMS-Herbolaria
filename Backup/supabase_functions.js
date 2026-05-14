/**
 * SUPABASE FUNCTIONS HANDLER
 * Ported from legacy GAS scripts to run directly in the browser.
 * This file handles all LIMS logic independently of Google Sheets.
 */

const SupabaseFunctions = {
    // ==========================================
    // 🛡️ SEGURIDAD & AUDIT TRAIL
    // ==========================================

    async registrarAuditTrail(usuario, modulo, accion, detalle) {
        try {
            const { error } = await supabase
                .from('audit_trail')
                .insert({
                    fecha: new Date().toISOString(),
                    usuario: usuario,
                    modulo: modulo,
                    accion: accion,
                    detalle: detalle
                });
            if (error) console.error("Error Audit Trail:", error);
        } catch (e) {
            console.error("Fallo crítico Audit Trail:", e);
        }
    },

    async loginInterno(usuarioInput, passwordHashInput) {
        try {
            const { data: user, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('usuario', usuarioInput)
                .maybeSingle();

            if (error) throw error;
            if (!user) return { success: false, message: "Usuario no encontrado." };

            if (user.estatus === 'Bloqueado') {
                return { success: false, message: "Bloqueado por QA." };
            }

            if (user.password_hash === passwordHashInput) {
                await supabase
                    .from('usuarios')
                    .update({ intentos: 0 })
                    .eq('id', user.id);

                await this.registrarAuditTrail(usuarioInput, 'Seguridad', 'Login', 'Ingreso exitoso.');

                return {
                    success: true,
                    nombre: user.nombre,
                    rol: user.rol,
                    usuario: user.usuario,
                    area: user.area
                };
            } else {
                let intentos = (user.intentos || 0) + 1;
                let nuevoEstatus = user.estatus;

                if (intentos >= 3) {
                    nuevoEstatus = 'Bloqueado';
                    await this.registrarAuditTrail('SISTEMA', 'Seguridad', 'Bloqueo Automático', `Usuario ${usuarioInput} bloqueado por seguridad.`);
                }

                await supabase
                    .from('usuarios')
                    .update({ intentos: intentos, estatus: nuevoEstatus })
                    .eq('id', user.id);

                await this.registrarAuditTrail(usuarioInput, 'Seguridad', 'Fallo de Login', `Intento ${intentos} de 3.`);

                return { success: false, message: `Error. Intento ${intentos} de 3.` };
            }
        } catch (e) {
            console.error("Login error:", e);
            return { success: false, message: "Error de conexión con la base de datos." };
        }
    },

    async registrarCierreSesion(usuario, motivo) {
        await this.registrarAuditTrail(usuario, 'Seguridad', 'Logout', motivo);
        return { success: true };
    },

    // ==========================================
    // 📋 MUESTRAS & RESULTADOS
    // ==========================================

    async obtenerMuestrasDashboard() {
        try {
            const { data, error } = await supabase
                .from('muestras')
                .select('*')
                .order('fecha_ingreso', { ascending: false });

            if (error) throw error;

            return data.map(m => ({
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
        } catch (e) {
            console.error("Error dashboard samples:", e);
            return [];
        }
    },

    async ingresarMuestra(datos, usuarioActual) {
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

            const { error } = await supabase.from('muestras').insert(payload);
            if (error) throw error;

            await this.registrarAuditTrail(usuarioActual, 'Muestras', 'Ingreso de Muestra', `Lote: ${datos.loteInterno} | Prod: ${datos.producto}`);
            return { success: true, mensaje: "Muestra registrada." };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async obtenerPlanDeAnalisisPT(producto, loteInterno) {
        try {
            const { data: plan, error: e1 } = await supabase
                .from('productos_pt')
                .select('*')
                .eq('producto', producto)
                .order('id', { ascending: true });

            if (e1) throw e1;

            const { data: resultados, error: e2 } = await supabase
                .from('resultados_analisis')
                .select('*')
                .eq('lote_interno', loteInterno);

            if (e2) throw e2;

            const resultadosPrevios = {};
            if (resultados) {
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
    },

    async guardarResultadosYDictamen(loteI, resultadosArray, dictamenFinal, usuarioActual) {
        try {
            for (const item of resultadosArray) {
                const payload = {
                    lote_interno: loteI,
                    prueba: item.prueba,
                    especificacion: item.espec,
                    resultado: item.resultado,
                    evaluacion: item.evaluacion,
                    fecha_registro: new Date().toISOString(),
                    usuario: usuarioActual
                };

                const { data: existente } = await supabase
                    .from('resultados_analisis')
                    .select('id')
                    .eq('lote_interno', loteI)
                    .eq('prueba', item.prueba)
                    .maybeSingle();

                if (existente) {
                    await supabase.from('resultados_analisis').update(payload).eq('id', existente.id);
                } else {
                    await supabase.from('resultados_analisis').insert(payload);
                }
            }

            await supabase.from('muestras').update({ estatus: dictamenFinal }).eq('lote_interno', loteI);
            await this.registrarAuditTrail(usuarioActual, 'Resultados', 'Captura de Resultados', `Lote: ${loteI} | Dictamen: ${dictamenFinal}`);

            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    // ==========================================
    // 📦 INVENTARIOS & EQUIPOS
    // ==========================================

    async obtenerInventariosCompletos() {
        try {
            const { data: stockRaw } = await supabase.from('inv_recepcion').select('*').order('id_insumo');
            const { data: prepRaw } = await supabase.from('inv_preparacion').select('*').order('fecha_preparacion', { ascending: false });
            const { data: cepasRaw } = await supabase.from('inv_cepas').select('*').order('id_tubo');

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
    },

    async obtenerEquiposBD() {
        try {
            const { data, error } = await supabase.from('equipos_calibracion').select('*').order('codigo');
            if (error) throw error;
            return data.map(e => ({
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
    },

    async registrarMantenimiento(datos, usuarioActual) {
        try {
            const payloadLog = {
                equipo_codigo: datos.equipoCodigo,
                fecha: new Date().toISOString(),
                usuario: usuarioActual.usuario,
                actividad: datos.actividad,
                observaciones: datos.observaciones || "",
                tipo: datos.tipo || "Mantenimiento"
            };
            await supabase.from('log_mantenimiento').insert(payloadLog);

            const payloadEquipo = { ultima_intervencion: new Date().toISOString() };
            if (datos.nuevaFechaCal) payloadEquipo.proxima_cal = datos.nuevaFechaCal;

            await supabase.from('equipos_calibracion').update(payloadEquipo).eq('codigo', datos.equipoCodigo);
            await this.registrarAuditTrail(usuarioActual.usuario, 'Equipos', 'Mantenimiento', `Equipo: ${datos.equipoCodigo}`);

            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async obtenerDatosCertificadoCompleto(loteI) {
        try {
            const { data: m } = await supabase.from('muestras').select('*').eq('lote_interno', loteI).maybeSingle();
            if (!m) throw new Error("Muestra no encontrada.");
            
            const { data: resRaw } = await supabase.from('resultados_analisis').select('*').eq('lote_interno', loteI);
            const { data: usuarios } = await supabase.from('usuarios').select('*').eq('estatus', 'Activo');

            let nombreJefe = "No asignado";
            let nombreRS = "No asignado";
            const traductorNombres = {};

            if (usuarios) {
                usuarios.forEach(u => {
                    traductorNombres[u.usuario] = u.nombre;
                    if (u.rol === 'Jefe de Control de Calidad') nombreJefe = u.nombre;
                    if (u.rol === 'Responsable Sanitario') nombreRS = u.nombre;
                });
            }

            return {
                success: true,
                muestra: {
                    loteInterno: m.lote_interno,
                    producto: m.producto,
                    fechaIngreso: m.fecha_ingreso,
                    numAnalisis: m.num_analisis,
                    estatus: m.estatus,
                    analistaFQ: "Verificado", 
                    analistaMB: "Verificado"
                },
                resultados: resRaw || [],
                fechaAnalisis: new Date().toISOString(),
                jefe: nombreJefe,
                rs: nombreRS
            };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async obtenerUsuariosBD() {
        const { data } = await supabase.from('usuarios').select('*').order('id');
        return data || [];
    },

    async obtenerAuditTrailBD() {
        const { data } = await supabase.from('audit_trail').select('*').order('fecha', { ascending: false }).limit(500);
        return data || [];
    }
};

/**
 * PROXY PARA GOOGLE.SCRIPT.RUN
 */
window.google = {
    script: {
        run: {
            withSuccessHandler: function(callback) {
                this.successHandler = callback;
                return this;
            },
            withFailureHandler: function(callback) {
                this.failureHandler = callback;
                return this;
            }
        }
    }
};

const scriptRunProxy = new Proxy(window.google.script.run, {
    get: function(target, prop) {
        if (prop === 'withSuccessHandler' || prop === 'withFailureHandler') {
            return target[prop].bind(target);
        }

        return async function(...args) {
            try {
                if (SupabaseFunctions[prop]) {
                    const result = await SupabaseFunctions[prop](...args);
                    if (target.successHandler) target.successHandler(result);
                } else {
                    console.warn(`Función ${prop} no implementada en SupabaseFunctions.`);
                }
            } catch (error) {
                if (target.failureHandler) target.failureHandler(error);
                else console.error(`Error en ${prop}:`, error);
            }
        };
    }
});

window.google.script.run = scriptRunProxy;
