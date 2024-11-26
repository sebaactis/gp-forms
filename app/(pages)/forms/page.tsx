import FormMain from "@/app/components/Forms/FormMain/FormMain";
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import { FileSpreadsheetIcon } from "lucide-react"

export default function Forms() {
    return (
        <div>
            <WelcomeBanner 
            title="Formularios"
            icon={FileSpreadsheetIcon}
            bagde="RRHH"
            />
            <FormMain />
        </div>
    )
}