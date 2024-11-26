import HomeTable from "@/app/components/Home/HomeTable/HomeTable";
import styles from "./home.module.css"
import { Card } from "@/app/components/Home/Card/Card";
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import { MenuSquare } from "lucide-react"

export default function Home() {
    return (
        <section className={styles.mainContainer}>
            <WelcomeBanner
                title="Inicio"
                bagde="Sebastian Actis"
                icon={MenuSquare}
            />

            <article className={styles.infoContainer}>
                <HomeTable />
                <div className={styles.cardContainer}>
                    <Card title="Totales" quantity="28" />
                    <Card title="Finalizados" quantity="23" />
                    <Card title="Pendientes" quantity="5" />
                </div>
            </article>
        </section>
    )
}