import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import logoHospi from '../assets/logo_hospi.png'
const generarPdf = (props_pdf) => {
   
    var doc = new jsPDF({
        orientation: "portrait",
    })
    let encabezado = [
        [{ content: '', colSpan: 1, rowSpan: 2, styles: { halign: 'center', minCellWidth: 20 } },
        { content: 'SOLICITUD ORDEN DE TRABAJO', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'MT-RE-01', styles: { halign: 'center', fontStyle: 'bold' } }
        ], [{ content: 'MANTENIMIENTO', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: `Fecha:${props_pdf.fecha}`, styles: { halign: 'center', fontStyle: 'bold' } }]
    ]
    let aux = 5
    autoTable(doc, {
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                doc.addImage(logoHospi, 'png', data.cell.x + 2, data.cell.y + 2, 25, 10)
            }
        },
        theme: "grid",
        startY: aux + 10,
        body: encabezado,
        // columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } },
        styles: {
            color: 20
        },

    })
    aux = 40
    doc.setFont(undefined, 'bold').setFontSize(10).text("1.	RESPONSABLE DEL EQUIPO", 15, aux);
    encabezado = [
        [
            { content: 'Nro Orden:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.nro_orden, colSpan: 3, styles: { halign: 'center' } },
        ],
        [
            { content: 'Nombre del Equipo:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold', } },
            { content: props_pdf.nombre, colSpan: 3, styles: { halign: 'center', minCellWidth: 100 } },
        ],
        [
            { content: 'Area Responsable:  ', styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold', } },
            { content: props_pdf.area_responsable, colSpan: 3, styles: { halign: 'center', minCellWidth: 100 } },
        ],
        [
            { content: 'Tipo de equipo:  ', styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.tipo, colSpan: 3, styles: { halign: 'center', minCellWidth: 100 } },
        ],
        [
            { content: 'Marca:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.marca, colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } },
            { content: 'Serie:', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.serie, colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } }
        ],
        [
            { content: 'Modelo:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.modelo, colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } },
            { content: 'Propietario:', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.propietario, colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } }
        ],
        [
            { content: 'Tipo Mantenimiento:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.tipo_mantenimiento, colSpan: 3, styles: { halign: 'center' } },
        ],
        [
            { content: 'Estado del Equipo:  ', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } },
            { content: props_pdf.estado, colSpan: 3, styles: { halign: 'center' } },
        ],
    ]
    autoTable(doc, {
        theme: "grid",
        startY: aux + 10,
        body: encabezado,
        styles: {
            color: 20
        },

    })
    aux = 105
    let cuerpo = [
        [{ content: '2.	PROBLEMA', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } }],
        [{ content: props_pdf.problema, colSpan: 1, styles: { halign: 'left', minCellWidth: 130}},],
        [{ content: '3.	ACTIVIDADES', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } }],
        [{ content: props_pdf.actividades, colSpan: 1, styles: { halign: 'left', minCellWidth: 30} }],
        [{ content: '4.	CONCLUSIONES', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } }],
        [{ content: props_pdf.conclusiones, colSpan: 1, styles: { halign: 'left', minCellWidth: 30 } }],
        [{ content: '5.	CAUSAS', colSpan: 1, styles: { halign: 'left', minCellWidth: 30, fontStyle: 'bold' } }],
        [{ content: props_pdf.causas, colSpan: 1, styles: { halign: 'left', minCellWidth: 30 } }],
        [{ content: `Responsable:   ${props_pdf.responsable}`, colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } }],
        [{ content: 'Recibido por:_____________________', colSpan: 1, styles: { halign: 'center', minCellWidth: 30 } }],
    ]
    autoTable(doc, {
        theme: "plain",
        startY: aux + 10,
        body: cuerpo,
        styles: {
            color: 20
        },
        
    })
    


    
     doc.save(`REPORTE-${props_pdf.nro_orden}.pdf`);
}


export  {generarPdf}