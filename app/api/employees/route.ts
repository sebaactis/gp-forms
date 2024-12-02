import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const employees = await db.employee.findMany({
        include: {
            CompletedForm: true
        }
    })

    return NextResponse.json(employees)
}

export async function POST(req: Request) {
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
        console.error("Error al asignar jefe al empleado:", error);
        return NextResponse.json(
            { error: "Error asignando el jefe al empleado", details: error.message },
            { status: 500 }
        );
    }
}