import { useState, useEffect } from "react";
import styles from "./userEdit.module.css";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import PulseLoader from "react-spinners/PulseLoader";

const UserEdit = () => {
    const { toast } = useToast();
    const { data: session } = useSession();

    const [userInfo, setUserInfo] = useState({ nombre: "", apellido: "" });
    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
    });

    const [infoLoading, setInfoLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setUserInfo({
                nombre: session.user.nombre || "",
                apellido: session.user.apellido || "",
            });
        }
    }, [session]);

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordInfoChange = (e) => {
        const { name, value } = e.target;
        setPasswordInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserInfoSubmit = async (e) => {
        e.preventDefault();
        setInfoLoading(true);
        try {
            const response = await fetch("/api/users/update-info", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
            });

            const data = await response.json();
            if (response.ok) {
                toast({
                    title: 'Información actualizada con éxito',
                    className: 'bg-green-800',
                    duration: 3000
                })
            } else {
                toast({
                    title: `${data.error}`,
                    className: 'bg-red-800',
                    duration: 3000
                })
            }
        } catch (error) {
            toast({
                title: `${error}`,
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setInfoLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();
        if (passwordInfo.newPassword !== passwordInfo.repeatNewPassword) {
            toast({
                title: "Las contraseñas no coinciden",
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        setPasswordLoading(true);
        try {
            const response = await fetch("/api/users/change-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordInfo),
            });

            const data = await response.json();
            if (response.ok) {
                toast({
                    title: "Contraseña actualizada correctamente",
                    className: 'bg-green-800',
                    duration: 3000
                })
                setPasswordInfo({
                    currentPassword: "",
                    newPassword: "",
                    repeatNewPassword: "",
                });
            } else {
                toast({
                    title: `${data.error}`,
                    className: 'bg-red-800',
                    duration: 3000
                })
            }
        } catch (error) {
            toast({
                title: `${error}`,
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <section className={styles.userEditContainer}>
            <h1 className={styles.userEditMainTitle}>Editar usuario</h1>

            <div className={styles.userEditFormContainer}>
                <h2 className={styles.userEditTitle}>Editar información personal</h2>
                <form className={styles.userEditForm} onSubmit={handleUserInfoSubmit}>
                    <label className={styles.userEditLabel}>
                        Nombre
                        <input
                            className={styles.userEditInput}
                            type="text"
                            name="nombre"
                            value={userInfo.nombre}
                            onChange={handleUserInfoChange}
                        />
                    </label>

                    <label className={styles.userEditLabel}>
                        Apellido
                        <input
                            className={styles.userEditInput}
                            type="text"
                            name="apellido"
                            value={userInfo.apellido}
                            onChange={handleUserInfoChange}
                        />
                    </label>

                    <button className={styles.submitBtn} type="submit" disabled={infoLoading}>
                        {infoLoading ? <PulseLoader size={10} color="#ffff" /> : "Guardar cambios"}
                    </button>
                </form>
            </div>

            {/* Formulario de cambio de contraseña */}
            <div className={styles.userEditFormContainer}>
                <h2 className={styles.userEditTitle}>Cambiar contraseña</h2>
                <form className={styles.userEditForm} onSubmit={handlePasswordSubmit}>
                    <label className={styles.userEditLabel}>
                        Contraseña actual
                        <input
                            className={styles.userEditInput}
                            type="password"
                            name="currentPassword"
                            value={passwordInfo.currentPassword}
                            onChange={handlePasswordInfoChange}
                        />
                    </label>

                    <label className={styles.userEditLabel}>
                        Nueva contraseña
                        <input
                            className={styles.userEditInput}
                            type="password"
                            name="newPassword"
                            value={passwordInfo.newPassword}
                            onChange={handlePasswordInfoChange}
                        />
                    </label>

                    <label className={styles.userEditLabel}>
                        Repetir nueva contraseña
                        <input
                            className={styles.userEditInput}
                            type="password"
                            name="repeatNewPassword"
                            value={passwordInfo.repeatNewPassword}
                            onChange={handlePasswordInfoChange}
                        />
                    </label>

                    <button className={styles.submitBtn} type="submit" disabled={passwordLoading}>
                        {passwordLoading ? <PulseLoader size={10} color="#ffff" /> : "Cambiar contraseña"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UserEdit;
