import { Button } from '@/components/ui/button'
import styles from "./form-main.module.css"
import { Trash2, Eye, Pencil } from "lucide-react"
import Link from 'next/link';
import DialogWrapper from '../../Globals/Modal/DialogWrapper';

const FormCard = ({ id, title, questions, onDelete }) => {

    const quantity = questions.length;

    return (
        <div className={styles.card}>
            <p className={styles.cardTitle}>{title}</p>
            <p className={styles.cardSubTitle}>Cantidad de preguntas: <span className={styles.cardQuantity}>{quantity}</span></p>
            <div className={styles.cardBtnContainer}>

                <Link href={`/forms/view/${id}`}>
                    <Button className={styles.cardViewBtn}>
                        <Eye style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
                    </Button>
                </Link>

                <Link href={`/forms/edit/${id}`}>
                    <Button className={styles.cardEditBtn}>
                        <Pencil style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
                    </Button>
                </Link>

                <DialogWrapper
                    triggerButton={<Button className={styles.cardDeleteBtn}>
                        <Trash2 style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
                    </Button>}
                    title="Eliminar formulario"
                    description="Estás seguro de eliminar este formulario?"
                    onConfirm={() => onDelete(id)}
                >

                </DialogWrapper>

            </div>
        </div>
    )
}

export default FormCard