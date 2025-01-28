import FormMain from "@/app/components/Forms/FormMain/FormMain";
import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner";

export default function Forms() {
    return (
        <div>
            <WelcomeBanner
                title="Formularios"
                icon="file-spread"
                bagde="RRHH"
            />
            <FormMain />
        </div>
    )
}