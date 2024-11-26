import { Button } from "@/components/ui/button"

export const FormAddQuestion = ({ styles, setLabelQuestion, setTypeQuestion, addQuestion }) => {
    return (
        <div className={styles.createContainer}>
            <h3 className={styles.subTitle}>Agregar pregunta</h3>
            <input
                type="text"
                placeholder="Ingresa la pregunta aqui..."
                onChange={(e) => setLabelQuestion(e.target.value)}
                className={styles.inputCreate}
            />
            <div className={styles.createTypeContainer}>
                <h3 className={styles.createTypeLabel}>Tipo de pregunta:</h3>
                <select
                    onChange={(e) => setTypeQuestion(e.target.value)}
                    className={styles.selectType}
                >
                    <option value="text">Texto</option>
                    <option value="range">Rango (1-10)</option>
                    <option value="checkbox">Checkbox</option>
                </select>
                <Button className={styles.createBtn} onClick={addQuestion}> Agregar pregunta </Button>
            </div>
        </div>
    )
}

export default FormAddQuestion