"use client"

import { ArrowBigRight } from 'lucide-react'
import styles from './assignments.module.css'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { EmployeeWithRelations } from '@/types'
import PulseLoader from 'react-spinners/PulseLoader';

interface Props {
    employees: EmployeeWithRelations[];
    fetchLoading: boolean;
}

const AssignmentsCompletedForm = ({ employees, fetchLoading }: Props) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);

    const [completedData, setCompletedData] = useState({
        employeeId: "",
        period: "",
        endDate: ""
    })

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
            toast({
                title: 'El empleado, el periodo o la fecha de finalizacion estan vacios',
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        setLoading(true)

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
        } catch {
            toast({
                title: 'Error al crear la evaluacion',
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setLoading(false)
        }
    }

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
                    {fetchLoading ? (<option>Cargando opciones...</option>)
                        : (
                            <>
                                <option value="" disabled>
                                    Selecciona un empleado
                                </option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                                ))}
                            </>
                        )
                    }
                </select>

                {completedData.employeeId && !employees.find(employee => employee.id === completedData.employeeId)?.formId
                    &&
                    <p className={styles.formNotAssigned}>
                        El empleado no tiene asignado ningun formulario. Debes asignar uno para poder crear una evaluación
                    </p>}
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Periodo de evaluación</label>
                <ArrowBigRight size={30} />
                <input
                    name="period"
                    value={completedData.period}
                    onChange={handleChange}
                    className={styles.periodInput}
                    type="text"
                    disabled={completedData.employeeId && !employees.find(employee => employee.id === completedData.employeeId)?.formId ? true : false}
                />
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona una fecha limite</label>
                <ArrowBigRight size={30} />
                <input
                    name="endDate"
                    value={completedData.endDate}
                    onChange={handleChange}
                    className={styles.dateLimitInput}
                    type="date"
                    disabled={completedData.employeeId && !employees.find(employee => employee.id === completedData.employeeId)?.formId ? true : false}
                />
            </article>

            <Button className={styles.sendBtn} onClick={createEvaluation} disabled={!completedData.employeeId || !completedData.endDate || !completedData.period}>{loading ? <PulseLoader size={10} color="white" /> : "Enviar"} </Button>
        </div>
    )
}

export default AssignmentsCompletedForm