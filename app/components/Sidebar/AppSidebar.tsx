"use client"

import { Settings, UserPen, BookOpenText, UsersRoundIcon, History, LockKeyholeIcon } from "lucide-react"
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

const settingItems = [
    {
        title: "Ajustes",
        url: "/settings",
        icon: Settings
    }
]

export function AppSidebar() {

    return (
        <Sidebar >
            <SidebarHeader className={styles.sidebar}>
                <Link href="/home" className={styles.image}>
                    <Image  src={logo} alt="gp logo" />
                </Link>
            </SidebarHeader>

            <SidebarContent className={styles.sidebar}>
                <SideBarItem title="Tus evaluaciones" items={items} />
                <SideBarItem title="RRHH" items={itemsRRHH} />
                <SideBarItem title="Ajustes" items={settingItems} />
            </SidebarContent>

            <SidebarFooter className={styles.sidebar}>
                <ModeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}
