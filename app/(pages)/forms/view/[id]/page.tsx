"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { LucideScanEye } from 'lucide-react';
import FormView from '@/app/components/Forms/FormMain/FormView/FormView';

const FormPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForm();
    }, [id]);

    if (isLoading) {
        return <p>Cargando formulario...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!form) {
        return <p>No se encontró el formulario</p>;
    }

    return (
        <div>
            <WelcomeBanner
                title={`Preguntas formulario: ${form.name}`}
                bagde="RRHH"
                icon={LucideScanEye}
            />

            {form.questions.map((question) => (
                <FormView
                    key={question.id}
                    question={question}
                />
            ))}
        </div>
    );
};

export default FormPage;