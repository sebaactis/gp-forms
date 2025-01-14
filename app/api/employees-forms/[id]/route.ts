import { db } from "@/data/prisma";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type ResponseType = {
  id: string;
  questionId: number | null;
  questionText: string | null;
  questionType: string | null;
  optionsJson: string | null;
  completedFormId: string;
  answer: string;
};

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

      const existingResponsesMap = existingResponses.reduce<Record<string, ResponseType>>((map, response) => {
        if (response.questionText != null) {
          map[response.questionText] = response;
        } else {
          console.warn('response.questionText es nulo o indefinido:', response);
        }
        return map;
      }, {});


      for (const response of newResponses) {
        const { questionId, questionText, questionType, answer } = response;

        if (!questionText || !questionType) {
          throw new Error(`Datos incompletos para la respuesta.`);
        }

        let optionsJson: string | null = response.optionsJson || null;

        if (questionId) {
          const question = await db.question.findUnique({
            where: { id: questionId },
            include: { options: true },
          });

          optionsJson = question
            ? JSON.stringify(question.options.map((option) => ({
              id: option.id,
              label: option.label,
            })))
            : optionsJson;
        }

        const existingResponse = existingResponsesMap[questionText];

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
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error al procesar el formulario', error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: 'Error desconocido', error: "" },
        { status: 500 }
      );
    }

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