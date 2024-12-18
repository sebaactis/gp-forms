"use client"
import { Button } from '@/components/ui/button';
import { Employee, User } from '@prisma/client'
import { useEffect, useState } from 'react'
import styles from './assignments.module.css'
import { ArrowBigRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PulseLoader from 'react-spinners/PulseLoader';

type dataState = {
    bosses: User[];
    employees: Employee[];
    selectedBoss: string | null;
    selectedEmployee: string | null;
}

const AssignmentsBoss = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<dataState>({
        bosses: [],
        employees: [],
        selectedBoss: null,
        selectedEmployee: null
    });

    const assignRelation = async () => {

        const { selectedBoss, selectedEmployee } = data;

        if (!selectedBoss || !selectedEmployee) {

            toast({
                title: 'Debes seleccionar un jefe y un empleado',
                className: 'bg-red-800',
                duration: 3000
            })

            return;
        }

        setLoading(true)

        try {
            const response = await fetch('/api/employees', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bossId: selectedBoss,
                    employeeId: selectedEmployee
                }),
            });

            if (!response.ok) {
                throw new Error("Error asignando el jefe al empleado");
            }

            toast({
                title: 'Jefe asignado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })
        } catch {
            toast({
                title: 'Error al asignar el jefe',
                className: 'bg-red-800',
                duration: 3000
            })
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bossesResponse, employeesResponse] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/employees')
                ]);

                if (!bossesResponse.ok || !employeesResponse.ok) {
                    toast({
                        title: 'Error al intentar traer los datos!',
                        className: 'bg-red-800',
                        duration: 3000
                    })
                }

                const bossesData = await bossesResponse.json();
                const employeesData = await employeesResponse.json();

                setData(prevState => ({
                    ...prevState,
                    bosses: bossesData,
                    employees: employeesData
                }));

            } catch {
                toast({
                    title: 'Error inesperado!',
                    className: 'bg-red-800',
                    duration: 3000
                })
            }
        };
        fetchData();
    }, [toast])

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>* Asignar supervisores</h2>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona un jefe</label>
                <ArrowBigRight size={30} />
                <select
                    value={data.selectedBoss || ""}
                    onChange={(e) => setData(prevState => ({
                        ...prevState,
                        selectedBoss: e.target.value
                    }))}
                    className={styles.selectItem}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Selecciona un jefe
                    </option>
                    {data.bosses.map((bosses) => (
                        <option key={bosses.id} value={bosses.id}> {bosses.nombre} {bosses.apellido}</option>
                    ))}
                </select>
            </article>

            <article className={styles.selectContainer}>
                <label className={styles.selectLabel}>Selecciona un empleado</label>
                <ArrowBigRight size={30} />
                <select
                    value={data.selectedEmployee || ""}
                    onChange={(e) => setData(prevState => ({
                        ...prevState,
                        selectedEmployee: e.target.value
                    }))}
                    className={styles.selectItem}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Selecciona un empleado
                    </option>
                    {data.employees.map((employee) => (
                        <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                    ))}
                </select>
            </article>

            <Button className={styles.sendBtn} onClick={assignRelation} disabled={!data.selectedBoss || !data.selectedEmployee}>{loading ? <PulseLoader size={10} color="white" /> : "Enviar"}</Button>
        </div>
    )
}

export default AssignmentsBoss