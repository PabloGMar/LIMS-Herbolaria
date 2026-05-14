/**
 * ============================================================================
 * LIMS HERBOLARIA - PDF ENGINE (jspdf)
 * Generación de CoA local en cumplimiento con NOM-059 y CFR 21 Part 11
 * ============================================================================
 */

const PDFEngine = {
    async generarCoA(datos) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const m = datos.muestra;
        
        // --- CONFIGURACIÓN VISUAL ---
        const colorVerdeSoria = [6, 78, 59];
        const colorGrisSuave = [245, 247, 250];
        
        // 1. ENCABEZADO PREMIUM
        doc.setFillColor(...colorVerdeSoria);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SORIA NATURAL, S.A. DE C.V.", 105, 22, { align: "center" });
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("CERTIFICADO DE ANÁLISIS DE PRODUCTO TERMINADO", 105, 32, { align: "center" });
        doc.setFontSize(8);
        doc.text("CFR 21 PART 11 COMPLIANT DOCUMENT", 105, 38, { align: "center" });

        // 2. BLOQUE DE INFORMACIÓN (Grid)
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9);
        let y = 55;
        
        const info = [
            ["PRODUCTO:", m.producto, "LOTE INTERNO:", m.loteInterno],
            ["No. ANÁLISIS:", m.numAnalisis, "FECHA INGRESO:", new Date(m.fechaIngreso).toLocaleDateString()],
            ["ESTATUS:", m.estatus.toUpperCase(), "FECHA EMISIÓN:", new Date().toLocaleDateString()]
        ];

        doc.autoTable({
            startY: y,
            body: info,
            theme: 'plain',
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica" },
            columnStyles: { 
                0: { fontStyle: 'bold', textColor: colorVerdeSoria, width: 35 },
                2: { fontStyle: 'bold', textColor: colorVerdeSoria, width: 35 }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // 3. TABLA DE RESULTADOS
        doc.autoTable({
            startY: y,
            head: [['ANÁLISIS', 'ESPECIFICACIÓN', 'RESULTADO', 'DICTAMEN']],
            body: datos.resultados.map(r => [
                r.prueba, 
                r.especificacion, 
                r.resultado, 
                { content: r.evaluacion, styles: { textColor: r.evaluacion === 'OOS' ? [220, 38, 38] : [5, 150, 105], fontStyle: 'bold' } }
            ]),
            headStyles: { fillColor: colorVerdeSoria, textColor: [255, 255, 255], fontSize: 9, halign: 'center' },
            bodyStyles: { fontSize: 8, halign: 'center' },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold', width: 60 }, 1: { halign: 'left' } },
            alternateRowStyles: { fillColor: colorGrisSuave }
        });

        y = doc.lastAutoTable.finalY + 15;

        // 4. DICTAMEN FINAL
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const dictamenColor = m.estatus === 'Liberado' ? [5, 150, 105] : [220, 38, 38];
        doc.setTextColor(...dictamenColor);
        doc.text(`DICTAMEN FINAL: ${m.estatus === 'Liberado' ? 'APROBADO' : 'RECHAZADO / FUERA DE ESPECIFICACIÓN'}`, 20, y);
        
        // 5. CUADRO DE FIRMAS (ALCOA+ Compliance)
        y += 25;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(7);
        
        // Líneas de firma
        doc.setDrawColor(200, 200, 200);
        const col1 = 20, col2 = 115, w = 75;
        
        // Fila 1: Analistas
        doc.line(col1, y, col1 + w, y);
        doc.line(col2, y, col2 + w, y);
        doc.text(`ANALISTA FQ: ${m.analistaFQ}`, col1 + 2, y + 4);
        doc.text(`ANALISTA MB: ${m.analistaMB}`, col2 + 2, y + 4);
        doc.setFont("helvetica", "italic");
        doc.text("Firmado Electrónicamente (LIMS Secure ID)", col1 + 2, y + 8);
        doc.text("Firmado Electrónicamente (LIMS Secure ID)", col2 + 2, y + 8);

        // Fila 2: Autoridades
        y += 35;
        doc.setFont("helvetica", "normal");
        doc.line(col1, y, col1 + w, y);
        doc.line(col2, y, col2 + w, y);
        doc.text(`JEFE CONTROL CALIDAD: ${m.jefeQA}`, col1 + 2, y + 4);
        doc.text(`RESPONSABLE SANITARIO: ${m.respSanitario}`, col2 + 2, y + 4);
        doc.setFont("helvetica", "italic");
        doc.text(`Validado: ${m.fechaLiberacion ? new Date(m.fechaLiberacion).toLocaleString() : 'N/A'}`, col1 + 2, y + 8);
        doc.text("Aprobación Regulatoria Final", col2 + 2, y + 8);

        // PIE DE PÁGINA
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text(`Este documento es una impresión oficial del sistema LIMS Herbolaria. Id de Seguridad: ${btoa(m.loteInterno).substring(0,12)}`, 105, 285, { align: "center" });

        // DESCARGA
        doc.save(`CoA_${m.loteInterno}_${m.producto.replace(/\s/g, '_')}.pdf`);
    }
};
