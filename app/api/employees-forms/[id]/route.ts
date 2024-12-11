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
          questionText: response.questionText,
          questionType: response.questionType,
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