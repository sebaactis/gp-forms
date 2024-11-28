import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CompletedFormWithRelations } from "@/types"

interface EvaluationsProps {
    evaluation: CompletedFormWithRelations
    styles: Record<string, string>
}
const EvaluationCard = ({ evaluation, styles }: EvaluationsProps) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.nameContainer}>
                <p className={styles.name}>{evaluation.employee.nombre} {evaluation.employee.apellido} -</p>

                <p className={styles.legacy}>Legajo {evaluation.employee?.legajo}</p>
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
                    {evaluation.employee.gerencia}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Puesto:
                    </span>
                    {evaluation.employee.puesto}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Estado:
                    </span>
                    {cn(evaluation.status)}
                </p>

                <p className={styles.formName}>
                    <span className={styles.formNameTitle}>
                        Fecha Limite
                    </span>
                    {new Date(evaluation.endDate).toLocaleDateString("es-ES")}
                </p>
            </div>

            <Button className={styles.btnComplete}>Completar</Button>
        </div>
    )
}

export default EvaluationCard