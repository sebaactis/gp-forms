import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const forms = await db.form.findMany({
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });


  return NextResponse.json(forms);
}

export async function POST(request: Request) {
  try {
      // Parsear el cuerpo de la solicitud
      const body = await request.json();
      const { name, questions } = body;

      // Crear el formulario junto con sus preguntas y opciones
      const createForm = await db.form.create({
          data: {
              name,
              questions: {
                  create: questions.map((question) => ({
                      label: question.label,
                      type: question.type,
                      options: {
                          create: question.options.map((option) => ({
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
      console.error("Error:", error);
      return NextResponse.json(
          { message: "Error al crear el formulario", error: error.message },
          { status: 500 }
      );
  }
}