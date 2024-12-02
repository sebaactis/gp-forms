import { ComponentType } from 'react';
import styles from './welcome.module.css'

interface Props {
    title: string;
    icon: ComponentType;
    bagde: string;
}

const WelcomeBanner = ({title, icon: Icon, bagde }: Props) => {
    return (
        <div className={styles.titleContainer}>
            <Icon className={styles.titleIcon} />
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.titleBagde}>{bagde}</p>
        </div>
    )
}

export default WelcomeBanner