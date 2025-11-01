"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitar hydration mismatch - solo renderizar después de montar
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="default" className="h-9 w-9 px-0">
                <HiSun className="h-5 w-5" />
            </Button>
        );
    }

    const cycleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    return (
        <Button
            variant="ghost"
            size="default"
            onClick={cycleTheme}
            className="h-9 w-9 px-0"
            title={`Current theme: ${theme}`}
        >
            {theme === "light" && <HiSun className="h-5 w-5" />}
            {theme === "dark" && <HiMoon className="h-5 w-5" />}
            {theme === "system" && <HiComputerDesktop className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
