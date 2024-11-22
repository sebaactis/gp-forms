"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { useEffect, useState } from "react";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main className="flex w-full">
                {children}
            </main>
        </ThemeProvider>
    );
}