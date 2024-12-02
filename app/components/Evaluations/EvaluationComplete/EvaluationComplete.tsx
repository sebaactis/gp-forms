import { Button } from '@/components/ui/button'
import styles from './evaluation-complete.module.css'
import { useEffect, useState } from 'react'
import { FormStatus } from '@prisma/client'
import { EmployeeWithRelations } from '@/types'

interface Props {
    empleado: EmployeeWithRelations;
    formId: string;
}
const EvaluationComplete = ({ empleado, formId }: Props) => {

    const [form, setForm] = useState({
        newResponses: [],
        status: FormStatus.PENDIENTE
    });
    const [loading, setLoading] = useState(false);

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
                        completedFormId: formId,
                        answer: newAnswer,
                    },
                ],
                status: FormStatus.EN_PROGRESO,
            };
        }

        setForm(updatedResponses);
    };

    const handleSubmit = async () => {

        const isCompleted = empleado.form?.questions.length === form.newResponses.length
            && form.newResponses.every(response => response.answer && response.answer.trim() !== "");

        const updatedForm = {
            ...form,
            status: isCompleted ? FormStatus.COMPLETADO : FormStatus.EN_PROGRESO
        };

        try {
            const response = await fetch(`/api/employees-forms/${formId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedForm),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el formulario");
            }

            const data = await response.json();
            setForm(updatedForm);

            console.log(data);
        } catch {
            console.log("Error")
        }

    };

    const getAnswerForQuestion = (questionId) => {
        const answerObj = form.newResponses.find((response) => response.questionId === questionId);
        return answerObj ? answerObj.answer : '';
    };

    useEffect(() => {
        const fetchResponses = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/employees-forms/${formId}`);

                if (!response.ok) {
                    throw new Error("Error al obtener las respuestas del formulario");
                }

                const data = await response.json();

                setForm({
                    newResponses: data.responses || [],
                    status: data.status || FormStatus.PENDIENTE
                });
            } catch (error) {
                console.error("Error al obtener las respuestas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [formId]);

    if (loading) return <p>Cargando...</p>

    return (
        <div className={styles.container}>
            {empleado.form?.questions.map((question, index) => (
                <div className={styles.question} key={question.id}>
                    <p className={styles.questionLabel}> <span className={styles.questionLabelIndex}>{index + 1}.</span> {question.label}</p>

                    {question.type === 'text' &&

                        <input
                            className={styles.textInput}
                            type="text"
                            value={getAnswerForQuestion(question.id)}
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
                                            checked={getAnswerForQuestion(question.id).split(', ').includes(option.label)}
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
                                            checked={getAnswerForQuestion(question.id) === option.label}
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

            <Button className={styles.btnEnviar} onClick={handleSubmit}>
                {empleado.form?.questions.length === form.newResponses.length &&
                    form.newResponses.every(response => response.answer && response.answer.trim() !== "")
                    ? "Enviar"
                    : "Guardar Cambios"}
            </Button>
        </div>
    )
}

export default EvaluationComplete