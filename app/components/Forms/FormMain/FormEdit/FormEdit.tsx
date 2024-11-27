"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FormAddQuestion from "../../FormBuilder/FormAddQuestion";
import { FormQuestion } from "../../FormBuilder/FormQuestion";
import { Button } from "@/components/ui/button";
import { FormQuestionType, FormType } from "../types";
import styles from "@/app/components/Forms/FormBuilder/forms-builder.module.css"
import { useParams } from "next/navigation";

interface FormEditorProps {
    existingForm: FormType;
}

export const FormEditor = ({ existingForm }: FormEditorProps) => {
    const { id } = useParams();
    const [questions, setQuestions] = useState<FormQuestionType[]>([]);
    const [labelQuestion, setLabelQuestion] = useState<string>("");
    const [typeQuestion, setTypeQuestion] = useState<string>("text");
    const [optionLabel, setOptionLabel] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [radioQuantity, setRadioQuantity] = useState<number>(0);

    useEffect(() => {
        if (existingForm) {
            setName(existingForm.name);
            setQuestions(existingForm.questions);
        }
    }, [existingForm]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: questions.length + 1, type: typeQuestion, label: labelQuestion, options: [] },
        ]);
    };

    const removeQuestion = (id: number) => {
        const newQuestions = questions.filter((q) => q.id !== id);
        setQuestions(newQuestions);
    };

    const updateQuestionOptions = (id: number, optionValue?: string, type: string) => {
        if (type === "checkbox") {
            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [...q.options, { id: q.options.length + 1, label: optionValue }],
                        }
                        : q
                )
            );
        }

        if (type === "radio") {
            setQuestions(
                questions.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            options: [
                                ...Array.from({ length: radioQuantity }, (_, index) => ({
                                    id: q.options.length + index + 1,
                                    label: (index + 1).toString(),
                                })),
                            ],
                        }
                        : q
                )
            );
        }
    };

    const removeQuestionOptions = (questionId: number, optionId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? { ...q, options: q.options.filter((option) => option.id !== optionId) }
                    : q
            )
        );
    };

    const updateForm = async (id) => {
        if (name === "") return;
        
        if (questions.length === 0) return;
        
    
        const form = {
            name,
            questions,
        };
    
        try {
            const response = await fetch(`/api/forms/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
    
            if (!response.ok) {
                throw new Error("Error al actualizar el formulario");
            }
    
            const data = await response.json();
            console.log(data);
        } catch {
            console.log("Error")
        }
    };

    return (
        <>
            <section className={styles.mainContainer}>
                <h3 className={styles.subTitle}>Nombre del formulario</h3>
                <input
                    type="text"
                    placeholder="Ingresa el nombre del formulario..."
                    value={name}
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
                <Button className={styles.formCreateBtn} onClick={() => updateForm(id)}>
                    Guardar Cambios
                </Button>
            </section>
        </>
    );
};

export default FormEditor;
