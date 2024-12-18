import HomeTable from "@/app/components/Home/HomeTable/HomeTable";
import styles from "./home.module.css"
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import { MenuSquare } from "lucide-react"

export default function Home() {
    return (
        <section className={styles.mainContainer}>
            <WelcomeBanner
                title="Inicio"
                bagde="Supervisor X"
                icon={MenuSquare}
            />

            <article className={styles.infoContainer}>
                <HomeTable />
            </article>
        </section>
    )
}