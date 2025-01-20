import { db } from "@/data/prisma";
import { Option, QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";

type Question = {
  id: number;
  formId: string;
  type: QuestionType;
  label: string;
  options: Option[];
};

export async function GET() {
  const forms = await db.form.findMany({
    include: {
      questions: {
        include: {
          options: true,
        },
      },
      employees: true
    },
  });

  return NextResponse.json(forms);
}

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { name, questions } = body;

    console.log(questions)

    const createForm = await db.form.create({
      data: {
        name,
        questions: {
          create: questions.map((question: Question) => ({
            label: question.label,
            type: question.type,
            options: {
              create: question.options.map((option: Option) => ({
                label: option.label,
              }))
            }
          }))
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    return NextResponse.json(createForm, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al crear el formulario", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error desconocido", error: "" },
        { status: 500 }
      );
    }

  }
}