import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import styles from './dialog-wrapper.module.css'
import { useState } from "react";

const DialogWrapper = ({ triggerButton, title, description, onConfirm, children }) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={styles.title}>{title}</DialogTitle>
                </DialogHeader>
                <p className={styles.description}>{description}</p>
                {children}
                <div className={styles.btnContainer}>
                    <button className={styles.confirmBtn} onClick={onConfirm}>
                        Confirmar
                    </button>
                    <button onClick={() => setOpen(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogWrapper;