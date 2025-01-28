import { db } from "@/data/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
    const users = await db.user.findMany({
    })

    return NextResponse.json(users)
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Correo y contraseña son requeridos" },
                { status: 400 }
            );
        }

        if (!email.endsWith("@globalprocessing.com.ar")) {

            return NextResponse.json(
                { error: "El correo debe pertenecer al dominio @globalprocessing.com.ar" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: {
                email: email
            }
        });


        if (!user) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 401 }
            );
        }

        if (!await bcrypt.compare(password, user.password)) {
            return NextResponse.json(
                { error: "Contraseña incorrecta" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            id: user.id,
            name: user.nombre,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {

    const body = await request.json();
    const { userId, role } = body;

    await db.user.update({
        where: { id: userId },
        data: {
            role
        }
    })

    return NextResponse.json({
        message: "User updated successfully",
        status: 200
    })
}