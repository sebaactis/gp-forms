import EmployeesMain from "@/app/components/Employees/EmployeesMain";
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";

export default function Employees() {
    return (
        <div>
            <WelcomeBanner
                title="GPeers"
                bagde="RRHH"
                icon="user-cog2"
            />
            <EmployeesMain />
        </div>
    )
}