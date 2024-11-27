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