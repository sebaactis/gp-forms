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