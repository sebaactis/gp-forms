import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
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
        const { currentPassword, newPassword, repeatNewPassword } = body;

        if (!currentPassword || !newPassword || !repeatNewPassword) {
            return NextResponse.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        if (newPassword !== repeatNewPassword) {
            return NextResponse.json(
                { error: "Las contraseñas no coinciden" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return NextResponse.json(
                { error: "La contraseña actual es incorrecta" },
                { status: 401 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword, updatedAt: new Date() },
        });

        return NextResponse.json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
