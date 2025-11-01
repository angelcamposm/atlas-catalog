/**
 * Atlas Catalog Design System
 * Based on Golden Ratio (φ = 1.618) and Fibonacci Sequence
 * for harmonious spacing, typography, and layout
 */

// Golden Ratio constant
export const PHI = 1.618;

// Fibonacci sequence for spacing (in px)
export const spacing = {
    xs: 8, // 8px
    sm: 13, // 13px
    md: 21, // 21px
    lg: 34, // 34px
    xl: 55, // 55px
    "2xl": 89, // 89px
    "3xl": 144, // 144px
} as const;

// Typography scale based on golden ratio
export const typography = {
    sizes: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.313rem", // 21px
        "2xl": "1.5rem", // 24px
        "3xl": "2.125rem", // 34px
        "4xl": "3.438rem", // 55px
        "5xl": "5.563rem", // 89px
    },
    weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.618, // Golden ratio
    },
} as const;

// Color palette - Professional & Modern
export const colors = {
    // Primary - Blue gradient (Trust, Professionalism)
    primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6", // Main
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
    },
    // Secondary - Indigo (Innovation, Technology)
    secondary: {
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1", // Main
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81",
        950: "#1e1b4b",
    },
    // Accent - Emerald (Success, Growth)
    accent: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981", // Main
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
        950: "#022c22",
    },
    // Neutral - Gray (Balance, Sophistication)
    neutral: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
    },
    // Semantic colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
} as const;

// Layout breakpoints (based on common device sizes)
export const breakpoints = {
    sm: "640px", // Mobile landscape
    md: "768px", // Tablet
    lg: "1024px", // Desktop
    xl: "1280px", // Large desktop
    "2xl": "1536px", // Extra large
} as const;

// Container max widths (following golden ratio)
export const containers = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
    full: "100%",
} as const;

// Border radius (rounded corners)
export const borderRadius = {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
} as const;

// Shadows (elevation system)
export const shadows = {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none",
} as const;

// Z-index layers (stacking context)
export const zIndex = {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
} as const;

// Animation durations
export const transitions = {
    fast: "150ms",
    base: "300ms",
    slow: "500ms",
    slower: "800ms",
} as const;

// Sidebar configuration
export const sidebar = {
    width: {
        expanded: "280px", // ~280px for comfortable reading
        collapsed: "80px", // Icon only mode
    },
    breakpoint: "1024px", // Show/hide on lg screens
} as const;

// Navbar configuration
export const navbar = {
    height: "80px", // 5rem - Increased for better prominence
    mobileHeight: "64px", // 4rem
} as const;

// Footer configuration
export const footer = {
    height: "auto",
    maxColumns: 4,
} as const;

// Content spacing (golden ratio based)
export const content = {
    sectionPadding: {
        mobile: spacing.lg, // 34px
        desktop: spacing.xl, // 55px
    },
    containerPadding: {
        mobile: spacing.md, // 21px
        desktop: spacing.lg, // 34px
    },
    elementGap: {
        tight: spacing.xs, // 8px
        normal: spacing.sm, // 13px
        relaxed: spacing.md, // 21px
        loose: spacing.lg, // 34px
    },
} as const;

// Export all
export const designSystem = {
    PHI,
    spacing,
    typography,
    colors,
    breakpoints,
    containers,
    borderRadius,
    shadows,
    zIndex,
    transitions,
    sidebar,
    navbar,
    footer,
    content,
} as const;

export default designSystem;
