"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="flex w-full">
                {children}
                <Toaster />
            </main>
        </ThemeProvider>
    );
}