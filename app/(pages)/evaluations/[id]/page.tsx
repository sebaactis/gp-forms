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

    const { id } = useParams()

    useEffect(() => {
        const getEmpleado = async () => {
            setLoading(true)

            try {
                const response = await fetch(`/api/employees/${id}`)

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
    }, [id])

    if (loading) return <p>Cargando empleado...</p>

    return (
        <div>
            <WelcomeBanner
                title={`Evaluacion de ${empleado.nombre} ${empleado.apellido}`}
                bagde="Sebastian Actis"
                icon={CheckSquareIcon}
            />
            <EvaluationComplete empleado={empleado} />
        </div>
    )
}

export default Evaluation