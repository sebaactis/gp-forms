"use client";

import { Button } from "@/components/ui/button";
import FormCard from "./FormCard";
import styles from "./form-main.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

const FormMain = () => {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForms = async () => {
        try {
            const response = await fetch("/api/forms"); // Ruta relativa
            if (!response.ok) {
                throw new Error("Error al cargar los formularios");
            }
            const data = await response.json();
            setForms(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const deleteForm = async (id) => {
        try {
            const response = await fetch(`/api/forms/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Error al eliminar el formulario");
            }
            setForms(forms.filter((form) => form.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Link href="/forms/create">
                <Button className={styles.btnCreate}>Crear formulario</Button>
            </Link>

            {isLoading ? (
                <p>Cargando formularios...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className={styles.formMainContainer}>
                    {forms.map((form) => (
                        <FormCard
                            key={form.id}
                            id={form.id}
                            title={form.name}
                            questions={form.questions}
                            onDelete={deleteForm}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default FormMain;
