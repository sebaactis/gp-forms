import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import styles from "./AppSidebar.module.css"
import Link from "next/link"

const SideBarItem = ({ title, items }) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className={styles.containerGroup}>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className={styles.itemButton} asChild>
                                <Link href={item.url}>
                                    <item.icon style={{ color: "var(--icon-color)", width: "1.3rem", height: "1.3rem" }} />
                                    <span className={styles.itemTitle}>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

    )
}

export default SideBarItem