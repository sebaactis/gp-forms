import { useState } from "react";
import { useToast } from "./use-toast";
import { Option } from "@prisma/client";

export interface FormQuestionType {
    id: number;
    type: string;
    label: string;
    options: Option[];
}

export const useQuestions = () => {
    const { toast } = useToast();

    const [questions, setQuestions] = useState<FormQuestionType[]>([])
    const [labelQuestion, setLabelQuestion] = useState<string>("")
    const [typeQuestion, setTypeQuestion] = useState<string>("text")
    const [optionLabel, setOptionLabel] = useState<string>("")
    const [name, setName] = useState<string>("");
    const [radioQuantities, setRadioQuantities] = useState<{ [key: number]: number }>({});

    const handleRadioQuantityChange = (questionId, value) => {
        setRadioQuantities((prev) => ({
            ...prev,
            [questionId]: Number(value),
        }));
    };

    const addQuestion = () => {

        if (!typeQuestion || !labelQuestion) {
            toast({
                title: "La pregunta debe tener un tipo y un titulo",
                className: "bg-red-800",
                duration: 3000
            })
            return;
        }

        const newQuestions = [...questions, { id: questions.length + 1, type: typeQuestion, label: labelQuestion, options: []}]

        setLabelQuestion("")
        setTypeQuestion("text")
        setQuestions(newQuestions)

    }

    const removeQuestion = (id: number) => {
        const newQuestions = questions.filter((q) => q.id !== id)
        setQuestions(newQuestions);
    }

    const updateQuestionLabel = (id: number, newLabel: string) => {

        if (!newLabel) {
            toast({
                title: "La pregunta debe tener una consigna",
                className: "bg-red-800",
                duration: 3000
            })
            return;
        }

        setQuestions(
            questions.map((q) =>
                q.id === id ? { ...q, label: newLabel } : q
            )
        );
    };

    const updateQuestionOptions = (id: number, optionValue?: string | null, type?: string) => {

        if (type === "checkbox") {
            if (!optionValue || optionValue.trim() === "") {
                toast({
                    title: "La opción debe tener un título válido",
                    className: "bg-red-800",
                    duration: 3000,
                });
                return;
            }

            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [
                                ...q.options,
                                {
                                    id: q.options.length + 1,
                                    label: optionValue.trim(),
                                    questionId: q.id,
                                },
                            ],
                        }
                        : q
                )
            );
        }

        if (type === "radio") {
            const quantity = radioQuantities[id];

            console.log(quantity)

            if (!quantity || quantity <= 0) {
                toast({
                    title: "Debes seleccionar una cantidad válida de items",
                    className: "bg-red-800",
                    duration: 3000,
                });
                return;
            }

            const existingOptions = questions.find((q) => q.id === id)?.options || [];
            if (existingOptions.length === quantity) {
                toast({
                    title: "La cantidad de opciones ya coincide con la seleccionada",
                    className: "bg-yellow-600",
                    duration: 3000,
                });
                return;
            }

            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [
                                ...Array.from({ length: quantity }, (_, index) => ({
                                    id: index + 1,
                                    label: `${index + 1}`,
                                    questionId: q.id,
                                })),
                            ],
                        }
                        : q
                )
            );

            toast({
                title: `Se actualizaron las opciones para la pregunta ${id}`,
                className: "bg-green-800",
                duration: 3000,
            });
        }
    };

    const removeQuestionOptions = (questionId: number, optionId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, options: q.options.filter((option) => option.id !== optionId) } : q
            )
        );
    }

    return {
        questions,
        labelQuestion,
        typeQuestion,
        optionLabel,
        name,
        radioQuantities,
        setQuestions,
        setLabelQuestion,
        setTypeQuestion,
        updateQuestionLabel,
        setOptionLabel,
        setName,
        handleRadioQuantityChange,
        addQuestion,
        removeQuestion,
        updateQuestionOptions,
        removeQuestionOptions,
    };
}