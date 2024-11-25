import { Metadata } from "next";
import ClientRootLayout from "@/app/components/ClientRootLayout";
import './globals.css'

export const metadata: Metadata = {
  title: "GP-FORMS",
  description: "Descripción de tu página",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
