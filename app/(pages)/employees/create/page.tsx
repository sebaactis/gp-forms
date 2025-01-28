import WelcomeBanner from '@/app/components/Globals/Welcome/WelcomeBanner'
import React from 'react'
import EmployeeCreate from '@/app/components/Employees/Create/EmployeeCreate'

const Page = () => {
    return (
        <div>
            <WelcomeBanner
                title="Creación de GPeer"
                bagde='RRHH'
                icon="user-plus"
            />

            <EmployeeCreate />
        </div>
    )
}

export default Page