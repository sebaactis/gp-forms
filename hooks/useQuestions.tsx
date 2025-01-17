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
    const [radioQuantity, setRadioQuantity] = useState<number>(0);

    const addQuestion = () => {

        if (!typeQuestion || !labelQuestion) {
            toast({
                title: "La pregunta debe tener un tipo y un titulo",
                className: "bg-red-800",
                duration: 3000
            })
            return;
        }

        setLabelQuestion("")
        setTypeQuestion("text")
        setQuestions([...questions, { id: questions.length + 1, type: typeQuestion, label: labelQuestion, options: [] }])

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
            if (!optionValue) {
                toast({
                    title: "La opcion debe tener un titulo",
                    className: "bg-red-800",
                    duration: 3000
                })
                return;
            }
            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [
                                ...q.options,
                                { id: q.options.length + 1, label: optionValue, questionId: q.id }
                            ]
                        }
                        : q
                )
            )
        }

        if (type === "radio") {

            if (!radioQuantity) {
                toast({
                    title: "Debes seleccionar una cantidad de items",
                    className: "bg-red-800",
                    duration: 3000
                })
                return;
            }

            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [
                                ...Array.from({ length: radioQuantity }, (_, index) => ({
                                    id: index + 1,
                                    label: `${index + 1}`,
                                    questionId: q.id,
                                }))
                            ]
                        }
                        : q
                )
            );
        }
    }

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
        radioQuantity,
        setQuestions,
        setLabelQuestion,
        setTypeQuestion,
        updateQuestionLabel,
        setOptionLabel,
        setName,
        setRadioQuantity,
        addQuestion,
        removeQuestion,
        updateQuestionOptions,
        removeQuestionOptions,
    };
}