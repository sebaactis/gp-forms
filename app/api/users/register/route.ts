import { db } from "@/data/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, nombre, apellido } = body;

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

        const existingUser = await db.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "El correo ya está registrado" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email: email,
                password: hashedPassword,
                nombre: nombre,
                apellido: apellido,
                role: "USER"
            }
        });

        return NextResponse.json({
            id: newUser.id,
            email: newUser.email,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            role: newUser.role
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}