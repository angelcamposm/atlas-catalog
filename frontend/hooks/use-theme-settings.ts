"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ColorMode, LightTheme, DarkTheme } from "@/lib/theme-config";

const COLOR_MODE_KEY = "color-mode";
const LIGHT_THEME_KEY = "light-theme";
const DARK_THEME_KEY = "dark-theme";

export function useThemeSettings() {
    const { setTheme: setNextTheme, systemTheme } = useTheme();

    const [colorMode, setColorModeState] = useState<ColorMode>(() => {
        if (typeof window !== "undefined") {
            return (
                (localStorage.getItem(COLOR_MODE_KEY) as ColorMode) || "system"
            );
        }
        return "system";
    });

    const [lightTheme, setLightThemeState] = useState<LightTheme>(() => {
        if (typeof window !== "undefined") {
            return (
                (localStorage.getItem(LIGHT_THEME_KEY) as LightTheme) ||
                "default"
            );
        }
        return "default";
    });

    const [darkTheme, setDarkThemeState] = useState<DarkTheme>(() => {
        if (typeof window !== "undefined") {
            return (
                (localStorage.getItem(DARK_THEME_KEY) as DarkTheme) || "default"
            );
        }
        return "default";
    });

    const [mounted, setMounted] = useState(false);

    // Set mounted state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply theme classes when settings change
    useEffect(() => {
        if (!mounted) return;

        // Set the base color mode (light/dark/system)
        setNextTheme(colorMode);

        // Add theme variant class
        const html = document.documentElement;

        // Remove all theme classes
        html.classList.remove(
            "theme-orange",
            "theme-green",
            "theme-blue",
            "theme-purple"
        );

        // Determine which theme to apply
        const effectiveMode = colorMode === "system" ? systemTheme : colorMode;

        if (effectiveMode === "light" && lightTheme !== "default") {
            html.classList.add(`theme-${lightTheme}`);
        } else if (effectiveMode === "dark" && darkTheme !== "default") {
            html.classList.add(`theme-${darkTheme}`);
        }
    }, [colorMode, lightTheme, darkTheme, systemTheme, setNextTheme, mounted]);

    const setColorMode = (mode: ColorMode) => {
        setColorModeState(mode);
        localStorage.setItem(COLOR_MODE_KEY, mode);
    };

    const setLightTheme = (theme: LightTheme) => {
        setLightThemeState(theme);
        localStorage.setItem(LIGHT_THEME_KEY, theme);
    };

    const setDarkTheme = (theme: DarkTheme) => {
        setDarkThemeState(theme);
        localStorage.setItem(DARK_THEME_KEY, theme);
    };

    // Get the currently active mode (resolving system)
    const activeMode = colorMode === "system" ? systemTheme : colorMode;

    return {
        colorMode,
        lightTheme,
        darkTheme,
        activeMode,
        setColorMode,
        setLightTheme,
        setDarkTheme,
        mounted,
    };
}
