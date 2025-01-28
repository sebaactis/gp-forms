import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image"
import logo from "@/public/gp-logo.png"

export function RegisterComponent({ onSwitch, setError }) {

    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email.endsWith("@globalprocessing.com.ar")) {
            setError("El correo debe pertenecer al dominio @globalprocessing.com.ar");
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, nombre, apellido }),
            });

            const data = await response.json();

            if (response.ok) {

                toast({
                    title: 'Registro exitoso!',
                    className: 'bg-green-800',
                    duration: 3000
                })

                window.location.href = "/";
            } else {
                setError(data.error || "Error en el registro");
            }
        } catch (error) {
            console.error(error);
            setError("Error interno del servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-96">
            <Image src={logo} alt="gp logo" width={70} />
            <h2 className="mb-4 text-xl font-bold mt-4">Registrarse</h2>
            <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Nombre"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Apellido</label>
                <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Apellido"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Correo</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="correo@globalprocessing.com.ar"
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
                    {isLoading ? <PulseLoader color="#fff" size={10} /> : "Registrarse"}
                </button>
                <button
                    type="button"
                    onClick={onSwitch}
                    className="w-full p-2 font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 rounded"
                >
                    ¿Ya tenés cuenta? Iniciá Sesión
                </button>
            </div>
        </form>
    );
}