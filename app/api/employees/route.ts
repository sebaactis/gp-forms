import { db } from "@/data/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Employee, FormStatus } from "@prisma/client";
import { authOptions } from "../auth/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
    let employees: (Employee & {
        CompletedForm: {
            status: FormStatus;
            id: string;
            formId: string | null;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            employeeId: string;
            formTitle: string | null;
            period: string;
            completedAt: Date | null;
            startDate: Date;
            endDate: Date;
        }[];
    })[];

    if (!session || !session.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email as string,
        }
    });

    if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.role === "RRHH") {
        employees = await db.employee.findMany({
            include: {
                CompletedForm: true,
            },
            orderBy: {
                nombre: "asc",
            },
        });
    } else {
        employees = await db.employee.findMany({
            where: {
                userId: user.id
            },
            include: {
                CompletedForm: true,
            },
            orderBy: {
                nombre: "asc",
            },
        });
    }

    return NextResponse.json(employees);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { legajo, email, nombre, apellido, gerencia, puesto, seniority, userId } = body;

        const empleado = await db.employee.create({
            data: {
                legajo: Number(legajo),
                email,
                nombre,
                apellido,
                gerencia,
                puesto,
                seniority,
                userId
            }
        })

        return NextResponse.json(empleado)
    } catch (err) {
        return NextResponse.json(err)
    }

}

export async function PUT(req: Request) {
    try {
        const body = await req.json(); // Parsear el cuerpo de la solicitud
        const { bossId, employeeId } = body;

        // Validación de parámetros
        if (!bossId || !employeeId) {
            return NextResponse.json(
                { error: "Faltan datos (bossId o employeeId)" },
                { status: 400 }
            );
        }

        const updatedEmployee = await db.employee.update({
            where: { id: employeeId },
            data: { userId: bossId },
        });

        return NextResponse.json({
            message: "Jefe asignado correctamente al empleado",
            employee: updatedEmployee,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Error asignando el jefe al empleado", details: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "Error desconocido", details: "" },
                { status: 500 }
            );
        }

    }
}