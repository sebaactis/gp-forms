"use client"

import { Button } from '@/components/ui/button'
import { ArrowBigRight } from 'lucide-react'
import styles from './assignments.module.css'
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const AssignmentsForms = () => {
    const { toast } = useToast()

    const [formAssignData, setFormAssignData] = useState<dataState>({
        forms: [],
        employees: [],
        selectedForm: null,
        selectedEmployee: null
    });

    const fetchDataForm = async () => {
        try {
            const [formsResponse, employeesResponse] = await Promise.all([
                fetch('/api/forms'),
                fetch('/api/employees')
            ]);

            if (!formsResponse.ok || !employeesResponse.ok) {
                throw new Error("Error trayendo datos");
            }

            const formsData = await formsResponse.json();
            const employeesData = await employeesResponse.json();

            setFormAssignData(prevState => ({
                ...prevState,
                forms: formsData,
                employees: employeesData
            }));

        } catch (error) {
            console.error(error);
        }
    };

    const assignRelationForm = async () => {
        const { selectedForm, selectedEmployee } = formAssignData;

        if (!selectedForm || !selectedEmployee) {
            alert("Selecciona un jefe y un empleado");
            return;
        }

        try {
            const response = await fetch('/api/employees/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId: selectedForm,
                    employeeId: selectedEmployee
                }),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Error asignando el jefe al empleado");
            }

            toast({
                title: 'Formulario asignado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })
        } catch {
            toast({
                title: 'Error al asignar el formulario',
                className: 'bg-red-800',
                duration: 3000
            })
        }
    }


    useEffect(() => {
        fetchDataForm();
    }, [])

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>* Asignar formularios</h2>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona un empleado</label>
                <ArrowBigRight size={30} />
                <select
                    value={formAssignData.selectedEmployee || ""}
                    onChange={(e) => setFormAssignData(prevState => ({
                        ...prevState,
                        selectedEmployee: e.target.value
                    }))}
                    className={styles.selectItem}
                >
                    <option value="" disabled selected>
                        Selecciona un empleado
                    </option>
                    {formAssignData.employees.map((employee) => (
                        <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                    ))}


                </select>
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona un formulario</label>
                <ArrowBigRight size={30} />
                <select
                    value={formAssignData.selectedForm || ""}
                    onChange={(e) => setFormAssignData(prevState => ({
                        ...prevState,
                        selectedForm: e.target.value
                    }))}
                    className={styles.selectItem}
                >
                    <option value="" disabled selected>
                        Selecciona un formulario
                    </option>
                    {formAssignData.forms.map((form) => (
                        <option key={form.id} value={form.id}> {form.name}</option>
                    ))}
                </select>
            </article>

            <Button className={styles.sendBtn} onClick={assignRelationForm}>Enviar</Button>
        </div>)
}

export default AssignmentsForms