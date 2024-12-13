import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import RoleMain from "@/app/components/Role/RoleMain";
import { ShieldQuestionIcon } from "lucide-react"

export default function Roles() {
    return (
        <div>
            <WelcomeBanner
                title="Roles"
                bagde="RRHH"
                icon={ShieldQuestionIcon}
            />

            <RoleMain />
        </div>
    )
}