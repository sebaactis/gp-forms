"use client"

import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner"
import ProfileEdit from "@/app/components/Profile/ProfileEdit";
import { useSession } from "next-auth/react"

const ProfilePage = () => {

    const { data: session } = useSession();

    return (
        <section>
            <WelcomeBanner
                title="Configuración de usuario"
                bagde={session?.user?.email}
                icon="user-pen"
            />

            <ProfileEdit email={session?.user?.email} role={session?.user?.role} nombre={session?.user?.nombre} apellido={session?.user?.apellido} id={session?.user?.id} />
        </section>
    )
}

export default ProfilePage