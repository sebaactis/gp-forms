import { BadgeInfo, MousePointer2, TextCursorInputIcon } from "lucide-react"
import styles from "./historyEdit.module.css"
import { Separator } from "@/components/ui/separator"
import { CompletedFormWithRelations } from "@/types";

interface Props {
    evaluation: CompletedFormWithRelations
    setEvaluation: React.Dispatch<React.SetStateAction<CompletedFormWithRelations>>;
}

const HistoryEdit = ({ evaluation, setEvaluation }: Props) => {

    const handleChange = (id, value, type, isChecked = false) => {
        setEvaluation((prev) => ({
            ...prev,
            responses: prev.responses.map((response) => {
                if (response.id !== id) return response;

                switch (type) {
                    case "text":
                        return { ...response, answer: value };

                    case "checkbox":
                        return {
                            ...response,
                            answer: isChecked
                                ? [...response.answer, value] // Agregar la opción seleccionada
                                : response.answer.filter((item) => item !== value), // Quitar la opción deseleccionada
                        };

                    case "radio":
                        return { ...response, answer: value };

                    default:
                        return response;
                }
            }),
        }));
    };

    console.log(evaluation)

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
                            <div className={styles.inputTextContainer} key={response.id}>
                                <p>{response.questionText}</p>
                                {options.map((option) => (
                                    <label key={option.id}>
                                        <input
                                            type="checkbox"
                                            checked={response.answer.includes(option.label)}
                                            onChange={(e) => handleChange(response.id, option.label, "checkbox", e.target.checked)}
                                        />
                                        {option.label}
                                    </label>
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

        </div>
    )
}

export default HistoryEdit