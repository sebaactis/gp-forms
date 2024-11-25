"use client"

import React, { useState } from "react"
import styles from "./forms.module.css"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookPlus } from "lucide-react"

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

    const removeQuestion = (id) => {
        const newQuestions = questions.filter((q) => q.id !== id)
        setQuestions(newQuestions);
    }

    const updateQuestionOptions = (id, optionValue) => {
        setQuestions(
            questions.map((q) => q.id === id ? { ...q, options: [...q.options, { id: q.options.lenght + 1, label: optionValue }] } : q)
        )
    }

    const removeQuestionOptions = (questionId, optionId) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, options: q.options.filter((option) => option.id !== optionId) } : q
            )
        );
    }

    return (
        <>
            <div className={styles.titleContainer}>
                <BookPlus className={styles.titleIcon} />
                <h1 className={styles.title}>Creacion de formulario</h1>
                <p className={styles.titleBagde}>RRHH</p>
            </div>
            <section className={styles.mainContainer}>
                <div className={styles.createContainer}>
                    <h3 className={styles.subTitle}>Agregar pregunta:</h3>
                    <input
                        type="text"
                        placeholder="Ingresa la pregunta aqui..."
                        onChange={(e) => setLabelQuestion(e.target.value)}
                        className={styles.inputCreate}
                    />
                    <div className={styles.createTypeContainer}>
                        <h3 className={styles.createTypeLabel}>Tipo de pregunta:</h3>
                        <select
                            onChange={(e) => setTypeQuestion(e.target.value)}
                            className={styles.selectType}
                        >
                            <option value="text">Texto</option>
                            <option value="range">Rango (1-10)</option>
                            <option value="checkbox">Checkbox</option>
                        </select>
                        <Button className={styles.createBtn} onClick={addQuestion}> Agregar pregunta </Button>
                    </div>
                </div>

                <Separator />

                <div className={styles.questionsContainer}>
                    {questions.map((question) => (
                        <React.Fragment key={question.id}>
                            <div className={styles.questionContainer}>
                                <p className={styles.questionType}>
                                    <span className={styles.questionTypeId}>{question.id}.</span>
                                    Tipo:
                                    <span className={styles.questionTypeSpan}>
                                        {question.type}
                                    </span>
                                </p>
                                <p className={styles.questionLabel}>{question.label}</p>

                                {question.type === "checkbox" &&
                                    <div className={styles.checkboxContainer}>
                                        <div>
                                            <input className={styles.inputCheckbox} type="text" placeholder="Opción" onChange={(e) => setOptionLabel(e.target.value)} />
                                            <Button className={styles.addOptionBtn} onClick={() => updateQuestionOptions(question.id, optionLabel)}>
                                                Agregar opcion
                                            </Button>
                                        </div>
                                        <ul className={styles.checkboxItem}>
                                            {question.options.map((option) => (
                                                <li key={option.id}>
                                                    <label className={styles.labelContainer}>
                                                        <input className={styles.checkboxLabelItem} type="checkbox" value={option.label} disabled />
                                                        {option.label}
                                                        <button className={styles.checkBoxItemDeleteBtn} onClick={() => removeQuestionOptions(question.id, option.id)}>X</button>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>}
                                <Button
                                    className={styles.questionDeleteBtn}
                                    onClick={() => removeQuestion(question.id)}
                                >
                                    X
                                </Button>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </>
    )
}

export default FormBuilder