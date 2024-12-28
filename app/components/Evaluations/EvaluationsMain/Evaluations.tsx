"use client"

import { useEffect, useState } from "react"
import EvaluationCard from "./EvaluationCard";
import styles from './evaluations.module.css'
import { CompletedFormWithRelations } from "@/types";
import ClockLoader from "react-spinners/ClockLoader";
import { useToast } from "@/hooks/use-toast";

const Evaluations = () => {

    const { toast } = useToast();
    const [evaluations, setEvaluations] = useState<CompletedFormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getEvaluations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/employees-forms?status=not:COMPLETADO')

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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/employees-forms/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la evaluación");
            }

            setEvaluations(prevState => prevState.filter(e => e.id !== id))

            toast({
                title: 'Evaluación eliminada correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })

        } catch {
            toast({
                title: 'Error al intentar eliminar la evaluación!',
                className: 'bg-red-800',
                duration: 3000
            })
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

    if (evaluations.length <= 0) return <p className={styles.noEvaluations}>No tienes evaluaciones para completar actualmente 😉</p>

    return (
        <div className={styles.container}>
            {evaluations.map(evaluation => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} styles={styles} handleDelete={handleDelete} />
            ))}
        </div>
    )
}

export default Evaluations