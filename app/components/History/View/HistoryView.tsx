import { CompletedFormWithRelations, questionTypes } from '@/types';
import styles from './historyView.module.css'
import { BadgeInfo, FileQuestion } from "lucide-react"
import { Separator } from '@/components/ui/separator';

interface Props {
    evaluation: CompletedFormWithRelations | undefined
}

const HistoryView = ({ evaluation }: Props) => {

    return (
        <div className={styles.evaluationContainer}>

            <div className={styles.infoContainer}>
                <BadgeInfo size={25} color='#ff00e1' />
                <h3>
                    <span className={styles.titleInfo}>Evaluacion de: </span>
                    {evaluation?.employee?.nombre} {evaluation?.employee?.apellido}</h3>
                <p><span className={styles.titleInfo}>Completada el dia:</span>  {evaluation?.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'No completada'}</p>
                <p><span className={styles.titleInfo}>Formulario:</span>  {evaluation?.formTitle}</p>
                <p><span className={styles.titleInfo}>Cantidad de preguntas respondidas:</span>  {evaluation?.responses.length}</p>
            </div>

            <Separator />

            <div className={styles.responsesContainer}>
                <h3 className={styles.responsesTitle}>Preguntas respondidas</h3>
                {evaluation?.responses.map((response) => (
                    <div className={styles.responsesInfo} key={response.id}>
                        <FileQuestion size={25} color='#00cea8' />
                        <p>
                            <span className={styles.titleResponse}>Tipo de item:
                            </span>
                            {questionTypes[response.questionType]}
                        </p>
                        <p className='flex flex-col'>
                            <span className={styles.titleResponse}>
                                Pregunta o consigna:
                            </span>
                            <textarea
                                value={response.questionText}
                                disabled
                                rows={response.questionText.split("\n").length || 1}
                                className={`bg-transparent ${response.questionType === "description" && "ml-4"}`}
                            />
                        </p>
                        {response.questionType !== "description"
                            && <p>
                                <span className={styles.titleResponse}>
                                    Respuesta:
                                </span> {response.answer}
                            </p>}
                    </div>
                ))}
            </div>



        </div>
    )
}

export default HistoryView