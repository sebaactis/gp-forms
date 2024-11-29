import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const forms = await db.completedForm.findMany({
        include: {
            form: true,
            employee: true,
        }
    })

    return NextResponse.json(forms);
}