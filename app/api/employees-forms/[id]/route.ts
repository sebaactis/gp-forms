import { db } from "@/data/prisma";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { status, newResponses } = body;

  if (!newResponses || !Array.isArray(newResponses)) {
    return NextResponse.json(
      { message: 'Las respuestas no son válidas.' },
      { status: 400 }
    );
  }

  try {
    await db.$transaction(async (db) => {
      const existingResponses = await db.response.findMany({
        where: { completedFormId: id },
      });

      const existingResponsesMap = new Map(
        existingResponses.map((response) => [response.questionText, response])
      );

      const questionIds = newResponses
        .map((r) => r.questionId)
        .filter(Boolean);

      const questions = await db.question.findMany({
        where: { id: { in: questionIds } },
        include: { options: true },
      });

      const questionMap = new Map(questions.map((q) => [q.id, q]));

      for (const response of newResponses) {
        const { questionId, questionText, questionType, answer } = response;

        if (!questionText || !questionType) {
          throw new Error(`Datos incompletos para la respuesta.`);
        }

        let optionsJson: string | null = response.optionsJson || null;

        if (questionId && questionMap.has(questionId)) {
          const question = questionMap.get(questionId)!;

          optionsJson = JSON.stringify(
            question.options.map((option) => ({
              id: option.id,
              label: option.label,
            }))
          );
        }

        const existingResponse = existingResponsesMap.get(questionText);

        if (existingResponse) {
          await db.response.update({
            where: { id: existingResponse.id },
            data: {
              answer,
              optionsJson: optionsJson ?? existingResponse.optionsJson,
              questionText,
              questionType,
            },
          });
        } else {
          await db.response.create({
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

      await db.completedForm.update({
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
      {
        message: 'Error al procesar el formulario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

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