import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    let whereClause = {};

    if (statusFilter) {
        if (statusFilter.startsWith('not:')) {
            whereClause = {
                status: {
                    not: statusFilter.replace('not:', ''),
                },
            };
        } else {
            whereClause = {
                status: statusFilter,
            };
        }
    }

    const forms = await db.completedForm.findMany({
        where: whereClause,
        include: {
            form: true,
            employee: true,
            responses: {
                include: {
                    question: {
                        include: {
                            options: true
                        }
                    }
                }
            }
        }
    });

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
                userId: 'c17beaba-4535-4ee8-9674-8c251b849f71',
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