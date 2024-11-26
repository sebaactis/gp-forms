import styles from './card.module.css'

export const Card = ({ title, quantity }: { title: string, quantity: string }) => {
    return (
        <div className={styles.card}>
            <p className={styles.cardTitle}>{title}</p>
            <p className={styles.cardQuantity}>{quantity}</p>
        </div>
    )
}