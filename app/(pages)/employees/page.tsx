import EmployeesMain from "@/app/components/Employees/EmployeesMain";
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import { UserCog2 } from "lucide-react"

export default function Employees() {
    return (
        <div>
            <WelcomeBanner
                title="GPeers"
                bagde="RRHH"
                icon={UserCog2}
            />
            <EmployeesMain />
        </div>
    )
}