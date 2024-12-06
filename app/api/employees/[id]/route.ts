import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {

  const { id } = params;

  const employee = await db.employee.findFirst({
    where: { id },
    include: {
      CompletedForm: {
        include: {
          responses: true
        }
      },
      form: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      }
    }
  });

  return NextResponse.json(employee)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    const body = await request.json();
    const { legajo, email, nombre, apellido, gerencia, puesto, seniority } = body;

    const empleado = await db.employee.update({
      where: { id },
      data: {
        legajo: Number(legajo),
        email,
        nombre,
        apellido,
        gerencia,
        puesto,
        seniority
      }
    })

    return NextResponse.json(empleado)
  } catch (err) {
    return NextResponse.json(err)
  }

}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    const empleado = await db.employee.delete({
      where: { id },
    })

    return NextResponse.json(empleado)
  } catch (err) {
    return NextResponse.json(err)
  }

}