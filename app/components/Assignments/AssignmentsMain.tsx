import React from 'react'
import WelcomeBanner from '../Globals/Welcome/WelcomeBanner'
import { ListCollapseIcon } from 'lucide-react'
import AssignmentsBoss from './AssignmentsBoss'
import { Separator } from '@/components/ui/separator'
import AssignmentsForms from './AssignmentsForms'


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
            <AssignmentsForms />

        </div>
    )
}

export default AssignmentsMain