import { db } from "@/data/prisma";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const forms = await db.completedForm.findFirst({
    where: { id },
    include: {
      form: true,
      employee: true,
      responses: true
    }
  })

  return NextResponse.json(forms);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { status, newResponses } = body;

  if (!newResponses || !Array.isArray(newResponses)) {
    return NextResponse.json(
      { message: 'Las respuestas no son válidas.' },
      { status: 400 }
    );
  }

  try {
    await db.$transaction(async (prisma) => {
      // Obtener respuestas existentes
      const existingResponses = await prisma.response.findMany({
        where: { completedFormId: id },
      });

      const existingResponsesMap = existingResponses.reduce((map, response) => {
        map[response.questionText] = response;
        return map;
      }, {});

      // Procesar respuestas nuevas
      for (const response of newResponses) {
        const { questionId, questionText, questionType, answer } = response;

        if (!questionText || !questionType) {
          throw new Error(`Datos incompletos para la respuesta.`);
        }

        let optionsJson = null;

        if (questionId) {
          const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { options: true },
          });

          optionsJson = question
            ? JSON.stringify(question.options.map((option) => ({
              id: option.id,
              label: option.label,
            })))
            : null;
        }

        const existingResponse = existingResponsesMap[questionText];

        if (existingResponse) {
          // Actualizar respuesta existente
          await prisma.response.update({
            where: { id: existingResponse.id },
            data: {
              answer,
              optionsJson: optionsJson ?? existingResponse.optionsJson,
              questionText,
              questionType,
            },
          });
        } else {
          // Crear nueva respuesta
          await prisma.response.create({
            data: {
              id: randomUUID(),
              completedFormId: id,
              questionId: questionId || null,
              questionText,
              questionType,
              optionsJson,
              answer,
            },
          });
        }
      }

      // Actualizar estado del formulario
      await prisma.completedForm.update({
        where: { id },
        data: {
          completedAt: new Date(),
          status,
        },
      });
    });

    return NextResponse.json({ message: 'Formulario actualizado con éxito' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al procesar el formulario', error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {

  const { id } = params;

  const checkEvaluation = await db.completedForm.findFirst({
    where: { id }
  })

  if (!checkEvaluation) {
    throw new Error("No existe la evaluacion")
  }

  await db.completedForm.delete({
    where: { id }
  })

  return NextResponse.json({ message: "Evaluacion eliminada con éxito" })
}