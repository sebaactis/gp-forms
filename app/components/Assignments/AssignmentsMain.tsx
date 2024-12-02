import React from 'react'
import WelcomeBanner from '../Globals/Welcome/WelcomeBanner'
import { ListCollapseIcon } from 'lucide-react'
import AssignmentsBoss from './AssignmentsBoss'
import { Separator } from '@/components/ui/separator'


const AssignmentsMain = () => {
    return (
        <div>

            <WelcomeBanner
                title='Asignaciones'
                bagde='RRHH'
                icon={ListCollapseIcon}
            />

            <AssignmentsBoss />

            <Separator />
            
            <div>
                <h2>Asignar formularios</h2>
            </div>

        </div>
    )
}

export default AssignmentsMain