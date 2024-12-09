import { Button } from '@/components/ui/button'
import { CompletedFormWithRelations } from '@/types'
import React from 'react'

interface Props {
    evaluation: CompletedFormWithRelations
}

const HistoryCard = ({ evaluation }: Props) => {
    return (
        <div className={styles}>
            <p>{evaluation.employee?.nombre} {evaluation.employee?.apellido}</p>
            <p>Completado el: {new Date(evaluation.completedAt).toLocaleDateString()}</p>
            <p>Formulario: {evaluation.formTitle}</p>
            <div>
                <Button>VER</Button>
                <Button>EDITAR</Button>
            </div>
        </div>
    )
}

export default HistoryCard