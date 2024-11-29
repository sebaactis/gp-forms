import { Button } from '@/components/ui/button'
import styles from './evaluation-complete.module.css'
import { useState } from 'react'
import { FormStatus } from '@prisma/client'
const EvaluationComplete = ({ empleado, formId }) => {

    const [form, setForm] = useState({
        newResponses: [],
        status: FormStatus.PENDIENTE
    })

    const handleAnswers = (questionId, newAnswer, isCheckbox = false) => {
        let updatedResponses;

        const answerCheck = form.newResponses.find(
            (response) => response.questionId === questionId
        );

        if (answerCheck) {
            if (isCheckbox) {
                const existingAnswers = answerCheck.answer ? answerCheck.answer.split(', ') : [];

                const updatedAnswers = existingAnswers.includes(newAnswer)
                    ? existingAnswers.filter((ans) => ans !== newAnswer)
                    : [...existingAnswers, newAnswer];

                updatedResponses = {
                    ...form,
                    newResponses: form.newResponses.map((response) =>
                        response.questionId === questionId
                            ? { ...response, answer: updatedAnswers.join(', ') }
                            : response
                    ),
                    status: FormStatus.EN_PROGRESO,
                };
            } else {
                updatedResponses = {
                    ...form,
                    newResponses: form.newResponses.map((response) =>
                        response.questionId === questionId
                            ? { ...response, answer: newAnswer }
                            : response
                    ),
                    status: FormStatus.EN_PROGRESO,
                };
            }
        } else {
            updatedResponses = {
                ...form,
                newResponses: [
                    ...form.newResponses,
                    {
                        questionId: questionId,
                        completedFormId: empleado.CompletedForm[0].id,
                        answer: newAnswer,
                    },
                ],
                status: FormStatus.EN_PROGRESO,
            };
        }

        setForm(updatedResponses);
    };

    const handleSubmit = async () => {

        try {
            const response = await fetch(`/api/employees-forms/${formId}`, {
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
        <div>
            {empleado.form?.questions.map((question, index) => (
                <div className={styles.question} key={question.id}>
                    <p className={styles.questionLabel}> <span className={styles.questionLabelIndex}>{index + 1}.</span> {question.label}</p>

                    {question.type === 'text' &&

                        <input
                            className={styles.textInput}
                            type="text"
                            onChange={(e) => handleAnswers(question.id, e.target.value)}
                        />
                    }

                    {question.type === "checkbox" && (
                        <ul className={styles.checkboxContainer}>
                            {question.options.map((option) => (
                                <li key={option.id}>
                                    <label className={styles.labelCheckbox}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxSquare}
                                            onChange={() => handleAnswers(question.id, option.label, true)}
                                        />
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}

                    {question.type === "radio" && (
                        <ul className={styles.radioContainer}>
                            {question.options.map((option) => (
                                <li key={option.id}>
                                    <label className={styles.labelRadio}>
                                        <input
                                            className={styles.radioItem}
                                            type="radio"
                                            name={`question_${question.id}`}
                                            onChange={() => handleAnswers(question.id, option.label)}
                                        />
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            ))}

            <Button onClick={handleSubmit}>{empleado.form?.questions.length === form.newResponses.length ? "Enviar" : "Guardar Cambios"}</Button>
        </div>
    )
}

export default EvaluationComplete