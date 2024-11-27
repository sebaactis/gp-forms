import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const form = await db.form.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        if (!form) {
            return NextResponse.json({ message: 'Formulario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(form, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: 'Error al obtener el formulario' }, { status: 500 });
    }
}