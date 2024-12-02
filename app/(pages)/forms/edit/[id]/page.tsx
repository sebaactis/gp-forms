"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import { EditIcon } from 'lucide-react'
import FormEdit from '@/app/components/Forms/FormMain/FormEdit/FormEdit';
import { useEffect, useState } from 'react';
import { FormWithRelations } from '@/types';

const Edit = () => {

    const { id } = useParams();
    const [form, setForm] = useState<FormWithRelations>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>(null);

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
                title={`Editar formulario: ${form?.name}`}
                bagde="RRHH"
                icon={EditIcon}
            />
            <FormEdit existingForm={form} />
        </div>
    )
}

export default Edit