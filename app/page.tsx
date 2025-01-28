"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { RegisterComponent } from "./components/RegisterComponent";

export default function AuthPage() {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router, status]);

  return (
    <div className="flex items-center justify-center min-h-screen m-auto flex-col gap-3">

      {isLogin ? (
        <LoginComponent
          onSwitch={() => setIsLogin(false)}
          setError={setError}
        />
      ) : (
        <RegisterComponent
          onSwitch={() => setIsLogin(true)}
          setError={setError}
        />
      )}
      {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}
    </div>
  );
}