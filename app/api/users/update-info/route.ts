import { NextResponse } from "next/server";
import { db } from "@/data/prisma";
import { authOptions } from "../../auth/authOptions";
import { getServerSession } from "next-auth";

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { nombre, apellido } = body;

        if (!nombre && !apellido) {
            return NextResponse.json(
                { error: "Debe proporcionar al menos un campo para actualizar" },
                { status: 400 }
            );
        }

        const updatedUser = await db.user.update({
            where: { email: session.user.email },
            data: {
                nombre,
                apellido,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
