"use client"

import EmployeeEdit from '@/app/components/Employees/Edit/EmployeeEdit';
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
    const { id } = useParams();

    return (
        <div>
            <EmployeeEdit id={id} />
        </div>
    )
}

export default Page