import { Button } from "@/components/ui/button"
import FormCard from "./FormCard"
import styles from "./form-main.module.css"
import Link from "next/link"
import forms from '@/data/forms.json'

const FormMain = () => {

    return (
        <>
            <Link href="/forms/create">
                <Button className={styles.btnCreate}>Crear formulario</Button>
            </Link>
            <div className={styles.formMainContainer}>
                {forms.map((form) => (
                    <FormCard key={form.id} id={form.id} title={form.name} questions={form.questions} />
                ))}
            </div>
        </>
    )
}

export default FormMain