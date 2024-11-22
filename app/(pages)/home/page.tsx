import HomeTable from "@/app/components/Home/HomeTable/HomeTable";
import styles from "./home.module.css"
import Card from "@/app/components/Home/Card/Card";

export default function Home() {
    return (
        <section className={styles.mainContainer}>
            <article className={styles.welcomeContainer}>
                <h1 className={styles.welcomeTitle}>Bienvenido Sebastian Actis!</h1>
            </article>
            <article className={styles.infoContainer}>
                <HomeTable />
                <div>
                    <Card />
                    <Card />
                </div>
            </article>
        </section>
    )
}