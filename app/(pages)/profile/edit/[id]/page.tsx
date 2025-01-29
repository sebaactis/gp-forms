"use client"

import WelcomeBanner from "@/app/components/Globals/Welcome/WelcomeBanner"
import UserEdit from "@/app/components/Profile/UserEdit";
import { useSession } from "next-auth/react";

const PageProfileEdit = () => {

    const { data: session } = useSession();

    return (
        <div>
            <WelcomeBanner
                title="Editar información de usuario"
                bagde={session?.user?.email}
                icon="user-pen"
            />

            <UserEdit />
        </div>
    )
}

export default PageProfileEdit