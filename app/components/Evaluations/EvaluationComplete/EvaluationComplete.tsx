
const EvaluationComplete = ({ empleado }) => {


    return (
        <div>
            {empleado.form?.questions.map((question) => (
                <p key={question.id}>{question.label}</p>
            ))}
        </div>
    )
}

export default EvaluationComplete