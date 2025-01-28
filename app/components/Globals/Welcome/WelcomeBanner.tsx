"use client"

import styles from './welcome.module.css'
import { ShieldQuestionIcon, ListCollapseIcon, UserCog2, FileSpreadsheetIcon, MenuSquare, LucideTextSelection, TimerResetIcon, UserPenIcon, UserPlusIcon, CheckSquareIcon, EditIcon, LucideScanEye, LucideEye, PenBoxIcon, BookPlus } from "lucide-react"

const iconMap = {
    "shield-question": ShieldQuestionIcon,
    "list-collapse": ListCollapseIcon,
    "user-cog2": UserCog2,
    "file-spread": FileSpreadsheetIcon,
    "menu-square": MenuSquare,
    "text-selection": LucideTextSelection,
    "timer-reset": TimerResetIcon,
    "user-pen-": UserPenIcon,
    "user-plus": UserPlusIcon,
    "check-square": CheckSquareIcon,
    "edit": EditIcon,
    "scan-eye": LucideScanEye,
    "eye": LucideEye,
    "pen-box": PenBoxIcon,
    "book-plus": BookPlus
}

interface Props {
    title: string;
    bagde: string | null | undefined;
    icon: string;
}

const WelcomeBanner = ({ title, icon, bagde }: Props) => {

    const IconComponent = iconMap[icon];

    return (
        <div className={styles.titleContainer}>
            {IconComponent ? <IconComponent className={styles.titleIcon} /> : null}
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.titleBagde}>{bagde}</p>

        </div>
    )
}

export default WelcomeBanner