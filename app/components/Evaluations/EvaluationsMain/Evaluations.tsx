"use client"

import { useEffect, useState } from "react"
import EvaluationCard from "./EvaluationCard";
import styles from './evaluations.module.css'
import { CompletedFormWithRelations } from "@/types";

const Evaluations = () => {

    const [evaluations, setEvaluations] = useState<CompletedFormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    console.log(evaluations)

    if (isLoading) return <p>Cargando...</p>

    return (
        <div className={styles.container}>
            {evaluations.map(evaluation => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} styles={styles} />
            ))}
        </div>
    )
}

export default Evaluations