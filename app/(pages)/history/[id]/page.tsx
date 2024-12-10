"use client"

import { CompletedFormWithRelations } from '@/types';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import ClockLoader from 'react-spinners/ClockLoader';

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

    console.log(evaluation);

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
        <div></div>
    )
}

export default Page