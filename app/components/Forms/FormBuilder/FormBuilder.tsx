"use client"

import styles from "./forms-builder.module.css"
import { Separator } from "@/components/ui/separator";
import { BookPlus } from "lucide-react"
import FormAddQuestion from "./FormAddQuestion";
import { FormQuestion } from "./FormQuestion";
import WelcomeBanner from "../../Globals/Welcome/WelcomeBanner";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

export const FormBuilder = () => {

    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const { questions, typeQuestion, optionLabel, name, setLabelQuestion,
        setTypeQuestion, setOptionLabel, setName, setRadioQuantity,
        addQuestion, removeQuestion, updateQuestionOptions, removeQuestionOptions, labelQuestion } = useQuestions();


    const createForm = async () => {
        if (!name) {
            toast({
                title: 'El nombre del formulario no puede estar vacio!',
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        if (questions.length === 0) {
            toast({
                title: 'No puedes crear un formulario sin preguntas!',
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        const form = {
            name,
            questions
        };

        setLoading(true)
        try {
            const response = await fetch('/api/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error('Error al crear el formulario');
            }

            toast({
                title: 'Formulario creado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })
            router.push('/forms')

        } catch {
            toast({
                title: 'Error al crear formulario!',
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setLoading(false);
        }
    };

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
                    placeholder="Ingresa el nombre del formulario aqui..."
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
                            setRadioQuantity={setRadioQuantity}
                        />
                    ))}
                </div>
                <Button className={styles.formCreateBtn} onClick={createForm}>{loading ? <PulseLoader size={10} color="white" /> : "Crear"}</Button>
            </section>
        </>
    )
}

export default FormBuilder