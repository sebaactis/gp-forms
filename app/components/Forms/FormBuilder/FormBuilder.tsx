"use client"

import styles from "./forms-builder.module.css"
import { Separator } from "@/components/ui/separator";
import { BookPlus } from "lucide-react"
import FormAddQuestion from "./FormAddQuestion";
import { FormQuestion } from "./FormQuestion";
import WelcomeBanner from "../../Globals/Welcome/WelcomeBanner";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";

export const FormBuilder = () => {

    const { questions, typeQuestion, optionLabel, name, setLabelQuestion,
        setTypeQuestion, setOptionLabel, setName, setRadioQuantity,
        addQuestion, removeQuestion, updateQuestionOptions, removeQuestionOptions, } = useQuestions();


    const createForm = async () => {
        if (name === "") return;
        if (questions.length === 0) return;

        const form = {
            name,
            questions
        };

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

            const data = await response.json();
            return console.log(data);
        } catch {
            alert('Hubo un error al crear el formulario');
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