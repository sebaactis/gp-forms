"use client"

import { useEffect, useState } from "react"
import EvaluationCard from "./EvaluationCard";
import styles from './evaluations.module.css'
import { CompletedFormWithRelations } from "@/types";
import ClockLoader from "react-spinners/ClockLoader";

const Evaluations = () => {

    const [evaluations, setEvaluations] = useState<CompletedFormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getEvaluations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/employees-forms')

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


    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <ClockLoader
                    size={100}
                    color="#0DE6B4" />
            </div>
        )
    }

    if(evaluations.length <= 0) return <p>No tienes evaluaciones para completar actualmente</p>

    return (
        <div className={styles.container}>
            {evaluations.map(evaluation => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} styles={styles} />
            ))}
        </div>
    )
}

export default Evaluations