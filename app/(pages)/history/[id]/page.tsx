"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import HistoryView from '@/app/components/History/View/HistoryView';
import { CompletedFormWithRelations } from '@/types';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import ClockLoader from 'react-spinners/ClockLoader';
import { LucideEye } from 'lucide-react';

const Page = () => {
    const { id } = useParams();

    const [evaluation, setEvaluation] = useState<CompletedFormWithRelations>();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getEvaluation = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/employees-forms/${id}`)

                if (!response.ok) {
                    throw new Error("Error al traer la evaluacion")
                }

                const data = await response.json();
                setEvaluation(data);
            } catch {
                console.log("ERROR")
            } finally {
                setLoading(false);
            }
        }
        getEvaluation();
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <ClockLoader
                    size={100}
                    color="#0DE6B4" />
            </div>
        )
    }

    return (
        <div>
            <WelcomeBanner
                title="Ver evaluacion"
                bagde='Supervisor X'
                icon={LucideEye}
            />
            <HistoryView evaluation={evaluation} />
        </div>
    )
}

export default Page