/**
 * ============================================================================
 * ARCHIVO: GeneradorPDF.js
 * RESPONSABILIDAD: Generación de Certificados de Análisis (CoA) y Reportes PDF.
 * ============================================================================
 */

/**
 * 1. ENSAMBLADO DE DATOS PARA CERTIFICADO
 * Recupera toda la información necesaria de Supabase para un lote.
 */
function obtenerDatosCertificadoCompleto(loteI) {
    try {
        // 1. Obtener datos de la muestra
        const muestras = getFromSupabase('muestras', `lote_interno=eq.${loteI}`);
        if (!muestras || muestras.length === 0) throw new Error("Muestra no encontrada.");
        const m = muestras[0];

        // 2. Obtener especificaciones del producto
        const plan = getFromSupabase('productos_pt', `producto=eq.${m.producto}&order=id.asc`);

        // 3. Obtener resultados analíticos
        const resRaw = getFromSupabase('resultados_analisis', `lote_interno=eq.${loteI}`);

        // 4. Obtener nombres de responsables (QA y RS)
        const usuarios = getFromSupabase('usuarios', 'estatus=eq.Activo');
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

        // Procesar resultados y firmas
        let res = [];
        let firmasFQ = new Set();
        let firmasMB = new Set();
        let fMax = new Date(m.fecha_ingreso);
        const palabrasMicro = ['MESOFILO', 'HONGO', 'LEVADURA', 'COLI', 'SALMONELLA', 'AUREUS', 'PSEUDOMONA', 'MICROBIO', 'CUENTA', 'ENTEROBAC', 'AEROBIO'];

        if (resRaw) {
            resRaw.forEach(r => {
                res.push({
                    prueba: r.prueba,
                    especificacion: r.especificacion,
                    resultado: r.resultado,
                    evaluacion: r.evaluacion
                });

                let analistaNombre = traductorNombres[r.usuario] || r.usuario;
                let esPruebaMB = palabrasMicro.some(p => r.prueba.toUpperCase().includes(p));
                if (esPruebaMB) firmasMB.add(analistaNombre); else firmasFQ.add(analistaNombre);

                if (r.fecha_registro) {
                    let f = new Date(r.fecha_registro);
                    if (!isNaN(f) && f > fMax) fMax = f;
                }
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
                analistaFQ: Array.from(firmasFQ).join(' / '),
                analistaMB: Array.from(firmasMB).join(' / ')
            },
            resultados: res,
            fechaAnalisis: fMax.toISOString(),
            jefe: nombreJefe,
            rs: nombreRS
        };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 2. GENERACIÓN DE PDF (Drive + HtmlService)
 */
function generarPDFMasivoEnServidor(lotesArray, usuarioSolicitante) {
    try {
        const rolesFirma = ['Jefe de Control de Calidad', 'Supervisor', 'Responsable Sanitario', 'Gerente', 'Administrador'];
        if (!verificarPermisoBackend(usuarioSolicitante, rolesFirma)) {
            registrarAuditTrail(usuarioSolicitante, 'Seguridad', 'Violación de Acceso', `Intento denegado de emisión de CoAs.`);
            throw new Error("Bloqueo CFR 21: No tiene permisos de nivel jerárquico para emitir documentos oficiales.");
        }

        if (!Array.isArray(lotesArray)) lotesArray = [lotesArray];

        const pdfBlobs = [];
        const hoy = new Date();
        const fLiberacion = formatearFechaEspanol(hoy.toISOString());

        lotesArray.forEach(loteI => {
            const certData = obtenerDatosCertificadoCompleto(loteI);
            if (!certData.success) return;

            const m = certData.muestra;
            const logoUrl = obtenerLogoBase64();

            let filasResultados = '';
            certData.resultados.forEach(r => {
                let claseOOS = r.evaluacion === 'OOS' ? 'color: red; font-weight: bold;' : '';
                filasResultados += `
                    <tr>
                        <td style="border: 1px solid black; padding: 5px; text-align: left;">${r.prueba}</td>
                        <td style="border: 1px solid black; padding: 5px; text-align: center;">${r.especificacion}</td>
                        <td style="border: 1px solid black; padding: 5px; text-align: center; ${claseOOS}">${r.resultado}</td>
                    </tr>`;
            });

            const html = `
                <html>
                <body style="font-family: Arial, sans-serif; font-size: 11px; padding: 20px;">
                    <div style="text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">
                        <img src="${logoUrl}" height="60"><br>
                        <h1 style="font-size: 16px; margin: 5px 0;">SORIA NATURAL, S. A. DE C. V.</h1>
                        <h2 style="font-size: 12px; margin: 0;">CERTIFICADO DE ANÁLISIS DE PRODUCTO TERMINADO</h2>
                    </div>
                    <table style="width: 100%; margin: 15px 0;">
                        <tr><td><b>Producto:</b> ${m.producto}</td><td><b>Lote:</b> ${m.loteInterno}</td></tr>
                        <tr><td><b>Muestreo:</b> ${formatearFechaEspanol(m.fechaIngreso)}</td><td><b>Análisis:</b> ${formatearFechaEspanol(certData.fechaAnalisis)}</td></tr>
                    </table>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead style="background: #f3f4f6;">
                            <tr><th style="border: 1px solid black;">Análisis</th><th style="border: 1px solid black;">Especificación</th><th style="border: 1px solid black;">Resultado</th></tr>
                        </thead>
                        <tbody>${filasResultados}</tbody>
                    </table>
                    <p><b>Dictamen:</b> ${m.estatus === 'Liberado' ? 'APROBADO' : 'RECHAZADO'}</p>
                    <table style="width: 100%; margin-top: 40px; text-align: center;">
                        <tr>
                            <td>____________________<br>FQ: ${m.analistaFQ}</td>
                            <td>____________________<br>MB: ${m.analistaMB}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 30px;">____________________<br>Control de Calidad: ${certData.jefe}</td>
                            <td style="padding-top: 30px;">____________________<br>Responsable Sanitario: ${certData.rs}</td>
                        </tr>
                    </table>
                </body>
                </html>`;

            pdfBlobs.push(HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(`CoA_${m.loteInterno}.pdf`));
        });

        const folder = obtenerOCrearCarpetaPDF("LIMS_Certificados_Emitidos");
        let finalUrl = folder.getUrl();
        pdfBlobs.forEach(b => {
            const f = folder.createFile(b);
            f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            if (pdfBlobs.length === 1) finalUrl = f.getUrl();
        });

        registrarAuditTrail(usuarioSolicitante, 'Reportes', 'Generación PDF', `Emisión de ${pdfBlobs.length} CoA(s).`);
        return { success: true, url: finalUrl };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

function obtenerOCrearCarpetaPDF(nombre) {
    const it = DriveApp.getFoldersByName(nombre);
    return it.hasNext() ? it.next() : DriveApp.createFolder(nombre);
}
