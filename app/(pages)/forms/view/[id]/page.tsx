"use client"

import { useParams } from 'next/navigation'
import forms from '@/data/forms.json'
import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { LucideScanEye } from 'lucide-react'
import FormView from '@/app/components/Forms/FormMain/FormView/FormView';

const FormPage = () => {

    const { id } = useParams();
    const form = forms.find(form => form.id === id);

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
                    question={question} />
            ))}
        </div>
    )
}

export default FormPage