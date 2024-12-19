import styles from './form-view.module.css'
import { ArrowRightSquareIcon } from "lucide-react"
import { QuestionsWithRelations } from '@/types'

interface Props {
    question: QuestionsWithRelations
}

const FormView = ({ question }: Props) => {

    return (
        <div className={styles.questionContainer} key={question.id}>
            <div>
                <p className={styles.questionType}>
                    <span className={styles.questionTypeId}><ArrowRightSquareIcon size={25}/></span>
                    Tipo:
                    <span className={styles.questionTypeSpan}>
                        {question.type}
                    </span>
                </p>
                <p className={styles.questionLabel}>{question.label}</p>

                {question.type === "checkbox" && (
                    <ul className={styles.checkboxContainer}>
                        {question.options.map((option) => (
                            <li key={option.id}>
                                <label >
                                    <input className={styles.checkboxItemLabel} type="checkbox" disabled />
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
                                <label>
                                    <input className={styles.radioInput} type="radio" disabled />
                                    {option.label}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default FormView