import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CompletedFormWithRelations, questionTypes } from "@/types";
import { PDFDocument, rgb } from 'pdf-lib';
import ExcelJS from 'exceljs';
import fontkit from '@pdf-lib/fontkit';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const exportToPDF = async (evaluation: CompletedFormWithRelations | undefined) => {
    if (!evaluation) return;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Cargar las fuentes personalizadas desde la carpeta pública
    const regularFontUrl = '/fonts/Roboto-Regular.ttf';
    const boldFontUrl = '/fonts/Roboto-Bold.ttf';

    const regularFontBytes = await fetch(regularFontUrl).then((res) => res.arrayBuffer());
    const boldFontBytes = await fetch(boldFontUrl).then((res) => res.arrayBuffer());

    const customFontRegular = await pdfDoc.embedFont(regularFontBytes);
    const customFontBold = await pdfDoc.embedFont(boldFontBytes);

    let page = pdfDoc.addPage([900.28, 900.89]);
    const { width, height } = page.getSize();

    const marginTop = 35;
    const lineHeight = 18;
    const padding = 10;
    const marginHorizontal = 30;
    let yOffset = height - marginTop;

    const infoBlockHeight = lineHeight * 5;
    page.drawRectangle({
        x: 0,
        y: yOffset - infoBlockHeight,
        width: width,
        height: infoBlockHeight * 1.5,
        color: rgb(0, 0.549, 0.419),
    });

    page.drawText(`Evaluación de: ${evaluation.employee?.nombre} ${evaluation.employee?.apellido}`, {
        x: marginHorizontal + 10,
        y: yOffset,
        size: 14,
        font: customFontBold,
        color: rgb(1, 1, 1),
    });
    yOffset -= lineHeight;

    page.drawText(`Completada el día: ${evaluation.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'No completada'}`, {
        x: marginHorizontal + 10,
        y: yOffset,
        size: 12,
        font: customFontRegular,
        color: rgb(1, 1, 1),
    });
    yOffset -= lineHeight;

    page.drawText(`Formulario: ${evaluation.formTitle}`, {
        x: marginHorizontal + 10,
        y: yOffset,
        size: 12,
        font: customFontRegular,
        color: rgb(1, 1, 1),
    });
    yOffset -= lineHeight;

    page.drawText(`Cantidad de preguntas respondidas: ${evaluation.responses.length}`, {
        x: marginHorizontal + 10,
        y: yOffset,
        size: 12,
        font: customFontRegular,
        color: rgb(1, 1, 1),
    });
    yOffset -= lineHeight * 4;

    let questionCounter = 1;

    for (const response of evaluation.responses) {
        const isDescription = response.questionType === 'description';
        const questionTextLines = response.questionText.split('\n');
        const answerLines = response.answer ? response.answer.split('\n') : [];

        const textHeight =
            lineHeight * (questionTextLines.length + (isDescription ? 0 : answerLines.length + 1));
        const blockHeight = textHeight + padding * 2;

        if (yOffset - blockHeight < marginTop) {
            yOffset = height - marginTop;
            page = pdfDoc.addPage([900.28, 900.89]);
        }

        const backgroundColor = isDescription ? rgb(0.89, 0.89, 0.89) : rgb(0.9, 0.975, 0.975);
        page.drawRectangle({
            x: isDescription ? 0 : marginHorizontal,
            y: yOffset - blockHeight,
            width: isDescription ? width : width - marginHorizontal * 2,
            height: blockHeight * 1.1,
            color: backgroundColor,
        });

        const label = isDescription ? 'Descripción:' : `Pregunta ${questionCounter}:`;
        page.drawText(label, {
            x: marginHorizontal + 10,
            y: yOffset - padding,
            size: 13,
            font: customFontBold,
            color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;

        questionTextLines.forEach((line) => {
            page.drawText(line, {
                x: marginHorizontal + 20,
                y: yOffset - padding,
                size: 11,
                font: customFontRegular,
                color: rgb(0, 0, 0),
            });
            yOffset -= lineHeight;
        });

        if (!isDescription && response.answer) {
            page.drawText(`Respuesta:`, {
                x: marginHorizontal + 10,
                y: yOffset - padding,
                size: 12,
                font: customFontBold,
                color: rgb(0, 0, 0),
            });
            yOffset -= lineHeight;

            answerLines.forEach((line) => {
                page.drawText(line, {
                    x: marginHorizontal + 20,
                    y: yOffset - padding,
                    size: 11,
                    font: customFontRegular,
                    color: rgb(0, 0, 0),
                });
                yOffset -= lineHeight;
            });

            questionCounter++;
        }

        yOffset -= lineHeight * 2;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evaluacion_estilada.pdf';
    link.click();
};

export const exportToExcel = async (evaluation: CompletedFormWithRelations | undefined) => {
    if (!evaluation) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Evaluación');

    const titleStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 },
        fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: '0070C0' } },
        alignment: { horizontal: 'center' as const },
    };

    const descriptionStyle = {
        font: { bold: true, italic: true, size: 12, color: { argb: '000000' } },
        fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'D9D9D9' } },
        alignment: { horizontal: 'center' as const },
    }

    const sectionHeaderStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
        fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: '008C6B' } },
        alignment: { horizontal: 'center' as const },
    };

    const normalTextStyle = {
        font: { size: 11, color: { argb: '000000' } },
        alignment: { horizontal: 'left' as const },
    };

    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'INFORMACIÓN GENERAL';
    titleCell.style = titleStyle;

    worksheet.addRow([
        `Evaluación de: ${evaluation.employee?.nombre} ${evaluation.employee?.apellido}`,
    ]);
    worksheet.addRow([
        `Completada el día: ${evaluation.completedAt
            ? new Date(evaluation.completedAt).toLocaleDateString()
            : 'No completada'
        }`,
    ]);
    worksheet.addRow([`Formulario: ${evaluation.formTitle}`]);
    worksheet.addRow([
        `Cantidad de preguntas respondidas: ${evaluation.responses.filter(
            (response) => response.questionType !== 'description'
        ).length}`,
    ]);
    worksheet.addRow([]);

    let questionCounter = 1;

    evaluation.responses.forEach((response) => {
        const isDescription = response.questionType === 'description';

        const rowNumber = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;
        worksheet.mergeCells(`A${rowNumber}:D${rowNumber}`);
        const headerCell = worksheet.getCell(`A${rowNumber}`);
        headerCell.value = isDescription ? 'Descripción' : `Pregunta ${questionCounter}:`;
        headerCell.style = isDescription ? descriptionStyle : sectionHeaderStyle;

        if (isDescription) {

            const contentRow = worksheet.addRow([response.questionText]);
            contentRow.eachCell((cell) => (cell.style = normalTextStyle));
        } else {

            worksheet.addRow([`Tipo: ${questionTypes[response.questionType]}`]).eachCell(
                (cell) => (cell.style = normalTextStyle)
            );
            worksheet.addRow([`Pregunta: ${response.questionText}`]).eachCell(
                (cell) => (cell.style = normalTextStyle)
            );
            worksheet.addRow([
                `Respuesta: ${response.answer || 'Sin respuesta'}`,
            ]).eachCell((cell) => (cell.style = normalTextStyle));

            questionCounter++;
        }

        worksheet.addRow([]);
    });

    worksheet.columns.forEach((column) => {
        column.width = 40;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evaluacion_estilada.xlsx';
    link.click();
};

