"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// TYPES
// ============================================================================

export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoadingColor =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "white"
    | "current";

// ============================================================================
// TOP LOADING BAR - Barra superior minimalista tipo NProgress/YouTube
// ============================================================================

interface TopLoadingBarProps {
    /** Si está cargando */
    loading?: boolean;
    /** Color de la barra */
    color?: LoadingColor;
    /** Altura de la barra en píxeles */
    height?: number;
    /** Progreso manual (0-100). Si no se proporciona, es indeterminado */
    progress?: number;
    /** Velocidad de la animación en ms */
    speed?: number;
    /** Mostrar sombra/glow */
    showGlow?: boolean;
    /** z-index de la barra */
    zIndex?: number;
    /** Clase CSS adicional */
    className?: string;
}

// Colores usando variables CSS del tema para integración con sistema de temas
const colorClasses: Record<LoadingColor, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-accent", // accent es emerald en el tema por defecto
    warning: "bg-amber-500 dark:bg-amber-400",
    error: "bg-destructive",
    info: "bg-sky-500 dark:bg-sky-400",
    white: "bg-white",
    current: "bg-current",
};

// Glow usando variables CSS del tema
const glowClasses: Record<LoadingColor, string> = {
    primary: "shadow-[0_0_10px_var(--primary)]",
    secondary: "shadow-[0_0_10px_var(--secondary)]",
    success: "shadow-[0_0_10px_var(--accent)]",
    warning: "shadow-[0_0_10px_rgba(245,158,11,0.7)]",
    error: "shadow-[0_0_10px_var(--destructive)]",
    info: "shadow-[0_0_10px_rgba(14,165,233,0.7)]",
    white: "shadow-[0_0_10px_rgba(255,255,255,0.7)]",
    current: "",
};

/**
 * Hook para detectar si el componente está montado en el cliente.
 * Necesario para usar createPortal con document.body.
 *
 * Nota: El setState en useLayoutEffect es intencional y necesario para
 * este patrón de detección de montaje en SSR/hydration.
 */
function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    useLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
}

