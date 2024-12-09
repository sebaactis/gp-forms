import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import HistoryMain from "@/app/components/History/HistoryMain";
import { TimerResetIcon } from "lucide-react"

export default function Hitory() {
    return (
        <div>
            <WelcomeBanner 
                title="Historial"
                bagde="Sebastian Actis"
                icon={TimerResetIcon}
            />

            <HistoryMain />
        </div>
    )
}