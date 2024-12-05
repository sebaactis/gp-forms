import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const forms = await db.completedForm.findMany({
        include: {
            form: true,
            employee: true,
        },
        where: {
            status: {
                not: 'COMPLETADO'
            }
        }
    })

    return NextResponse.json(forms);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const employee = await db.employee.findFirst({
            where: { id: body.employeeId },
            include: { form: true }
        })

        if (!employee) {
            throw new Error('No existe ese empleado')
        }

        if (!employee.formId || !employee.userId) {
            throw new Error('Ese empleado no tiene formulario asignado o jefe asignado')
        }

        await db.completedForm.create({
            data: {
                userId: 'faf7e587-8471-4d62-a77e-60522d603308',
                employeeId: body.employeeId,
                formId: employee.formId,
                formTitle: employee.form?.name,
                period: body.period,
                status: 'PENDIENTE',
                startDate: new Date(),
                endDate: new Date(body.endDate)
            }
        })

        return NextResponse.json({ response: "Success" })
    } catch {
        return NextResponse.json({ response: "Error" })
    }
}