export function TopLoadingBar({
    loading = false,
    color = "primary",
    height = 3,
    progress,
    speed = 200,
    showGlow = true,
    zIndex = 9999,
    className = "",
}: TopLoadingBarProps) {
    const mounted = useIsMounted();
    const [internalProgress, setInternalProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Efecto para manejar el progreso de la barra de carga.
     * El setState sincrónico es intencional para sincronizar visible/progress
     * con la prop loading, manteniendo la animación de completado.
     */
    useEffect(() => {
        // Limpiar timers previos
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (loading) {
            setVisible(true);
            setInternalProgress(0);

            // Simular progreso indeterminado
            if (progress === undefined) {
                intervalRef.current = setInterval(() => {
                    setInternalProgress((prev) => {
                        if (prev >= 90) return prev;
                        // Progreso más lento conforme avanza
                        const increment = Math.random() * 10 * (1 - prev / 100);
                        return Math.min(prev + increment, 90);
                    });
                }, speed);
            }
        } else if (visible) {
            // Completar la barra antes de ocultarla
            setInternalProgress(100);
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
                setInternalProgress(0);
            }, 300);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [loading, progress, speed, visible]);

    const currentProgress =
        progress !== undefined ? progress : internalProgress;

    if (!mounted) return null;

    const bar = (
        <div
            className={`fixed top-0 left-0 right-0 overflow-hidden transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
            } ${className}`}
            style={{ height: `${height}px`, zIndex }}
            role="progressbar"
            aria-valuenow={currentProgress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Barra de fondo */}
            <div className="absolute inset-0 bg-gray-200/30 dark:bg-gray-700/30" />

            {/* Barra de progreso */}
            <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ease-out ${
                    colorClasses[color]
                } ${showGlow ? glowClasses[color] : ""}`}
                style={{
                    width: `${currentProgress}%`,
                    transition: loading
                        ? `width ${speed}ms ease-out`
                        : "width 300ms ease-out",
                }}
            />

            {/* Efecto de brillo animado */}
            {loading && currentProgress < 100 && (
                <div
                    className={`absolute top-0 bottom-0 w-24 ${colorClasses[color]} opacity-30 animate-pulse`}
                    style={{
                        left: `${Math.max(0, currentProgress - 10)}%`,
                        filter: "blur(8px)",
                    }}
                />
            )}
        </div>
    );

    return createPortal(bar, document.body);
}

// ============================================================================
// SPINNER - Múltiples variantes
// ============================================================================

interface SpinnerProps {
    /** Tamaño del spinner */
    size?: LoadingSize;
    /** Color del spinner */
    color?: LoadingColor;
    /** Tipo de spinner */
    variant?: "circle" | "dots" | "pulse" | "bars" | "ring";
    /** Texto de carga (accesibilidad) */
    label?: string;
    /** Mostrar label visualmente */
    showLabel?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

const spinnerSizes: Record<LoadingSize, { size: string; text: string }> = {
    xs: { size: "w-3 h-3", text: "text-xs" },
    sm: { size: "w-4 h-4", text: "text-sm" },
    md: { size: "w-6 h-6", text: "text-sm" },
    lg: { size: "w-8 h-8", text: "text-base" },
    xl: { size: "w-12 h-12", text: "text-lg" },
};

// Colores de spinner usando variables CSS del tema
const spinnerColors: Record<LoadingColor, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-accent",
    warning: "text-amber-600 dark:text-amber-400",
    error: "text-destructive",
    info: "text-sky-600 dark:text-sky-400",
    white: "text-white",
    current: "text-current",
};

export function Spinner({
    size = "md",
    color = "primary",
    variant = "circle",
    label = "Cargando...",
    showLabel = false,
    className = "",
}: SpinnerProps) {
    const { size: sizeClass, text: textClass } = spinnerSizes[size];
    const colorClass = spinnerColors[color];

    const renderSpinner = () => {
        switch (variant) {
            case "circle":
                return (
                    <svg
                        className={`animate-spin ${sizeClass} ${colorClass}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                );

            case "dots":
                return (
                    <div className={`flex items-center gap-1 ${colorClass}`}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${
                                    size === "xs"
                                        ? "w-1 h-1"
                                        : size === "sm"
                                        ? "w-1.5 h-1.5"
                                        : size === "md"
                                        ? "w-2 h-2"
                                        : size === "lg"
                                        ? "w-2.5 h-2.5"
                                        : "w-3 h-3"
                                } rounded-full bg-current animate-bounce`}
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.6s",
                                }}
                            />
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div
                        className={`${sizeClass} rounded-full bg-current ${colorClass} animate-ping`}
                    />
                );

            case "bars":
                return (
                    <div className={`flex items-end gap-0.5 ${colorClass}`}>
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`${
                                    size === "xs"
                                        ? "w-0.5"
                                        : size === "sm"
                                        ? "w-1"
                                        : size === "md"
                                        ? "w-1"
                                        : size === "lg"
                                        ? "w-1.5"
                                        : "w-2"
                                } bg-current rounded-sm animate-pulse`}
                                style={{
                                    height:
                                        size === "xs"
                                            ? "8px"
                                            : size === "sm"
                                            ? "12px"
                                            : size === "md"
                                            ? "16px"
                                            : size === "lg"
                                            ? "24px"
                                            : "32px",
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.8s",
                                }}
                            />
                        ))}
                    </div>
                );

            case "ring":
                return (
                    <div
                        className={`${sizeClass} border-2 border-current border-t-transparent rounded-full animate-spin ${colorClass}`}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`inline-flex items-center gap-2 ${className}`}
            role="status"
            aria-label={label}
        >
            {renderSpinner()}
            {showLabel && (
                <span className={`${textClass} ${colorClass}`}>{label}</span>
            )}
            <span className="sr-only">{label}</span>
        </div>
    );
}

// ============================================================================
// LOADING OVERLAY - Para cubrir secciones o toda la pantalla
// ============================================================================

interface LoadingOverlayProps {
    /** Si está visible */
    visible?: boolean;
    /** Tipo de spinner a mostrar */
    spinnerVariant?: SpinnerProps["variant"];
    /** Tamaño del spinner */
    spinnerSize?: LoadingSize;
    /** Color del spinner */
    spinnerColor?: LoadingColor;
    /** Texto a mostrar */
    text?: string;
    /** Mostrar texto */
    showText?: boolean;
    /** Opacidad del fondo (0-100) */
    backgroundOpacity?: number;
    /** Si cubre toda la pantalla (fixed) o solo el contenedor (absolute) */
    fullScreen?: boolean;
    /** Blur del fondo */
    blur?: boolean;
    /** z-index */
    zIndex?: number;
    /** Clase CSS adicional */
    className?: string;
}

export function LoadingOverlay({
    visible = true,
    spinnerVariant = "circle",
    spinnerSize = "lg",
    spinnerColor = "primary",
    text = "Cargando...",
    showText = true,
    backgroundOpacity = 80,
    fullScreen = false,
    blur = true,
    zIndex = 50,
    className = "",
}: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <div
            className={`${
                fullScreen ? "fixed" : "absolute"
            } inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${className}`}
            style={{ zIndex }}
        >
            {/* Fondo - usa variable del tema */}
            <div
                className={`absolute inset-0 bg-background ${
                    blur ? "backdrop-blur-sm" : ""
                }`}
                style={{ opacity: backgroundOpacity / 100 }}
            />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <Spinner
                    variant={spinnerVariant}
                    size={spinnerSize}
                    color={spinnerColor}
                />
                {showText && text && (
                    <p className="text-muted-foreground font-medium animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// SKELETON - Placeholders de carga
// ============================================================================

interface SkeletonProps {
    /** Ancho */
    width?: string | number;
    /** Alto */
    height?: string | number;
    /** Forma */
    variant?: "text" | "circular" | "rectangular" | "rounded";
    /** Animación */
    animation?: "pulse" | "wave" | "none";
    /** Clase CSS adicional */
    className?: string;
}

export function Skeleton({
    width,
    height,
    variant = "text",
    animation = "pulse",
    className = "",
}: SkeletonProps) {
    // Usa muted del tema para el color de fondo del skeleton
    const baseClasses = "bg-muted";

    const variantClasses = {
        text: "rounded h-4 w-full",
        circular: "rounded-full",
        rectangular: "",
        rounded: "rounded-lg",
    };

    const animationClasses = {
        pulse: "animate-pulse",
        wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        none: "",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height)
        style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}

// ============================================================================
// SKELETON PRESETS - Combinaciones comunes
// ============================================================================

export function SkeletonText({
    lines = 3,
    className = "",
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? "75%" : "100%"}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div
            className={`bg-card rounded-lg border border-border p-4 ${className}`}
        >
            <div className="flex items-start gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
            </div>
        </div>
    );
}

export function SkeletonTable({
    rows = 5,
    columns = 4,
    className = "",
}: {
    rows?: number;
    columns?: number;
    className?: string;
}) {
    return (
        <div className={`space-y-3 ${className}`}>
            {/* Header */}
            <div className="flex gap-4 pb-2 border-b border-border">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} variant="text" height={16} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 py-2">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            variant="text"
                            height={14}
                            width={colIndex === 0 ? "30%" : undefined}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonList({
    items = 3,
    className = "",
}: {
    items?: number;
    className?: string;
}) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-1">
                        <Skeleton variant="text" width="50%" height={16} />
                        <Skeleton variant="text" width="30%" height={12} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// INLINE LOADING - Para botones y textos
// ============================================================================

interface InlineLoadingProps {
    /** Texto a mostrar */
    text?: string;
    /** Tamaño */
    size?: "sm" | "md";
    /** Color */
    color?: LoadingColor;
    /** Clase CSS adicional */
    className?: string;
}

export function InlineLoading({
    text = "Cargando",
    size = "md",
    color = "current",
    className = "",
}: InlineLoadingProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 ${className}`}
            role="status"
        >
            <Spinner
                size={size === "sm" ? "xs" : "sm"}
                color={color}
                variant="circle"
            />
            <span className={size === "sm" ? "text-sm" : "text-base"}>
                {text}
                <span className="animate-pulse">...</span>
            </span>
        </span>
    );
}

