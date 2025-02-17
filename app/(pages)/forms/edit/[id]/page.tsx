"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import FormEdit from '@/app/components/Forms/FormMain/FormEdit/FormEdit';
import { useEffect, useState } from 'react';
import { FormWithRelations } from '@/types';
import ClockLoader from 'react-spinners/ClockLoader';

const Edit = () => {

    const { id } = useParams();
    const [form, setForm] = useState<FormWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForm = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/forms/${id}`);
                if (!response.ok) {
                    throw new Error('Error al cargar el formulario');
                }

                const data = await response.json();
                setForm(data);

            } catch (error) {
                if (error instanceof Error) {
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
                title={`Editar formulario: ${form?.name}`}
                bagde="RRHH"
                icon="edit"
            />
            <FormEdit existingForm={form} />
        </div>
    )
}

export default Edit