"use client"

import { UserPen, BookOpenText, UsersRoundIcon, History, LockKeyholeIcon } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"

import Image from "next/image"
import logo from "@/public/gp-logo.png"
import styles from "./AppSidebar.module.css"
import { ModeToggle } from "@/components/theme/theme-toggle"
import SideBarItem from "./SideBarItem"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const itemsRRHH = [
    {
        title: "GPeers",
        url: "/employees",
        icon: UserPen,
    },
    {
        title: "Asignaciones",
        url: "/assignments",
        icon: UsersRoundIcon,
    },
    {
        title: "Formularios",
        url: "/forms",
        icon: BookOpenText,
    },
    {
        title: "Roles",
        url: "/roles",
        icon: LockKeyholeIcon
    }
]

const items = [
    {
        title: "Evaluaciones",
        url: "/evaluations",
        icon: BookOpenText,
    },
    {
        title: "Historiales",
        url: "/history",
        icon: History,
    },
]

export function AppSidebar() {

    return (
        <Sidebar >
            <SidebarHeader className={styles.sidebar}>
                <Link href="/home" className={styles.image}>
                    <Image src={logo} alt="gp logo" />
                </Link>
            </SidebarHeader>

            <Separator className="bg-slate-300 dark:bg-slate-600" />

            <SidebarContent className={styles.sidebar}>
                <SideBarItem title="Tus evaluaciones" items={items} />
                <SideBarItem title="RRHH" items={itemsRRHH} />
                <SidebarFooter className={styles.sidebar}>
                    <ModeToggle />
                </SidebarFooter>
            </SidebarContent>


        </Sidebar>
    )
}
