"use client"

import React, { useEffect, useState } from 'react'
import InputEmployee from '../InputEmployee'
import styles from './employeesCreate.module.css'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import PulseLoader from 'react-spinners/PulseLoader'

const EmployeeCreate = () => {

    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [bosses, setBosses] = useState([]);
    const [employee, setEmployee] = useState({
        nombre: "",
        apellido: "",
        email: "",
        gerencia: "",
        puesto: "",
        seniority: "",
        legajo: "",
        userId: ""
    })
    

    const fetchData = async () => {
        try {
            const response = await fetch("/api/users")

            if (!response.ok) {
                throw new Error("Error trayendo datos");
            }

            const data = await response.json();

            setBosses(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (field, value) => {
        setEmployee((prevState) => (prevState ? { ...prevState, [field]: value } : null));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/employees', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error("Error al crear empleado");
            }

            toast({
                title: "Empleado creado correctamente",
                duration: 2000,
                className: 'bg-green-800'
            })

            router.push("/employees")

        } catch (error) {
            console.log(error);
            toast({
                title: "Error al editar el empleado",
                duration: 2000,
                className: 'bg-red-800'
            })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData() }, [])

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <InputEmployee
                    label="Nro Legajo"
                    name="legajo"
                    value={employee?.legajo}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Correo"
                    name="email"
                    value={employee?.email}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Nombre"
                    name="nombre"
                    value={employee?.nombre}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Apellido"
                    name="apellido"
                    value={employee?.apellido}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Gerencia"
                    name="gerencia"
                    value={employee?.gerencia}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Puesto"
                    name="puesto"
                    value={employee?.puesto}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <InputEmployee
                    label="Seniority"
                    name="seniority"
                    value={employee?.seniority}
                    onChange={handleInputChange}
                    styles={styles}
                />
                <label className={styles.inputLabel}>Supervisor</label>
                <select
                    value={employee?.userId}
                    onChange={(e) => setEmployee(prevState => ({
                        ...prevState,
                        userId: e.target.value
                    }))}
                    className={styles.inputSelect}>
                    <option value="" disabled>Selecciona un supervisor</option>
                    {bosses.map(boss => (
                        <option key={boss.id} value={boss.id}> {boss.nombre} {boss.apellido}</option>
                    ))}
                </select>
            </div>

            <Button onClick={handleSubmit} className={styles.btnEnviar}>{loading ? <PulseLoader size={10} color="white" /> : "Crear"}</Button>
        </div>
    )
}

export default EmployeeCreate