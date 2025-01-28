"use client"

import HomeTable from "@/app/components/Home/HomeTable/HomeTable";
import styles from "./home.module.css"
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import { useSession } from "next-auth/react";

export default function Home() {

    const { data: session } = useSession();

    return (
            <section className={styles.mainContainer}>
                <WelcomeBanner
                    title="Inicio"
                    bagde={session?.user?.email}
                    icon="menu-square"
                />

                <article className={styles.infoContainer}>
                    <HomeTable />
                </article>
            </section>
    )
}