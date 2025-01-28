import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";
import RoleMain from "@/app/components/Role/RoleMain";

export default function Roles() {
    return (
        <div>
            <WelcomeBanner
                title="Roles"
                bagde="RRHH"
                icon="shield-question"
            />

            <RoleMain />
        </div>
    )
}