import { Button } from "@/components/ui/button"
import React from "react"
import { ArrowRightSquareIcon, Trash2 } from "lucide-react"
import { FormQuestionType } from "@/hooks/useQuestions"
import { Option } from "@prisma/client";
import { questionTypes } from "@/types";

interface Props {
    question: FormQuestionType;
    styles: Record<string, string>;
    setOptionLabel: React.Dispatch<React.SetStateAction<string>>;
    updateQuestionOptions: (id: number, optionValue?: string | null, type?: string) => void;
    removeQuestion: (questionId: number) => void;
    removeQuestionOptions: (questionId: number, optionId: number) => void;
    optionLabel: string;
    handleRadioQuantityChange: (questionId: number, value: string) => void;
    updateQuestionLabel: (id: number, newLabel: string) => void;
    radioQuantities: { [key: number]: number };
}


export const FormQuestion = ({ question, styles, setOptionLabel, updateQuestionOptions, removeQuestionOptions, removeQuestion, optionLabel, handleRadioQuantityChange, updateQuestionLabel, radioQuantities }: Props) => {
    return (
        <React.Fragment key={question.id}>
            <div className={styles.questionContainer}>
                <p className={styles.questionType}>
                    <span className={styles.questionTypeId}><ArrowRightSquareIcon size={25} /></span>
                    Tipo de item:
                    <span className={styles.questionTypeSpan}>
                        {questionTypes[question.type]}
                    </span>
                </p>

                <div>
                    <p className={styles.questionLabelConsign}>
                        Consigna:
                    </p>
                    <textarea value={question.label}
                        className={styles.questionLabel}
                        onChange={(e) => updateQuestionLabel(question.id, e.target.value)}
                        rows={question.label.split("\n").length || 1}
                    >
                    </textarea>
                </div>

                {question.type === "description" &&
                    <div className={styles.descriptionContainer}>

                    </div>
                }

                {question.type === "checkbox" &&
                    <div className={styles.checkboxContainer}>
                        <div>
                            <input className={styles.inputCheckbox} type="text" placeholder="Opción" onChange={(e) => setOptionLabel(e.target.value)} />
                            <Button className={styles.addOptionBtn} onClick={() => updateQuestionOptions(question.id, optionLabel, question.type)}>
                                Agregar opcion
                            </Button>
                        </div>
                        <ul className={styles.checkboxItem}>
                            {question.options && question.options.map((option: Option) => (
                                <li key={option.id}>
                                    <label className={styles.labelContainer}>
                                        <input className={styles.checkboxLabelItem} type="checkbox" value={option.label} disabled />
                                        {option.label}
                                        <button className={styles.checkBoxItemDeleteBtn} onClick={() => removeQuestionOptions(question.id, option.id)}><Trash2 style={{ width: "1.1rem", height: "1.1rem" }} /></button>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>}

                {question.type === "radio" &&
                    <div className={styles.radioContainer}>
                        <>
                            <label>
                                Cantidad de opciones
                                <input className={styles.radioInput} value={radioQuantities[question.id] || ""} type="text" onChange={(e) => handleRadioQuantityChange(question.id, e.target.value)} />
                            </label>
                            <Button className={styles.addOptionBtn} onClick={() => updateQuestionOptions(question.id, null, question.type)}>
                                Confirmar
                            </Button>
                        </>
                        <ul className={styles.radioItem}>
                            {question.options.map((option) => (
                                <li key={option.id}>
                                    <label>
                                        <input
                                            className={styles.radioLabelItem}
                                            type="radio"
                                            value={option.label}
                                            name={`question-${question.id}`}
                                            disabled
                                        />
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>

                    </div>}
                <Button
                    className={styles.questionDeleteBtn}
                    onClick={() => removeQuestion(question.id)}
                >
                    <Trash2 />
                </Button>
            </div>
        </React.Fragment>
    )
}


