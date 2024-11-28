import React from 'react'
import WelcomeBanner from '../../Globals/Welcome/WelcomeBanner'
import { LucideTextSelection } from 'lucide-react'
import Evaluations from './Evaluations'

const EvaluationsMain = () => {
    return (
        <div>
            <WelcomeBanner
                title="Evaluaciones"
                bagde="Sebastian Actis"
                icon={LucideTextSelection}
            />

            <Evaluations />
        </div>
    )
}

export default EvaluationsMain