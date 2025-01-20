import { CompletedFormWithRelations } from '@/types'
import { EyeIcon, PencilIcon, Trash2 } from "lucide-react"
import Link from 'next/link';
import DialogWrapper from '../Globals/Modal/DialogWrapper';
import { useToast } from '@/hooks/use-toast';
import { FaFilePdf } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

interface Props {
    evaluation: CompletedFormWithRelations;
    styles: Record<string, string>
    setEvaluations: React.Dispatch<React.SetStateAction<CompletedFormWithRelations[]>>;
}

const HistoryCard = ({ evaluation, styles, setEvaluations }: Props) => {

    const { toast } = useToast();

    const handleDelete = async (id) => {

        try {
            const response = await fetch(`/api/employees-forms/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error("Error al intentar eliminar")
            }

            toast({
                title: 'Evaluacion eliminada correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })

            setEvaluations(prevState => prevState.filter(evaluation => evaluation.id !== id));
        } catch {
            toast({
                title: 'Evaluacion eliminada correctamente!',
                className: 'bg-red-800',
                duration: 3000
            })
        }
    }

    return (
        <div className={styles?.evaluationCard}>
            <p><span className='font-bold'>Evaluado:</span> {evaluation.employee?.nombre} {evaluation.employee?.apellido}</p>
            <p><span className='font-bold'>Completado el:</span> {evaluation?.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'No completada'}</p>
            <p><span className='font-bold'>Formulario:</span> {evaluation.formTitle}</p>
            <div className={styles.btnContainer}>

                <div className='flex gap-2'>
                    <button className={styles.exportIcon}><FaFilePdf size={20} /></button>
                    <button className={styles.exportIcon}><PiMicrosoftExcelLogoFill size={23} /></button>
                </div>

                <div className='flex gap-2'>
                    <Link href={`/history/${evaluation.id}`}>
                        <button className={styles.viewIconBtn}>
                            <EyeIcon />
                        </button>
                    </Link>

                    <Link href={`/history/edit/${evaluation.id}`}>
                        <button className={styles.editIconBtn}><PencilIcon /></button>
                    </Link>

                    <DialogWrapper
                        triggerButton={<button className={styles.deleteIconBtn}><Trash2 /></button>}
                        title="Eliminar evaluacion"
                        description="Estás seguro de eliminar esta evaluacion?"
                        onConfirm={() => handleDelete(evaluation.id)}
                    >
                        {""}
                    </DialogWrapper>
                </div>
            </div>
        </div>
    )
}

export default HistoryCard