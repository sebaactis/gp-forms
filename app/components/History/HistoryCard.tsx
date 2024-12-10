import { CompletedFormWithRelations } from '@/types'
import { EyeIcon, PencilIcon, Trash2 } from "lucide-react"

interface Props {
    evaluation: CompletedFormWithRelations;
    styles: Record<string, string>
}

const HistoryCard = ({ evaluation, styles }: Props) => {

    return (
        <div className={styles?.evaluationCard}>
            <p><span className='font-bold'>Evaluado:</span> {evaluation.employee?.nombre} {evaluation.employee?.apellido}</p>
            <p><span className='font-bold'>Completado el:</span> {new Date(evaluation.completedAt).toLocaleDateString()}</p>
            <p><span className='font-bold'>Formulario:</span> {evaluation.formTitle}</p>
            <div className={styles.btnContainer}>
                <button className={styles.iconBtn}><EyeIcon /></button>
                <button className={styles.iconBtn}><PencilIcon /></button>
                <button className={styles.iconBtn}><Trash2 /></button>
            </div>
        </div>
    )
}

export default HistoryCard