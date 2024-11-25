"use client"

import { useState } from "react"
import styles from "./forms.module.css"
import { Separator } from "@/components/ui/separator";
import { BookPlus } from "lucide-react"
import FormAddQuestion from "./FormAddQuestion";
import { FormQuestion } from "./FormQuestion";
import WelcomeBanner from "../Globals/Welcome/WelcomeBanner";

interface FormQuestion {
    id: number;
    type: string;
    label: string;
    options: Array<string>;
}
export const FormBuilder = () => {

    const [questions, setQuestions] = useState<FormQuestion>([
        { id: 1, type: "text", label: "Pregunta texto", options: [] },
        { id: 2, type: "range", label: "Pregunta range", options: [] },
        {
            id: 3, type: "checkbox", label: "Pregunta checkbox", options: [
                { id: 1, label: "Opcion 1" },
                { id: 2, label: "Opcion 2" }]
        }
    ])
    const [labelQuestion, setLabelQuestion] = useState<string>("")
    const [typeQuestion, setTypeQuestion] = useState<string>("text")
    const [optionLabel, setOptionLabel] = useState<string>("")

    const addQuestion = () => {
        setQuestions([...questions, { id: questions.length + 1, type: typeQuestion, label: labelQuestion, options: [] }])
    }

    const removeQuestion = (id: number) => {
        const newQuestions = questions.filter((q) => q.id !== id)
        setQuestions(newQuestions);
    }

    const updateQuestionOptions = (id: number, optionValue: string) => {
        setQuestions(
            questions.map((q) => q.id === id ? { ...q, options: [...q.options, { id: q.options.length + 1, label: optionValue }] } : q)
        )
    }

    const removeQuestionOptions = (questionId: number, optionId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, options: q.options.filter((option) => option.id !== optionId) } : q
            )
        );
    }

    return (
        <>
            <WelcomeBanner
                title="Creacion de formulario"
                bagde="RRHH"
                icon={BookPlus}
            />

            <section className={styles.mainContainer}>
                <FormAddQuestion
                    styles={styles}
                    setLabelQuestion={setLabelQuestion}
                    setTypeQuestion={setTypeQuestion}
                    addQuestion={addQuestion} />
                <Separator />
                <div className={styles.questionsContainer}>
                    {questions.map((question) => (
                        <FormQuestion
                            key={question.id}
                            question={question}
                            styles={styles}
                            setOptionLabel={setOptionLabel}
                            updateQuestionOptions={updateQuestionOptions}
                            removeQuestionOptions={removeQuestionOptions}
                            removeQuestion={removeQuestion}
                            optionLabel={optionLabel}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}

export default FormBuilder