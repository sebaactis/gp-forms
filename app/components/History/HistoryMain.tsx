"use client"
import { useState, useEffect } from 'react'
import ClockLoader from 'react-spinners/ClockLoader';
import HistoryCard from './HistoryCard';
import { CompletedFormWithRelations } from '@/types';
import styles from "./history.module.css"

const HistoryMain = () => {

    const [evaluations, setEvaluations] = useState<CompletedFormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getEvaluations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/employees-forms?status=COMPLETADO')

            if (!response.ok) {
                throw new Error("Problemas al traer las evaluaciones")
            }

            const data = await response.json()
            setEvaluations(data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        getEvaluations();
    }, [])

    console.log(evaluations);

    if (isLoading) {
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
            {evaluations.map(evaluation => (
                <HistoryCard key={evaluation.id} evaluation={evaluation} />
            ))}
        </div>
    )
}

export default HistoryMain