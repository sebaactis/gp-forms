"use client"

import EvaluationComplete from '@/app/components/Evaluations/EvaluationComplete/EvaluationComplete'
import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner'
import { Employee } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckSquareIcon } from "lucide-react"

const Evaluation = () => {

    const [empleado, setEmpleado] = useState<Employee>({});
    const [loading, setLoading] = useState(false);

    const { employeeId, formId } = useParams()

    useEffect(() => {
        const getEmpleado = async () => {
            setLoading(true)

            try {
                const response = await fetch(`/api/employees/${employeeId}`)

                if (!response.ok) {
                    throw new Error("Problemas al traer el empelado")
                }

                const data = await response.json()
                setEmpleado(data);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false)
            }
        }

        getEmpleado()
    }, [employeeId])

    if (loading) return <p>Cargando empleado...</p>

    console.log(empleado)

    return (
        <div>
            <WelcomeBanner
                title={`Evaluacion de ${empleado.nombre} ${empleado.apellido}`}
                bagde="Sebastian Actis"
                icon={CheckSquareIcon}
            />
            <EvaluationComplete empleado={empleado} formId={formId} />
        </div>
    )
}

export default Evaluation