import React from 'react'
import WelcomeBanner from '../../Globals/Welcome/WelcomeBanner'
import Evaluations from './Evaluations'

const EvaluationsMain = () => {
    return (
        <div>
            <WelcomeBanner
                title="Evaluaciones"
                bagde="Testing User"
                icon="text-selection"
            />

            <Evaluations />
        </div>
    )
}

export default EvaluationsMain