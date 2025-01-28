"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image"
import logo from "@/public/gp-logo.png"

export function LoginComponent({ onSwitch, setError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/home";
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-96">
      <Image src={logo} alt="gp logo" width={70} />
      <h2 className="mb-4 text-xl font-bold mt-4">Iniciar Sesión</h2>
      <div className="mb-4">
        <label className="block mb-2">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="correo@midominio.com"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <button
          type="submit"
          className="w-full p-2 font-bold text-white bg-cyan-600 rounded hover:bg-cyan-700 transition-all duration-300"
        >
          {isLoading ? <PulseLoader color="#fff" size={10} /> : "Iniciar Sesión"}
        </button>
        <button
          className="w-full p-2 font-bold text-white bg-gray-600 rounded opacity-50"
          disabled
        >
          Iniciar sesión con Microsoft (proximamente...)
        </button>
        <button
          type="button"
          onClick={onSwitch}
          className="w-full p-2 font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 rounded"
        >
          Registrarse
        </button>
      </div>
    </form>
  );
}