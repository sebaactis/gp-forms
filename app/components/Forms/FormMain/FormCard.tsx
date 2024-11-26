import { Button } from '@/components/ui/button'
import styles from "./form-main.module.css"
import { Trash2, Eye, Pencil } from "lucide-react"
import Link from 'next/link';

const FormCard = ({ id, title, questions }) => {

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
                <Button className={styles.cardEditBtn}>
                    <Pencil style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
                </Button>
                <Button className={styles.cardDeleteBtn}>
                    <Trash2 style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
                </Button>
            </div>
        </div>
    )
}

export default FormCard