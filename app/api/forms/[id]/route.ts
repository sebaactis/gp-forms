import { db } from "@/data/prisma";
import { FormStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = params;
    const body = await request.json();
    const { name, questions } = body;

    try {


        await db.question.deleteMany({
            where: {
                formId: id
            },
        });

        await db.form.update({
            where: { id },
            data: { name },
        });

        for (const question of questions) {
            await db.question.create({
                data: {
                    label: question.label,
                    type: question.type,
                    formId: id,
                    options: {
                        create: question.options.map((option) => ({
                            label: option.label
                        })),
                    },
                },
            });
        }

        return NextResponse.json({ message: "Formulario actualizado con éxito" }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar el formulario:", error);
        return NextResponse.json({ message: "Error al actualizar el formulario" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = params;

    try {

        await db.completedForm.deleteMany({
            where: {
                formId: id,
                status: {
                    in: [FormStatus.PENDIENTE, FormStatus.EN_PROGRESO]
                }
            },
        });

        const deletedForm = await db.form.delete({
            where: { id },
        });

        if (!deletedForm) {
            return NextResponse.json({ message: "Formulario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Formulario eliminado con éxito" }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el formulario:", error);
        return NextResponse.json({ message: "Error al eliminar el formulario" }, { status: 500 });
    }
}