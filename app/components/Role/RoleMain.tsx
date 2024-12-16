"use client"

import { useEffect, useState } from 'react';
import styles from './role.module.css'
import { User } from '@prisma/client';
import { Shield, User2Icon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PulseLoader from 'react-spinners/PulseLoader';
import { useRouter } from 'next/navigation';

const roles = [
    { name: "RRHH" },
    { name: "USER" }
]
const RoleMain = () => {

    const { toast } = useToast();
    const router = useRouter();
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [userRole, setUserRole] = useState({
        userId: "",
        role: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserRole((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {

        if (!userRole.userId || !userRole.role) {
            toast({
                title: 'Debes seleccionar un rol y un usuario!',
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userRole),
            });

            if (!response.ok) {
                throw new Error("Error al enviar la informacion")
            }

            toast({
                title: 'Rol asignado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })

            router.refresh();

        } catch {
            toast({
                title: 'Error al asignar el rol!',
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/users')

            if (!response.ok) {
                throw new Error("Error trayendo datos");
            }

            const data = await response.json()

            setEmployees(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData() }, []);

    return (
        <div className={styles.container}>
            <p className={styles.title}>* Asignar Rol</p>

            <div className={styles.selectContainer}>

                <section>
                    <div className={styles.selectTitleContainer}>
                        <User2Icon size={22} color='#00fff2' />
                        <p className={styles.selectTitle}>Usuarios</p>
                    </div>

                    <select
                        name="userId"
                        defaultValue=""
                        className={styles.select}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Seleccione un usuario</option>
                        {employees.map(employee => (
                            <option value={employee.id} key={employee.id}>{employee.nombre} {employee.apellido}</option>
                        ))}
                    </select>
                </section>

                <section>
                    <div className={styles.selectTitleContainer}>
                        <Shield size={22} color='#00fff2' />
                        <p className={styles.selectTitle}>Roles</p>
                    </div>

                    <select
                        name="role"
                        defaultValue=""
                        className={styles.select}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Seleccione un rol</option>
                        {roles.map(role => (
                            <option key={role.name} value={role.name}>{role.name}</option>
                        ))}
                    </select>
                </section>
            </div>

            <button onClick={handleSubmit} className={styles.btnEnviar}>{loading ? <PulseLoader size={10} color="white" /> : "Enviar"}</button>
        </div>
    )
}

export default RoleMain