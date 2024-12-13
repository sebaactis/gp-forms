"use client"
import { useState, useEffect } from 'react'
import ClockLoader from 'react-spinners/ClockLoader';
import HistoryCard from './HistoryCard';
import { CompletedFormWithRelations } from '@/types';
import styles from "./history.module.css"
import { FileSearchIcon } from 'lucide-react';

const HistoryMain = () => {

    const [evaluations, setEvaluations] = useState<CompletedFormWithRelations[]>([]);
    const [evaluationsFiltered, setEvaluationsFiltered] = useState<CompletedFormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState<string>("");

    const getEvaluations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/employees-forms?status=COMPLETADO')

            if (!response.ok) {
                throw new Error("Problemas al traer las evaluaciones")
            }

            const data = await response.json()
            setEvaluations(data);
            setEvaluationsFiltered(data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getEvaluations();
    }, [])

    useEffect(() => {
        const filtered = evaluations.filter((evaluation) => {
            const nombre = evaluation.employee?.nombre?.toLowerCase() || "";
            const apellido = evaluation.employee?.apellido?.toLowerCase() || "";
            const searchLower = search.toLowerCase();

            return nombre.includes(searchLower) || apellido.includes(searchLower);
        });

        setEvaluationsFiltered(filtered);
    }, [search, evaluations]);

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
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <FileSearchIcon />
                <label className={styles.label}>Buscar por nombre</label>
                <input
                    className={styles.input}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {evaluations.length <= 0
                ? <p className={styles.emptyEvaluations}>No tienes evaluaciones en el historial 😕</p>
                : <div className={styles.evaluationContainer}>
                    {evaluationsFiltered.map(evaluation => (
                        <HistoryCard key={evaluation.id} evaluation={evaluation} styles={styles} setEvaluations={setEvaluations} />
                    ))}
                </div>}

        </div>
    )
}

export default HistoryMain