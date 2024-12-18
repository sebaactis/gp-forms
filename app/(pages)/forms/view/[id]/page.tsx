"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { LucideScanEye } from 'lucide-react';
import FormView from '@/app/components/Forms/FormMain/FormView/FormView';
import { FormWithRelations } from '@/types';
import ClockLoader from 'react-spinners/ClockLoader';

const FormPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState<FormWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`/api/forms/${id}`);
                if (!response.ok) {
                    throw new Error('Error al cargar el formulario');
                }

                const data = await response.json();
                setForm(data);

            } catch (error) {
                if(error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Ocurrió un error desconocido");
                }
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchForm();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClockLoader
                    size={100}
                    color="#0DE6B4" />
            </div>
        )
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <WelcomeBanner
                title={`Preguntas formulario: ${form?.name}`}
                bagde="RRHH"
                icon={LucideScanEye}
            />

            {form?.questions?.map((question) => (
                <FormView
                    key={question.id}
                    question={question}
                />
            ))}
        </div>
    );
};

export default FormPage;