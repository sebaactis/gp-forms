import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import HistoryMain from "@/app/components/History/HistoryMain";

export default function Hitory() {
    return (
        <div>
            <WelcomeBanner 
                title="Historial"
                bagde="Testing User"
                icon="timer-reset"
            />

            <HistoryMain />
        </div>
    )
}