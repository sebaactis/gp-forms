"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginComponent } from "./components/LoginComponent";
import { RegisterComponent } from "./components/RegisterComponent";
import ClockLoader from "react-spinners/ClockLoader";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsCheckingSession(true);
    } else if (session) {
      router.push("/home");
    } else {
      setIsCheckingSession(false);
    }
  }, [session, status, router]);

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <ClockLoader
          size={100}
          color="#0DE6B4" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen m-auto flex-col gap-3">
      {isLogin ? (
        <LoginComponent onSwitch={() => setIsLogin(false)} setError={setError} />
      ) : (
        <RegisterComponent onSwitch={() => setIsLogin(true)} setError={setError} />
      )}
      {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}
    </div>
  );
}
