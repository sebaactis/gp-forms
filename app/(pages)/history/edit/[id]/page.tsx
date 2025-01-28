"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import HistoryEdit from '@/app/components/History/Edit/HistoryEdit';
import { CompletedFormWithRelations } from '@/types';
import { useSession } from 'next-auth/react';

const Page = () => {

    const { data: session } = useSession();

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
                bagde={session?.user?.email}
                icon="pen-box"
            />

            <HistoryEdit evaluation={evaluation} setEvaluation={setEvaluation} />
        </div>
    )
}

export default Page