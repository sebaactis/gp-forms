"use client"

import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import HistoryMain from "@/app/components/History/HistoryMain";
import { useSession } from "next-auth/react";

export default function Hitory() {

    const { data: session } = useSession();

    return (
        <div>
            <WelcomeBanner
                title="Historial"
                bagde={session?.user?.email}
                icon="timer-reset"
            />

            <HistoryMain />
        </div>
    )
}