import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {

                if (!credentials) {
                    throw new Error("No se proporcionaron credenciales");
                }

                const { email, password } = credentials;

                const response = await fetch("http://localhost:3000/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Credenciales inválidas");
                }

                const user = await response.json();

                if (user) {
                    return user;
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 30 * 24
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
};