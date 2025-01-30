import { Button } from '@/components/ui/button';
import styles from './evaluation-complete.module.css';
import { useEffect, useState } from 'react';
import { FormStatus, Response } from '@prisma/client';
import { EmployeeWithRelations } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import PulseLoader from 'react-spinners/PulseLoader';
import { TextSelect } from "lucide-react"

interface Props {
    empleado: EmployeeWithRelations;
    formId: string | string[] | undefined;
}

interface FormState {
    newResponses: Response[];
    status: FormStatus;
}

type QuestionAccumulator = {
    elements: JSX.Element[];
    counter: number;
};

const EvaluationComplete = ({ empleado, formId }: Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [form, setForm] = useState<FormState>({
        newResponses: [],
        status: FormStatus.PENDIENTE,
    });

    const handleAnswers = (questionId, questionText, questionType, newAnswer, isCheckbox = false) => {

        setForm((prevForm) => {
            let updatedResponses;

            const answerCheck = prevForm.newResponses.find(
                (response: Response) => response.questionId === questionId
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

        const orderedResponses = empleado.form?.questions?.map((question) => {
            const existingResponse = form.newResponses.find(
                (response) => response.questionId === question.id
            );

            return (
                existingResponse || {
                    questionId: question.id,
                    questionText: question.label,
                    questionType: question.type,
                    completedFormId: formId,
                    answer: question.type === "description" ? "completed" : "",
                }
            );
        }) || [];

        const isCompleted =
            empleado.form?.questions?.length === orderedResponses.length &&
            orderedResponses.every(
                (response) => response.answer && response.answer.trim() !== ""
            );

        const updatedForm = {
            ...form,
            newResponses: orderedResponses,
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
                title: "Formulario enviado correctamente",
                duration: 2000,
                className: "bg-green-600",
            });

            router.push("/evaluations");
        } catch (error) {
            console.log("Error al enviar la evaluación:", error);

            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            toast({
                title: "Error al enviar la evaluación",
                description: errorMessage,
                duration: 2000,
                className: "bg-red-300",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {empleado.form?.questions?.reduce<QuestionAccumulator>(
                (acc, question) => {
                    const questionIndex = acc.counter;

                    acc.elements.push(
                        <div className={question.type === "description" ? styles.questionDescription : styles.question} key={question.id}>
                            {question.type === "description" ? (
                                <div>
                                    <TextSelect className='h-7 w-7 mb-4' />
                                    <textarea
                                        value={question.label}
                                        className={styles.questionLabel}
                                        rows={question.label.split("\n").length || 1}
                                        disabled
                                    />
                                </div>

                            ) : (
                                <div>
                                    <span className={styles.questionLabelIndex}>
                                        {questionIndex}.
                                    </span>{" "}
                                    <textarea
                                        value={question.label}
                                        className={styles.questionLabel}
                                        disabled
                                        rows={question.label.split("\n").length || 1}
                                    />
                                </div>

                            )}

                            {question.type === "text" && (
                                <textarea
                                    className={styles.textInput}
                                    value={isLoaded ? getAnswerForQuestion(question.id) : ""}
                                    onChange={(e) =>
                                        handleAnswers(
                                            question.id,
                                            question.label,
                                            question.type,
                                            e.target.value
                                        )
                                    }
                                    disabled={!isLoaded}
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
                    );

                    if (question.type !== "description") {
                        acc.counter++;
                    }

                    return acc;
                },
                { elements: [], counter: 1 }
            ).elements}

            <Button className={styles.btnEnviar} onClick={handleSubmit} disabled={!isLoaded || loading}>
                {loading ? (
                    <PulseLoader size={10} color="white" />
                ) : empleado.form?.questions
                    ?.filter((q) => q.type !== "description")
                    .every((q) =>
                        form.newResponses.some(
                            (response) => response.questionId === q.id && response.answer.trim() !== ""
                        )
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
