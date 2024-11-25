import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar/AppSidebar";
import styles from "./layout.module.css"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider >
            <AppSidebar/>
            <div className={styles.container}>
                <SidebarTrigger />
                {children}
            </div>
        </SidebarProvider>
    );
}