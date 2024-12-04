"use client"
import { Button } from '@/components/ui/button';
import { Employee, User } from '@prisma/client'
import { useEffect, useState } from 'react'
import styles from './assignments.module.css'
import { ArrowBigRight } from 'lucide-react';

type dataState = {
    bosses: User[];
    employees: Employee[];
    selectedBoss: string;
    selectedEmployee: string;
}

const AssignmentsBoss = () => {

    const [data, setData] = useState<dataState>({
        bosses: [],
        employees: [],
        selectedBoss: null,
        selectedEmployee: null
    });

    const fetchData = async () => {
        try {
            const [bossesResponse, employeesResponse] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/employees')
            ]);

            if (!bossesResponse.ok || !employeesResponse.ok) {
                throw new Error("Error trayendo datos");
            }

            const bossesData = await bossesResponse.json();
            const employeesData = await employeesResponse.json();

            setData(prevState => ({
                ...prevState,
                bosses: bossesData,
                employees: employeesData
            }));

        } catch (error) {
            console.error(error);
        }
    };

    const assignRelation = async () => {
        const { selectedBoss, selectedEmployee } = data;

        if (!selectedBoss || !selectedEmployee) {
            alert("Selecciona un jefe y un empleado");
            return;
        }

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
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

            alert('Jefe asignado correctamente');
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al asignar el jefe');
        }
    }


    useEffect(() => {
        fetchData();
    }, [])

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
                >
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
                >
                    {data.employees.map((employee) => (
                        <option key={employee.id} value={employee.id}> {employee.nombre} {employee.apellido}</option>
                    ))}
                </select>
            </article>

            <Button className={styles.sendBtn} onClick={assignRelation}>Enviar</Button>
        </div>
    )
}

export default AssignmentsBoss