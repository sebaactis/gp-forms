"use client"

import EvaluationComplete from '@/app/components/Evaluations/EvaluationComplete/EvaluationComplete'
import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner'
import { Employee } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckSquareIcon } from "lucide-react"
import ClockLoader from 'react-spinners/ClockLoader'

const Evaluation = () => {

    const [empleado, setEmpleado] = useState<Employee>({});
    const [loading, setLoading] = useState<boolean>(false);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClockLoader
                    size={100}
                    color="#0DE6B4" />
            </div>
        )
    }

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