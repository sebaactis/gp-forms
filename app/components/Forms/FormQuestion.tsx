import { Button } from "@/components/ui/button"
import React from "react"

export const FormQuestion = ({ question, styles, setOptionLabel, updateQuestionOptions, removeQuestionOptions, removeQuestion, optionLabel }) => {
    return (
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
    )
}


