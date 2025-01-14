import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CompletedFormWithRelations } from "@/types"
import Link from "next/link"
import DialogWrapper from "../../Globals/Modal/DialogWrapper"
import { Trash2 } from "lucide-react"

interface EvaluationsProps {
    evaluation: CompletedFormWithRelations
    styles: Record<string, string>
    handleDelete: (id: string) => void
}
const EvaluationCard = ({ evaluation, styles, handleDelete }: EvaluationsProps) => {



    return (
        <div className={styles.cardContainer}>
            <div className={styles.nameContainer}>
                <div className={styles.nameEmployeeContainer}>
                    <p className={styles.name}>{evaluation.employee?.nombre} {evaluation.employee?.apellido} - Legajo {evaluation.employee?.legajo}</p>
                </div>

            </div>
            <div className={styles.infoContainer}>
                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Formulario a completar:
                    </span>
                    {evaluation.form?.name}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Gerencia:
                    </span>
                    {evaluation.employee?.gerencia}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Puesto:
                    </span>
                    {evaluation.employee?.puesto}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Estado:
                    </span>
                    {cn(evaluation.status)}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Periodo:
                    </span>
                    {evaluation.period}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Fecha Limite
                    </span>
                    {new Date(evaluation.endDate).toLocaleDateString("es-ES")}
                </p>
            </div>
            <div className={styles.btnContainer}>
                <Link className={styles.btnCompleteLink} href={`evaluations/${evaluation.employee?.id}/form/${evaluation.id}`}>
                    <Button className={styles.btnComplete}>Completar</Button>
                </Link>
                <DialogWrapper
                    triggerButton={
                        <Button className={styles.btnDelete}><Trash2 /></Button>}
                    title="Eliminar evaluación"
                    description="Estás seguro de eliminar esta evaluación?"
                    onConfirm={() => handleDelete(evaluation.id)}

                >
                    {null}
                </DialogWrapper>
            </div>


        </div>
    )
}

export default EvaluationCard