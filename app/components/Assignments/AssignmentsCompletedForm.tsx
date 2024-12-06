"use client"

import { ArrowBigRight } from 'lucide-react'
import styles from './assignments.module.css'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { EmployeeWithRelations } from '@/types'

const AssignmentsCompletedForm = () => {
    const { toast } = useToast()
    const [employees, setEmployees] = useState<EmployeeWithRelations>([]);

    const [completedData, setCompletedData] = useState({
        employeeId: "",
        period: "",
        endDate: ""
    })

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employees')

            if (!response.ok) {
                throw new Error("Error trayendo datos");
            }

            const data = await response.json()

            setEmployees(data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompletedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const createEvaluation = async () => {
        const { employeeId, period, endDate } = completedData;

        if (!employeeId || !period || !endDate) {
            alert("Algun dato esta sin completar");
            return;
        }

        try {
            const response = await fetch('/api/employees-forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId,
                    period,
                    endDate
                }),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Error creando la evaluacion");
            }

            toast({
                title: 'Evaluacion creada correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error al crear la evaluacion',
                className: 'bg-red-800',
                duration: 3000
            })
        }
    }

    useEffect(() => { fetchData() }, [])

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>* Crear evaluaciones</h2>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona un empleado</label>
                <ArrowBigRight size={30} />
                <select
                    name="employeeId"
                    value={completedData.employeeId}
                    onChange={handleChange}
                    className={styles.selectItem}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Selecciona un empleado
                    </option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                    ))}
                </select>
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Periodo de evaluación</label>
                <ArrowBigRight size={30} />
                <input
                    name="period"
                    value={completedData.period}
                    onChange={handleChange}
                    className={styles.periodInput}
                    type="text" />
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona una fecha limite</label>
                <ArrowBigRight size={30} />
                <input
                    name="endDate"
                    value={completedData.endDate}
                    onChange={handleChange}
                    className={styles.dateLimitInput}
                    type="date" />
            </article>

            <Button className={styles.sendBtn} onClick={createEvaluation}>Enviar</Button>
        </div>
    )
}

export default AssignmentsCompletedForm