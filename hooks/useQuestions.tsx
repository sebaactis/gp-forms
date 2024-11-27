import { useState } from "react";

export interface FormQuestionType {
    id: number;
    type: string;
    label: string;
    options: Array<string>;
}

export const useQuestions = () => {

    const [questions, setQuestions] = useState<FormQuestionType>([])
    const [labelQuestion, setLabelQuestion] = useState<string>("")
    const [typeQuestion, setTypeQuestion] = useState<string>("text")
    const [optionLabel, setOptionLabel] = useState<string>("")
    const [name, setName] = useState<string>("");
    const [radioQuantity, setRadioQuantity] = useState<number>(0);

    const addQuestion = () => {
        setQuestions([...questions, { id: questions.length + 1, type: typeQuestion, label: labelQuestion, options: [] }])
    }

    const removeQuestion = (id: number) => {
        const newQuestions = questions.filter((q) => q.id !== id)
        setQuestions(newQuestions);
    }

    const updateQuestionOptions = (id: number, optionValue?: string, type: string) => {

        if (type === "checkbox") {
            setQuestions(
                questions.map((q) => q.id === id ? { ...q, options: [...q.options, { id: q.options.length + 1, label: optionValue }] } : q)
            )
        }

        if (type === "radio") {
            setQuestions(
                questions.map((q) => q.id === id ? {
                    ...q, options: [...Array.from({ length: radioQuantity }, (_, index) => ({
                        id: q.options.length + index + 1,
                        label: (index + 1).toString()
                    }))],
                } : q
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
        setOptionLabel,
        setName,
        setRadioQuantity,
        addQuestion,
        removeQuestion,
        updateQuestionOptions,
        removeQuestionOptions,
    };
}