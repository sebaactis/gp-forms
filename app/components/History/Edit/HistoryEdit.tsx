"use client"

import { BadgeInfo, CheckCircle, MousePointer2, TextCursorInputIcon } from "lucide-react"
import styles from "./historyEdit.module.css"
import { Separator } from "@/components/ui/separator"
import { CompletedFormWithRelations } from "@/types";
import { useToast } from "@/hooks/use-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    evaluation: CompletedFormWithRelations | undefined
    setEvaluation: React.Dispatch<React.SetStateAction<CompletedFormWithRelations | undefined>>;
}

const HistoryEdit = ({ evaluation, setEvaluation }: Props) => {

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const prepareNewResponses = (responses) => {
        return responses.map((response) => ({
          questionId: response.questionId || null, // Puede ser null si la pregunta fue eliminada
          questionText: response.questionText,    // Texto de la pregunta
          questionType: response.questionType,    // Tipo de la pregunta
          optionsJson: response.optionsJson || null, // Opciones en JSON si corresponde
          answer: response.answer,                // Respuesta del usuario
        }));
      };

    const handleSubmit = async () => {
        const newResponses = prepareNewResponses(evaluation.responses);

        const payload = {
            status: "COMPLETADO",
            newResponses,
        };

        setLoading(true);

        try {
            const response = await fetch(`/api/employees-forms/${evaluation.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al enviar las respuestas.");
            }

            await response.json();

            toast({
                title: "Evaluacion editada con éxito!",
                duration: 2000,
                className: 'bg-green-600'
            })

            router.push("/history")

        } catch {
            toast({
                title: "Error al editar la evaluacion!",
                duration: 2000,
                className: 'bg-red-600'
            })

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id, value, type, isChecked = false) => {
        setEvaluation((prev) => ({
            ...prev,
            responses: prev.responses.map((response) => {
                if (response.id !== id) return response;

                switch (type) {
                    case "text":
                        return { ...response, answer: value };

                    case "checkbox": {
                        const currentAnswers = response.answer ? response.answer.split(', ') : [];

                        const updatedAnswers = isChecked
                            ? [...currentAnswers, value]
                            : currentAnswers.filter((item) => item !== value);

                        return {
                            ...response,
                            answer: updatedAnswers.join(', '),
                        };
                    }

                    case "radio":
                        return { ...response, answer: value };

                    default:
                        return response;
                }
            }),
        }));
    };

    return (
        <div className={styles.evaluationContainer}>

            <div className={styles.infoContainer}>
                <BadgeInfo size={25} color='#ff00e1' />
                <h3>
                    <span className={styles.titleInfo}>Evaluacion de: </span>
                    {evaluation?.employee?.nombre} {evaluation?.employee?.apellido}</h3>
                <p><span className={styles.titleInfo}>Completada el dia:</span>  {new Date(evaluation?.completedAt).toLocaleDateString()}</p>
                <p><span className={styles.titleInfo}>Formulario:</span>  {evaluation?.formTitle}</p>
                <p><span className={styles.titleInfo}>Cantidad de preguntas respondidas:</span>  {evaluation?.responses.length}</p>
            </div>

            <Separator />

            <div className={styles.responseContainer}>
                {evaluation?.responses.map((response) => {
                    if (response.questionType === "text") {
                        return (
                            <div className={styles.inputTextContainer} key={response.id}>
                                <TextCursorInputIcon />
                                <p className={styles.inputTextLabel}>{response.questionText}</p>
                                <input
                                    className={styles.inputText}
                                    type="text"
                                    key={response.id}
                                    value={response.answer}
                                    onChange={(e) => handleChange(response.id, e.target.value, "text")}
                                />
                            </div>
                        );
                    }

                    if (response.questionType === "checkbox") {
                        const options = JSON.parse(response.optionsJson);
                        return (
                            <div className={styles.inputCheckboxContainer} key={response.id}>
                                <CheckCircle />
                                <p className={styles.inputCheckLabel}>{response.questionText}</p>
                                {options.map((option) => (
                                    <div className={styles.checkboxOptions} key={option.id}>
                                        <p className={styles.checkboxLabel}>{option.label}</p>
                                        <input
                                            className={styles.checkboxInput}
                                            type="checkbox"
                                            checked={response.answer.includes(option.label)}
                                            onChange={(e) => handleChange(response.id, option.label, "checkbox", e.target.checked)}
                                        />

                                    </div>
                                ))}
                            </div>
                        );
                    }

                    if (response.questionType === "radio") {
                        const options = JSON.parse(response.optionsJson);
                        return (
                            <div className={styles.inputRadioContainer} key={response.id}>
                                <MousePointer2 />
                                <p className={styles.inputRadioLabel}>{response.questionText}</p>
                                <div className={styles.radioOptionsContainer}>
                                    {options.map((option) => (
                                        <div className={styles.radioOptions} key={option.id}>
                                            <p className={styles.radioLabel}>{option.label}</p>
                                            <input
                                                className={styles.radioInput}
                                                type="radio"
                                                name={response.id}
                                                value={option.label}
                                                checked={response.answer === option.label}
                                                onChange={() => handleChange(response.id, option.label, "radio")}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
            <button className={styles.btnEnviar} onClick={handleSubmit}>{loading ? <PulseLoader size={10} color="white" /> : "Enviar"}</button>
        </div>
    )
}

export default HistoryEdit