"use client";

import { Button } from "@/components/ui/button";
import FormCard from "./FormCard";
import styles from "./form-main.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormWithRelations } from "@/types";
import ClockLoader from "react-spinners/ClockLoader";
import { useToast } from "@/hooks/use-toast";

const FormMain = () => {
    const { toast } = useToast();
    const [forms, setForms] = useState<FormWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>(null);

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
            
            toast({
                title: 'El formulario se eliminó correctamente!',
                duration: 2000
            })
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
                <div className="flex justify-center items-center mt-10">
                    <ClockLoader
                        size={100}
                        color="#0DE6B4" />
                </div>
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
