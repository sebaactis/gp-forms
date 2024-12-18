import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { formId, employeeId } = body;

        console.log(formId, employeeId);

        // Validación de parámetros
        if (!formId || !employeeId) {
            return NextResponse.json(
                { error: "Faltan datos (formId o employeeId)" },
                { status: 400 }
            );
        }

        const updatedEmployee = await db.employee.update({
            where: { id: employeeId },
            data: { formId: formId },
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