/**
 * Theme Configuration
 *
 * Define available themes for the application.
 * The system is designed to be extensible - add new themes here as needed.
 */

export type ThemeName = "light" | "dark" | "blue" | "purple" | "green" | "orange" | "system";

export interface ThemeConfig {
    name: ThemeName;
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
 * Currently: light and dark
 * Future: blue, purple, custom themes, etc.
 */
export const themes: Record<ThemeName, ThemeConfig> = {
    light: {
        name: "light",
        label: "Light",
        colors: {
            primary: "#3b82f6",
            secondary: "#6366f1",
            accent: "#8b5cf6",
            background: "#ffffff",
            foreground: "#111827",
        },
    },
    dark: {
        name: "dark",
        label: "Dark",
        colors: {
            primary: "#3b82f6",
            secondary: "#6366f1",
            accent: "#8b5cf6",
            background: "#030712",
            foreground: "#f9fafb",
        },
    },
    // Future themes - ready to be implemented
    blue: {
        name: "blue",
        label: "Ocean Blue",
        colors: {
            primary: "#0ea5e9",
            secondary: "#0284c7",
            accent: "#06b6d4",
            background: "#f0f9ff",
            foreground: "#0c4a6e",
        },
    },
    purple: {
        name: "purple",
        label: "Royal Purple",
        colors: {
            primary: "#a855f7",
            secondary: "#9333ea",
            accent: "#c026d3",
            background: "#faf5ff",
            foreground: "#581c87",
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
    system: {
        name: "system",
        label: "System",
        colors: {
            primary: "#3b82f6",
            secondary: "#6366f1",
            accent: "#8b5cf6",
            background: "#ffffff",
            foreground: "#111827",
        },
    },
};

/**
 * Active themes that are currently available in the UI
 * Add/remove theme names here to enable/disable them
 */
export const activeThemes: ThemeName[] = ["light", "dark", "blue", "purple", "green", "orange", "system"];

/**
 * Default theme
 */
export const defaultTheme: ThemeName = "system";
