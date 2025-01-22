"use client"

import { Button } from '@/components/ui/button'
import { ArrowBigRight } from 'lucide-react'
import styles from './assignments.module.css'
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PulseLoader from 'react-spinners/PulseLoader';
import { Employee } from '@prisma/client';
import { EmployeeWithRelations, FormWithRelations } from '@/types';

interface formDataState {
    forms: FormWithRelations[];
    employees: Employee[];
    selectedForm: string | null;
    selectedEmployee: string | null;
}

interface Props {
    employees: EmployeeWithRelations[];
    fetchLoading: boolean;
    setFetchLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchData: () => void;
}

const AssignmentsForms = ({ employees, fetchLoading, setFetchLoading, fetchData }: Props) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);

    const [formAssignData, setFormAssignData] = useState<formDataState>({
        forms: [],
        employees: employees,
        selectedForm: null,
        selectedEmployee: null,
    });

    const assignRelationForm = async () => {

        const { selectedForm, selectedEmployee } = formAssignData;

        if (!selectedForm || !selectedEmployee) {
            toast({
                title: 'El formulario o el empleado estan vacios',
                className: 'bg-red-800',
                duration: 3000
            })
            return;
        }

        setLoading(true)

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

            fetchData();

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
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const fetchDataForm = async () => {
            setFetchLoading(true);
            try {
                const formsResponse = await fetch('/api/forms');

                if (!formsResponse.ok) {
                    throw new Error("Error trayendo datos");
                }

                const formsData = await formsResponse.json();

                setFormAssignData(prevState => ({
                    ...prevState,
                    forms: formsData,
                }));

            } catch {
                toast({
                    title: 'Error trayendo los datos correspondientes',
                    className: 'bg-red-800',
                    duration: 3000
                })
            } finally {
                setFetchLoading(false)
            }
        };
        fetchDataForm();
    }, [toast, setFetchLoading])

    useEffect(() => {
        setFormAssignData((prevState) => ({
            ...prevState,
            employees,
        }));
    }, [employees]);

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
                    defaultValue=""
                >
                    {fetchLoading ? (
                        <option> Cargando opciones... </option>
                    ) : (
                        <>
                            <option value="" disabled>
                                Selecciona un empleado
                            </option>
                            {formAssignData.employees.map((employee) => (
                                <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                            ))}
                        </>
                    )}
                </select>

                {formAssignData.selectedEmployee && (
                    (() => {
                        const formWithEmployee = formAssignData.forms.find(form =>
                            form.employees?.some(employee => employee.id === formAssignData.selectedEmployee)
                        );

                        return formWithEmployee ? (
                            <p className={styles.formAssigned}>
                                El empleado tiene asignado actualmente el formulario: <span className={styles.formAssignedName}>{formWithEmployee.name}</span>
                            </p>
                        ) : (
                            <p className={styles.formAssigned}>El empleado no tiene asignado ningún formulario.</p>
                        );
                    })()
                )}

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
                    defaultValue=""
                >
                    {fetchLoading ? (<option> Cargando opciones... </option>)
                        : (
                            <>
                                <option value="" disabled selected>
                                    Selecciona un formulario
                                </option>
                                {formAssignData.forms.map((form) => (
                                    <option key={form.id} value={form.id}> {form.name}</option>
                                ))}
                            </>
                        )}
                </select>
            </article>

            <Button className={styles.sendBtn} onClick={assignRelationForm} disabled={!formAssignData.selectedForm || !formAssignData.selectedEmployee}>{loading ? <PulseLoader size={10} color="white" /> : "Enviar"} </Button>
        </div>)
}

export default AssignmentsForms