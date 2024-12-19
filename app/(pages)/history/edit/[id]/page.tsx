"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { PenBoxIcon } from "lucide-react"
import HistoryEdit from '@/app/components/History/Edit/HistoryEdit';
import { CompletedFormWithRelations } from '@/types';

const Page = () => {

    const { id } = useParams();
    const [evaluation, setEvaluation] = useState<CompletedFormWithRelations | null>(null);

    useEffect(() => {
        const getEvaluation = async () => {
            try {
                const response = await fetch(`/api/employees-forms/${id}`)

                if (!response.ok) {
                    throw new Error("Error al traer la evaluacion")
                }

                const data = await response.json();
                setEvaluation(data);
            } catch {
                console.log("ERROR")
            }
        }
        getEvaluation();
    }, [id])

    return (
        <div>
            <WelcomeBanner
                title='Editar evaluación'
                bagde='Supervisor X'
                icon={PenBoxIcon}
            />

            <HistoryEdit evaluation={evaluation} setEvaluation={setEvaluation} />
        </div>
    )
}

export default Page