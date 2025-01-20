import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import { CompletedFormWithRelations, questionTypes } from "@/types";
import * as XLSX from 'xlsx';



export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const exportToPDF = (evaluation: CompletedFormWithRelations | undefined) => {

    if (!evaluation) return;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Altura de la página en unidades de `jspdf`
    const marginTop = 10;
    const lineHeight = 10; // Espacio entre líneas
    let yOffset = marginTop;

    // Calcular altura del bloque de información general
    const infoBlockHeight = lineHeight * 4; // Altura total (4 líneas incluyendo separación)

    // Dibujar rectángulo de fondo
    doc.setFillColor(230, 230, 250); // Color de fondo (lavanda)
    doc.rect(10, yOffset, 190, infoBlockHeight * 1.1, "F"); // (x, y, ancho, alto, modo "F" para rellenar)

    // Título de la evaluación
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Evaluación de: ${evaluation.employee?.nombre} ${evaluation.employee?.apellido}`, 15, yOffset + lineHeight);
    yOffset += lineHeight;

    // Información general
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Completada el día: ${evaluation.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'No completada'}`, 15, yOffset + lineHeight);
    yOffset += lineHeight;
    doc.text(`Formulario: ${evaluation.formTitle}`, 15, yOffset + lineHeight);
    yOffset += lineHeight;
    doc.text(`Cantidad de preguntas respondidas: ${evaluation.responses.length}`, 15, yOffset + lineHeight);
    yOffset += lineHeight * 2; // Separación adicional

    // Continuar con las preguntas
    evaluation.responses.forEach((response, index) => {
        const isDescription = response.questionType === "description";
        const questionTextLines = doc.splitTextToSize(response.questionText, 180); // Divide el texto para no pasarse del ancho
        const answerLines = response.answer ? doc.splitTextToSize(response.answer, 180) : [];
        const questionBlockHeight = questionTextLines.length * lineHeight + answerLines.length * lineHeight + lineHeight * 2;

        // Verificar si hay espacio suficiente en la página actual, si no, agregar una nueva página
        if (yOffset + questionBlockHeight > pageHeight - marginTop) {
            doc.addPage();
            yOffset = marginTop;
        }

        // Cambiar color para títulos de sección (TIPO, Pregunta, Respuesta)
        doc.setTextColor(0, 102, 204); // Color azul para estos títulos

        // Si es descripción, no mostrar "Pregunta X" sino "Descripción"
        if (isDescription) {
            doc.setFont("Helvetica", "bold");
            doc.text(`Descripción:`, 10, yOffset);
            yOffset += lineHeight;
        } else {
            doc.setFont("Helvetica", "bold");
            doc.text(`Pregunta ${index + 1}:`, 10, yOffset);
            yOffset += lineHeight;

            // Mostrar el tipo de la pregunta
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(0, 0, 0); // Color azul para "TIPO"
            doc.text(`- Tipo: ${questionTypes[response.questionType]}`, 10, yOffset);
            yOffset += lineHeight;
        }

        // Mostrar la pregunta
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(0, 0, 0); // Color negro para el contenido de la pregunta
        doc.text(`- Consigna:`, 10, yOffset);
        yOffset += lineHeight;

        questionTextLines.forEach((line) => {
            doc.text(line, 15, yOffset); // Sangría para el texto de la pregunta
            yOffset += lineHeight;
        });

        // Si no es una descripción, mostrar la respuesta
        if (!isDescription) {
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(0, 102, 204); // Color azul para "RESPUESTA"
            doc.text(`- Respuesta:`, 10, yOffset);
            yOffset += lineHeight;
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(0, 0, 0); // Color negro para las respuestas
            answerLines.forEach((line) => {
                doc.text(line, 15, yOffset); // Sangría para la respuesta
                yOffset += lineHeight;
            });
        }

        yOffset += lineHeight; // Espaciado entre preguntas
    });

    doc.save("evaluacion_estilada.pdf");
};

export const exportToExcel = (evaluation: CompletedFormWithRelations | undefined) => {
    if (!evaluation) return;

    const wb = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
    const ws_data: Array<Array<{ v: string; s?: object }>> = [];

    // Estilo para los títulos
    const titleStyle = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        }
    };

    // Añadir la información general
    ws_data.push([{ v: `Evaluación de: ${evaluation.employee?.nombre} ${evaluation.employee?.apellido}`, s: titleStyle }]);
    ws_data.push([{ v: `Completada el día: ${evaluation.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'No completada'}`, s: titleStyle }]);
    ws_data.push([{ v: `Formulario: ${evaluation.formTitle}`, s: titleStyle }]);
    ws_data.push([{ v: `Cantidad de preguntas respondidas: ${evaluation.responses.length}`, s: titleStyle }]);

    // Separación entre los datos generales y las preguntas
    ws_data.push([]);

    // Estilo para las preguntas
    const questionStyle = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "D9E1F2" } },
        alignment: { horizontal: "left", vertical: "top" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } }
        }
    };

    // Estilo para las respuestas
    const answerStyle = {
        font: { sz: 12 },
        alignment: { horizontal: "left", vertical: "top" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } }
        }
    };

    // Añadir las respuestas de las preguntas
    evaluation.responses.forEach((response, index) => {
        const isDescription = response.questionType === "description";

        // Título de la pregunta
        ws_data.push([{ v: isDescription ? 'Descripción' : `Pregunta ${index + 1}:`, s: questionStyle }]);

        // Añadir el tipo de la pregunta si no es descripción
        if (!isDescription) {
            ws_data.push([{ v: `TIPO: ${questionTypes[response.questionType]}`, s: answerStyle }]);
        }

        // Añadir la pregunta
        ws_data.push([{ v: `Pregunta: ${response.questionText}`, s: questionStyle }]);

        // Si no es una descripción, añadir la respuesta
        if (!isDescription && response.answer) {
            ws_data.push([{ v: `Respuesta: ${response.answer}`, s: answerStyle }]);
        }

        ws_data.push([]); // Separación entre bloques de pregunta
    });

    // Crear el worksheet a partir de los datos
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar los estilos directamente a cada celda
    ws_data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellAddress = { r: rowIndex, c: colIndex };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            if (cell.s) {
                ws[cellRef] = { ...ws[cellRef], s: cell.s };
            }
        });
    });

    // Ajustar el ancho de las columnas
    const columnWidths = [
        { wch: 50 }, // Columna 1
        { wch: 60 }, // Columna 2
        { wch: 60 }, // Columna 3
        { wch: 50 }, // Columna 4
    ];
    ws['!cols'] = columnWidths;

    // Añadir el worksheet al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluación');

    // Guardar el archivo Excel
    XLSX.writeFile(wb, 'evaluacion_estilada.xlsx');
};