// ============================================================================
// PROGRESS BAR - Barra de progreso lineal
// ============================================================================

interface ProgressBarProps {
    /** Valor actual (0-100) */
    value: number;
    /** Valor máximo */
    max?: number;
    /** Color */
    color?: LoadingColor;
    /** Tamaño */
    size?: "sm" | "md" | "lg";
    /** Mostrar porcentaje */
    showPercentage?: boolean;
    /** Mostrar label */
    label?: string;
    /** Animación de rayas */
    striped?: boolean;
    /** Animación de rayas en movimiento */
    animated?: boolean;
    /** Indeterminado */
    indeterminate?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

const progressSizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
};

export function ProgressBar({
    value,
    max = 100,
    color = "primary",
    size = "md",
    showPercentage = false,
    label,
    striped = false,
    animated = false,
    indeterminate = false,
    className = "",
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`w-full ${className}`}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-1">
                    {label && (
                        <span className="text-sm text-muted-foreground">
                            {label}
                        </span>
                    )}
                    {showPercentage && !indeterminate && (
                        <span className="text-sm font-medium text-foreground">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={`w-full ${progressSizes[size]} bg-muted rounded-full overflow-hidden`}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : percentage}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-full ${
                        colorClasses[color]
                    } rounded-full transition-all duration-300 ease-out
                        ${striped || animated ? "bg-stripes" : ""}
                        ${animated ? "animate-stripes" : ""}
                        ${indeterminate ? "animate-indeterminate w-1/3" : ""}`}
                    style={
                        indeterminate ? undefined : { width: `${percentage}%` }
                    }
                />
            </div>
        </div>
    );
}

// ============================================================================
// HOOK - useLoading para gestionar estados de carga
// ============================================================================

interface UseLoadingOptions {
    /** Delay antes de mostrar el loading (evita flicker) */
    delay?: number;
    /** Duración mínima del loading */
    minDuration?: number;
}

export function useLoading(options: UseLoadingOptions = {}) {
    const { delay = 0, minDuration = 0 } = options;
    const [isLoading, setIsLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        let delayTimer: NodeJS.Timeout;
        let minDurationTimer: NodeJS.Timeout;

        if (isLoading) {
            startTimeRef.current = Date.now();
            delayTimer = setTimeout(() => {
                setShowLoading(true);
            }, delay);
        } else {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, minDuration - elapsed);

            minDurationTimer = setTimeout(() => {
                setShowLoading(false);
            }, remaining);
        }

        return () => {
            clearTimeout(delayTimer);
            clearTimeout(minDurationTimer);
        };
    }, [isLoading, delay, minDuration]);

    return {
        isLoading: showLoading,
        startLoading: () => setIsLoading(true),
        stopLoading: () => setIsLoading(false),
        setLoading: setIsLoading,
    };
}
