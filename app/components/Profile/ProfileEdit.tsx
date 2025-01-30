import styles from "./profileEdit.module.css"
import Link from "next/link";

interface Props {
    email: string | null | undefined;
    role: string | null | undefined;
    nombre: string | null | undefined;
    apellido: string | null | undefined;
    id: string | null | undefined;
}

const ProfileEdit = ({ email, role, nombre, apellido, id }: Props) => {

    return (
        <div className="flex flex-col justify-center items-center gap-2 pb-16">
            <h1 className={styles.profileTitle}>Información de usuario</h1>
            <div className={styles.profileInfo}>
                <p><span className={styles.profileInfoTitle}>Email: </span>{email}</p>
                <p><span className={styles.profileInfoTitle}>Nombre: </span>{nombre}</p>
                <p><span className={styles.profileInfoTitle}>Apellido: </span>{apellido}</p>
                <p><span className={styles.profileInfoTitle}>Rol: </span>{role}</p>
                <p className={styles.profileInfoNote}>* Los cambios se verán reflejados una vez que vuelvas a iniciar sesión</p>
            </div>
            <div className={styles.profileButtons}>
                <Link href={`/profile/edit/${id}`} className={styles.profileButton} >
                    Editar usuario
                </Link>
            </div>
        </div>
    )
}

export default ProfileEdit