/**
 * Theme Configuration
 *
 * Two-level theme system:
 * 1. Color Mode: light, dark, or system
 * 2. Color Theme: specific color variant within the mode
 */

export type ColorMode = "light" | "dark" | "system";

export type LightTheme = "default" | "orange" | "green";
export type DarkTheme = "default" | "blue" | "purple";

export interface ThemeConfig {
    name: string;
    label: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        foreground: string;
    };
}

/**
 * Available themes
 */
export const lightThemes: Record<LightTheme, ThemeConfig> = {
    default: {
        name: "default",
        label: "Default Light",
        colors: {
            primary: "#3b82f6",
            secondary: "#6366f1",
            accent: "#8b5cf6",
            background: "#ffffff",
            foreground: "#111827",
        },
    },
    orange: {
        name: "orange",
        label: "Sunset Orange",
        colors: {
            primary: "#f97316",
            secondary: "#ea580c",
            accent: "#fb923c",
            background: "#fff7ed",
            foreground: "#7c2d12",
        },
    },
    green: {
        name: "green",
        label: "Forest Green",
        colors: {
            primary: "#10b981",
            secondary: "#059669",
            accent: "#14b8a6",
            background: "#f0fdf4",
            foreground: "#064e3b",
        },
    },
};

export const darkThemes: Record<DarkTheme, ThemeConfig> = {
    default: {
        name: "default",
        label: "Default Dark",
        colors: {
            primary: "#3b82f6",
            secondary: "#6366f1",
            accent: "#8b5cf6",
            background: "#030712",
            foreground: "#f9fafb",
        },
    },
    blue: {
        name: "blue",
        label: "Ocean Blue",
        colors: {
            primary: "#0ea5e9",
            secondary: "#0284c7",
            accent: "#06b6d4",
            background: "#0c4a6e",
            foreground: "#f0f9ff",
        },
    },
    purple: {
        name: "purple",
        label: "Royal Purple",
        colors: {
            primary: "#a855f7",
            secondary: "#9333ea",
            accent: "#c026d3",
            background: "#581c87",
            foreground: "#faf5ff",
        },
    },
};

/**
 * Default selections
 */
export const defaultColorMode: ColorMode = "system";
export const defaultLightTheme: LightTheme = "default";
export const defaultDarkTheme: DarkTheme = "default";
