import { Metadata } from "next";
import ClientRootLayout from "@/app/components/ClientRootLayout";
import './globals.css'
import { Mona_Sans } from "next/font/google"

export const metadata: Metadata = {
  title: "GP-FORMS",
  description: "Descripción de tu página",
};

const monaSans = Mona_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={monaSans.className}>
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
