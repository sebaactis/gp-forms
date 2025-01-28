"use client"

import React from 'react'
import WelcomeBanner from '../../Globals/Welcome/WelcomeBanner'
import Evaluations from './Evaluations'
import { useSession } from 'next-auth/react';

const EvaluationsMain = () => {

    const { data: session } = useSession();

    return (
        <div>
            <WelcomeBanner
                title="Evaluaciones"
                bagde={session?.user?.email}
                icon="text-selection"
            />

            <Evaluations />
        </div>
    )
}

export default EvaluationsMain