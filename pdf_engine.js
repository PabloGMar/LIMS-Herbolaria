/**
 * ============================================================================
 * LIMS HERBOLARIA - PDF ENGINE (jspdf)
 * Generación de CoA local en cumplimiento con NOM-059
 * ============================================================================
 */

const PDFEngine = {
    async generarCoA(datos) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const m = datos.muestra;
        
        // Configuración de Colores
        const colorPrimario = [6, 78, 59]; // Verde Soria
        
        // 1. CABECERA
        doc.setFillColor(...colorPrimario);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("SORIA NATURAL, S.A. DE C.V.", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(m.tipoAnalisis === 'Estabilidad' ? "CERTIFICADO DE ANÁLISIS DE ESTABILIDAD" : "CERTIFICADO DE ANÁLISIS DE PRODUCTO TERMINADO", 105, 30, { align: "center" });

        // 2. INFORMACIÓN DEL LOTE
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        let y = 50;
        
        const infoLote = [
            ["Producto:", m.producto, "Lote Interno:", m.loteInterno],
            ["No. Análisis:", m.numAnalisis || "N/A", "Presentación:", m.presentacion || "N/A"],
            ["F. Muestreo:", new Date(m.fechaIngreso).toLocaleDateString(), "F. Análisis:", new Date().toLocaleDateString()],
            ["Estatus:", m.estatus, "Fecha Caducidad:", "N/A"]
        ];

        doc.autoTable({
            startY: y,
            head: [],
            body: infoLote,
            theme: 'plain',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', width: 35 }, 2: { fontStyle: 'bold', width: 35 } }
        });

        y = doc.lastAutoTable.finalY + 10;

        // 3. TABLA DE RESULTADOS
        doc.autoTable({
            startY: y,
            head: [['Análisis', 'Especificación', 'Resultado', 'Dictamen']],
            body: datos.resultados.map(r => [r.prueba, r.especificacion, r.resultado, r.evaluacion]),
            headStyles: { fillColor: colorPrimario, textColor: [255, 255, 255] },
            styles: { fontSize: 8, halign: 'center' },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold' }, 1: { halign: 'left' } }
        });

        y = doc.lastAutoTable.finalY + 20;

        // 4. DICTAMEN FINAL
        doc.setFont("helvetica", "bold");
        doc.text(`Dictamen: ${m.estatus === 'Liberado' ? 'APROBADO' : 'FUERA DE ESPECIFICACIÓN'}`, 20, y);
        
        // 5. FIRMAS (Estilo CFR 21)
        y += 30;
        const lineW = 60;
        doc.line(20, y, 20 + lineW, y); // Firma 1
        doc.line(130, y, 130 + lineW, y); // Firma 2
        
        doc.setFontSize(8);
        doc.text("Jefe de Control de Calidad", 50, y + 5, { align: "center" });
        doc.text("Responsable Sanitario", 160, y + 5, { align: "center" });
        
        doc.setFont("helvetica", "italic");
        doc.text("Firmado Electrónicamente", 50, y + 10, { align: "center" });
        doc.text("Firmado Electrónicamente", 160, y + 10, { align: "center" });

        // Guardar/Descargar
        doc.save(`CoA_${m.producto}_${m.loteInterno}.pdf`);
    }
};
