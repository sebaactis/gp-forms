import { useSession } from 'next-auth/react'
import styles from './Profile.module.css'
import Link from 'next/link';

const Profile = () => {

    const { data: session } = useSession();

    return (
        <section className={styles.profileContainer}>
            <div className={styles.profileAvatar}>
                {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
            <Link href="/profile" className={styles.profileConfig}>Configuracion de usuario</Link>
        </section>
    )
}

export default Profile