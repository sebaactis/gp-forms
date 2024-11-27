"use client";

import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import FormAddQuestion from "../../FormBuilder/FormAddQuestion";
import { FormQuestion } from "../../FormBuilder/FormQuestion";
import { Button } from "@/components/ui/button";
import { FormType } from "../types";
import styles from "@/app/components/Forms/FormBuilder/forms-builder.module.css"
import { useParams } from "next/navigation";
import { useQuestions } from "@/hooks/useQuestions";

interface FormEditorProps {
    existingForm: FormType;
}

export const FormEditor = ({ existingForm }: FormEditorProps) => {
    const { id } = useParams();

    const {
        questions,
        typeQuestion,
        optionLabel,
        name,
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
    } = useQuestions();

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

    useEffect(() => {
        if (existingForm) {
            setName(existingForm.name);
            setQuestions(existingForm.questions);
        }
    }, [existingForm, setName, setQuestions]);


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
