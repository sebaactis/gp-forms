import { db } from "@/data/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { status, newResponses } = body;

  // Iteramos sobre las respuestas y realizamos la actualización o creación.
  for (const response of newResponses) {
    const existingResponse = await db.response.findUnique({
      where: {
        completedFormId_questionId: {
          completedFormId: id,
          questionId: response.questionId,
        },
      },
    });

    if (existingResponse) {

      await db.response.update({
        where: {
          id: existingResponse.id,
        },
        data: {
          answer: response.answer,
        },
      });
    } else {
      await db.response.create({
        data: {
          id: randomUUID(),
          completedFormId: id,
          questionId: response.questionId,
          answer: response.answer,
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

  return NextResponse.json({ message: "Formulario actualizado/finalizado con éxito" }, { status: 200 });
}