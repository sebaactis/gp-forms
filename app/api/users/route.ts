import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const users = await db.user.findMany()

    return NextResponse.json(users)
}