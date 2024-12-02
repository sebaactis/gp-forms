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