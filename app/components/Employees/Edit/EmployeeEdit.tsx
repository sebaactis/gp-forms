import React, { useEffect, useState } from 'react'
import WelcomeBanner from '../../Globals/Welcome/WelcomeBanner'
import { UserPenIcon } from "lucide-react"
import { EmployeeWithRelations } from '@/types'
import InputEmployeeEdit from './InputEmployeeEdit'
import styles from "./employeeEdit.module.css"
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import ClockLoader from 'react-spinners/ClockLoader'

const EmployeeEdit = ({ id }) => {

    const { toast } = useToast();
    const router = useRouter();
    const [employee, setEmployee] = useState<EmployeeWithRelations>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getEmployee = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/employees/${id}`)

                if (!response.ok) {
                    throw new Error("Error al traer empleado")
                }

                const data = await response.json()
                setEmployee(data);
            } catch {
                console.log("Error")
            } finally {
                setIsLoading(false);
            }
        }
        getEmployee()
    }, [id])

    const handleInputChange = (field, value) => {
        setEmployee((prevState) => (prevState ? { ...prevState, [field]: value } : null));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar empleado");
            }

            toast({
                title: "Empleado editado correctamente",
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
        }
    };

    console.log(employee)

    return (
        <div>
            <WelcomeBanner
                title={isLoading ? "Cargando..." : `Empleado: ${employee?.nombre} ${employee?.apellido}`}
                bagde='RRHH'
                icon={UserPenIcon}
            />

            {isLoading ? < div className="flex justify-center items-center mt-48">
                <ClockLoader
                    size={100}
                    color="#0DE6B4" />
            </div> : <div className={styles.container}>
                <h3 className={styles.title}>Editar empleado</h3>
                <div className={styles.inputContainer}>
                    <InputEmployeeEdit
                        label="Nro Legajo"
                        name="legajo"
                        value={employee?.legajo}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Correo"
                        name="email"
                        value={employee?.email}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Nombre"
                        name="nombre"
                        value={employee?.nombre}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Apellido"
                        name="apellido"
                        value={employee?.apellido}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Gerencia"
                        name="gerencia"
                        value={employee?.gerencia}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Puesto"
                        name="puesto"
                        value={employee?.puesto}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                    <InputEmployeeEdit
                        label="Seniority"
                        name="seniority"
                        value={employee?.seniority}
                        onChange={handleInputChange}
                        styles={styles}
                    />
                </div>
                <Button onClick={handleSubmit} className={styles.btnEnviar}>Enviar</Button>
            </div>}


        </div >
    )
}

export default EmployeeEdit