import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner'
import React from 'react'
import { UserPlusIcon } from 'lucide-react'
import EmployeeCreate from '@/app/components/Employees/Create/EmployeeCreate'

const Page = () => {
    return (
        <div>
            <WelcomeBanner
                title="Creación de GPeer"
                bagde='RRHH'
                icon={UserPlusIcon}
            />

            <EmployeeCreate />
        </div>
    )
}

export default Page