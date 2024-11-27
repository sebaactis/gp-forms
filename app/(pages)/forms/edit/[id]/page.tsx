"use client"

import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner';
import { useParams } from 'next/navigation'
import { EditIcon } from 'lucide-react'
import forms from '@/data/forms.json'
import FormEdit from '@/app/components/Forms/FormMain/FormEdit/FormEdit';

const Edit = () => {

    const params = useParams();
    const form = forms.find(form => form.id === params.id);

    return (
        <div>
            <WelcomeBanner
                title={`Editar formulario: ${form?.name}`}
                bagde="RRHH"
                icon={EditIcon}
            />
            <FormEdit existingForm={form}/>
        </div>
    )
}

export default Edit