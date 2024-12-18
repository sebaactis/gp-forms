import { Button } from '@/components/ui/button'
import styles from './evaluation-complete.module.css'
import { useEffect, useState } from 'react'
import { FormStatus } from '@prisma/client'
import { EmployeeWithRelations } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import PulseLoader from 'react-spinners/PulseLoader'
interface Props {
    empleado: EmployeeWithRelations;
    formId: string | string[] | undefined;
}
const EvaluationComplete = ({ empleado, formId }: Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [form, setForm] = useState({
        newResponses: [],
        status: FormStatus.PENDIENTE,
    });

    const handleAnswers = (questionId, questionText, questionType, newAnswer, isCheckbox = false) => {
        setForm((prevForm) => {
            let updatedResponses;

            const answerCheck = prevForm.newResponses.find(
                (response) => response.questionId === questionId
            );

            if (answerCheck) {
                if (isCheckbox) {
                    const existingAnswers = answerCheck.answer ? answerCheck.answer.split(", ") : [];

                    const updatedAnswers = existingAnswers.includes(newAnswer)
                        ? existingAnswers.filter((ans) => ans !== newAnswer)
                        : [...existingAnswers, newAnswer];

                    updatedResponses = prevForm.newResponses.map((response) =>
                        response.questionId === questionId
                            ? { ...response, answer: updatedAnswers.join(", ") }
                            : response
                    );
                } else {
                    updatedResponses = prevForm.newResponses.map((response) =>
                        response.questionId === questionId
                            ? { ...response, answer: newAnswer }
                            : response
                    );
                }
            } else {
                updatedResponses = [
                    ...prevForm.newResponses,
                    {
                        questionId: questionId,
                        questionText,
                        questionType,
                        completedFormId: formId,
                        answer: newAnswer,
                    },
                ];
            }

            return {
                ...prevForm,
                newResponses: updatedResponses,
                status: FormStatus.EN_PROGRESO,
            };
        });
    };

    const getAnswerForQuestion = (questionId) => {
        const answerObj = form.newResponses.find((response) => response.questionId === questionId);
        return answerObj ? answerObj.answer : "";
    };

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await fetch(`/api/employees-forms/${formId}`);

                if (!response.ok) {
                    throw new Error("Error al obtener las respuestas del formulario");
                }

                const data = await response.json();

                setForm({
                    newResponses: data.responses || [],
                    status: data.status || FormStatus.PENDIENTE,
                });

                setIsLoaded(true);
            } catch (error) {
                console.error("Error al obtener las respuestas:", error);
            }
        };

        fetchResponses();
    }, [formId]);

    const handleSubmit = async () => {
        setLoading(true);

        const isCompleted =
            empleado.form?.questions.length === form.newResponses.length &&
            form.newResponses.every(
                (response) => response.answer && response.answer.trim() !== ""
            );

        const updatedForm = {
            ...form,
            status: isCompleted ? FormStatus.COMPLETADO : FormStatus.EN_PROGRESO,
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

            toast({
                title: "Evaluación enviada con éxito!",
                duration: 2000,
                className: "bg-green-600",
            });

            await response.json();
            setForm(updatedForm);

            router.push("/evaluations");
        } catch {
            toast({
                title: "Error al enviar la evaluación!",
                duration: 2000,
                className: "bg-red-300",
            });
        }
    };

    return (
        <div className={styles.container}>
            {empleado.form?.questions.map((question, index) => (
                <div className={styles.question} key={question.id}>
                    <p className={styles.questionLabel}>
                        <span className={styles.questionLabelIndex}>{index + 1}.</span>{" "}
                        {question.label}
                    </p>

                    {question.type === "text" && (
                        <input
                            className={styles.textInput}
                            type="text"
                            value={isLoaded ? getAnswerForQuestion(question.id) : ""}
                            onChange={(e) =>
                                handleAnswers(
                                    question.id,
                                    question.label,
                                    question.type,
                                    e.target.value
                                )
                            }
                            disabled={!isLoaded} // Bloquear input hasta que los datos estén listos
                        />
                    )}

                    {question.type === "checkbox" && (
                        <ul className={styles.checkboxContainer}>
                            {question.options.map((option) => (
                                <li key={option.id}>
                                    <label className={styles.labelCheckbox}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxSquare}
                                            checked={
                                                isLoaded &&
                                                getAnswerForQuestion(question.id)
                                                    .split(", ")
                                                    .includes(option.label)
                                            }
                                            onChange={() =>
                                                handleAnswers(
                                                    question.id,
                                                    question.label,
                                                    question.type,
                                                    option.label,
                                                    true
                                                )
                                            }
                                            disabled={!isLoaded}
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
                                            checked={
                                                isLoaded &&
                                                getAnswerForQuestion(question.id) === option.label
                                            }
                                            onChange={() =>
                                                handleAnswers(
                                                    question.id,
                                                    question.label,
                                                    question.type,
                                                    option.label
                                                )
                                            }
                                            disabled={!isLoaded}
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
                {loading ? (
                    <PulseLoader size={10} color="white" />
                ) : empleado.form?.questions.length === form.newResponses.length &&
                    form.newResponses.every(
                        (response) => response.answer && response.answer.trim() !== ""
                    ) ? (
                    "Enviar"
                ) : (
                    "Guardar Cambios"
                )}
            </Button>
        </div>
    );
};

export default EvaluationComplete;

