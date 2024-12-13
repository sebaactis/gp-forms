import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const users = await db.user.findMany({
    })

    return NextResponse.json(users)
}

export async function PUT(request: Request) {

    const body = await request.json();
    const { userId, role } = body;

    const user = await db.user.update({
        where: { id: userId },
        data: {
            role
        }
    })

    return NextResponse.json(user)
}