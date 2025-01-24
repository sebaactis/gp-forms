"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FormAddQuestion from "../../FormBuilder/FormAddQuestion";
import { FormQuestion } from "../../FormBuilder/FormQuestion";
import { Button } from "@/components/ui/button";
import styles from "@/app/components/Forms/FormBuilder/forms-builder.module.css"
import { useParams, useRouter } from "next/navigation";
import { useQuestions } from "@/hooks/useQuestions";
import { FormWithRelations } from "@/types";
import { useToast } from "@/hooks/use-toast";
import PulseLoader from "react-spinners/PulseLoader";

interface Props {
    existingForm: FormWithRelations | null
}

export const FormEditor = ({ existingForm }: Props) => {

    const { id } = useParams();
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false);

    const {
        questions,
        typeQuestion,
        optionLabel,
        name,
        labelQuestion,
        radioQuantities,
        setQuestions,
        setLabelQuestion,
        updateQuestionLabel,
        setTypeQuestion,
        setOptionLabel,
        setName,
        handleRadioQuantityChange,
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

        setLoading(true);

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

            await response.json();

            toast({
                title: 'Formulario editado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })
            router.push('/forms')

        } catch {
            toast({
                title: `Error al editar formulario!`,
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (existingForm) {
            setName(existingForm.name);
            setQuestions(existingForm.questions || []);
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
                    labelQuestion={labelQuestion}
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
                            handleRadioQuantityChange={handleRadioQuantityChange}
                            updateQuestionLabel={updateQuestionLabel}
                            radioQuantities={radioQuantities}
                        />
                    ))}
                </div>
                <Button className={styles.formCreateBtn} onClick={() => updateForm(id)}>
                    {loading ? <PulseLoader size={10} color="white" /> : "Enviar"}
                </Button>
            </section>
        </>
    );
};

export default FormEditor;
