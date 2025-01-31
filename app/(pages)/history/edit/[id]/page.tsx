"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import HistoryEdit from '@/app/components/History/Edit/HistoryEdit';
import { CompletedFormWithRelations } from '@/types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import ClockLoader from 'react-spinners/ClockLoader';

const Page = () => {

    const { data: session } = useSession();
    const { toast } = useToast();

    const { id } = useParams();
    const [evaluation, setEvaluation] = useState<CompletedFormWithRelations | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getEvaluation = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/employees-forms/${id}`)

                if (!response.ok) {
                    throw new Error("Error al traer la evaluacion")
                }

                const data = await response.json();
                setEvaluation(data);
            } catch {
                toast({
                    title: 'Error al traer la evaluación',
                    className: 'bg-red-800',
                    duration: 3000
                })
            } finally {
                setLoading(false);
            }
        }
        getEvaluation();
    }, [id, toast])

    return (
        <div>
            <WelcomeBanner
                title='Editar evaluación'
                bagde={session?.user?.email}
                icon="pen-box"
            />

            {loading ?
                <div className="flex justify-center items-center h-full pt-10">
                    <ClockLoader
                        size={100}
                        color="#0DE6B4" />
                </div>
                :
                <HistoryEdit evaluation={evaluation} setEvaluation={setEvaluation} />}
        </div>
    )
}

export default Page