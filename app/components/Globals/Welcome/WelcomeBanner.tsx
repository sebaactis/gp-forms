import styles from './welcome.module.css'

const WelcomeBanner = ({title, icon: Icon, bagde }) => {
    return (
        <div className={styles.titleContainer}>
            <Icon className={styles.titleIcon} />
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.titleBagde}>{bagde}</p>
        </div>
    )
}

export default WelcomeBanner