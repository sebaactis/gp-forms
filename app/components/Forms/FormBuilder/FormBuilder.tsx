"use client"

import { useState } from "react"
import styles from "./forms-builder.module.css"
import { Separator } from "@/components/ui/separator";
import { BookPlus } from "lucide-react"
import FormAddQuestion from "./FormAddQuestion";
import { FormQuestion } from "./FormQuestion";
import WelcomeBanner from "../../Globals/Welcome/WelcomeBanner";
import { Button } from "@/components/ui/button";
import { FormQuestionType } from "../types";

export const FormBuilder = () => {

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

    const createForm = () => {
        const form = {
            id: (Math.random() * 100000).toFixed(0),
            name,
            questions,
        }

        console.log(form);
    }

    return (
        <>
            <WelcomeBanner
                title="Creacion de formulario"
                bagde="RRHH"
                icon={BookPlus}
            />

            <section className={styles.mainContainer}>

                <h3 className={styles.subTitle}>Nombre del formulario</h3>
                <input
                    type="text"
                    placeholder="Ingresa la pregunta aqui..."
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputCreate}
                />

                <FormAddQuestion
                    styles={styles}
                    setLabelQuestion={setLabelQuestion}
                    setTypeQuestion={setTypeQuestion}
                    addQuestion={addQuestion}
                    typeQuestion={typeQuestion}
                />
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
                            setRadioQuantity={setRadioQuantity}
                        />
                    ))}
                </div>
                <Button className={styles.formCreateBtn} onClick={createForm}>Crear</Button>
            </section>
        </>
    )
}

export default FormBuilder