import { db } from "@/data/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {

  const { id } = params;

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

  console.log(status, newResponses);

  if (!newResponses || !Array.isArray(newResponses)) {
    return NextResponse.json(
      { message: 'Las respuestas no son válidas.' },
      { status: 400 }
    );
  }

  try {
    await db.$transaction(async (prisma) => {
      // Obtener todas las respuestas existentes para el formulario
      const existingResponses = await prisma.response.findMany({
        where: { completedFormId: id },
      });

      const existingResponsesMap = existingResponses.reduce((map, response) => {
        map[response.questionId] = response;
        return map;
      }, {});

      // Procesar las respuestas nuevas o actualizadas
      for (const response of newResponses) {
        const { questionId, questionText, questionType, answer } = response;

        if (!questionId || !questionText || !questionType) {
          throw new Error(`Datos incompletos para la pregunta con ID ${questionId}`);
        }

        // Obtener las opciones de la pregunta original
        const question = await prisma.question.findUnique({
          where: { id: questionId },
          include: { options: true },
        });

        if (!question) {
          throw new Error(`La pregunta con ID ${questionId} no existe`);
        }

        const optionsJson = JSON.stringify(question.options.map((option) => ({
          id: option.id,
          label: option.label,
        })));

        const existingResponse = existingResponsesMap[questionId];

        if (existingResponse) {
          // Actualizar la respuesta existente
          await prisma.response.update({
            where: { id: existingResponse.id },
            data: {
              answer,
              optionsJson
            },
          });
        } else {
          // Crear una nueva respuesta
          await prisma.response.create({
            data: {
              id: randomUUID(),
              completedFormId: id,
              questionId,
              questionText,
              questionType,
              optionsJson,
              answer,
            },
          });
        }
      }

      // Actualizar el formulario
      await prisma.completedForm.update({
        where: { id },
        data: {
          completedAt: new Date(),
          status,
        },
      });
    });

    return NextResponse.json({ message: 'Formulario actualizado/finalizado con éxito' }, { status: 200 });
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