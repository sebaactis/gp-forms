import { Button } from "@/components/ui/button"

interface Props {
    styles: Record<string, string>;
    setLabelQuestion: React.Dispatch<React.SetStateAction<string>>;
    setTypeQuestion: React.Dispatch<React.SetStateAction<string>>;
    addQuestion: () => void;
    typeQuestion: string;
    labelQuestion: string;
}

export const FormAddQuestion = ({ styles, setLabelQuestion, setTypeQuestion, addQuestion, typeQuestion, labelQuestion }: Props) => {

    return (
        <div className={styles.createContainer}>
            <h3 className={styles.subTitle}>Agregar pregunta o descripción</h3>
            <textarea
                placeholder="Ingresa la pregunta o descripción aqui..."
                onChange={(e) => setLabelQuestion(e.target.value)}
                className={styles.textAreaCreate}
                value={labelQuestion}
            />
            <div className={styles.createTypeContainer}>
                <h3 className={styles.createTypeLabel}>Tipo de item:</h3>
                <select
                    onChange={(e) => setTypeQuestion(e.target.value)}
                    className={styles.selectType}
                    value={typeQuestion}
                >
                    <option value="text">Texto</option>
                    <option value="radio">Rango</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="description">Descripcion</option>
                </select>
                <Button className={styles.createBtn} onClick={addQuestion}> Agregar pregunta </Button>
            </div>
        </div>
    )
}

export default FormAddQuestion