"use client";

import React from "react";
import Image from "next/image";
import {
    HiOutlineInboxStack,
    HiOutlineDocumentMagnifyingGlass,
    HiOutlineExclamationCircle,
    HiOutlineWifi,
    HiOutlineServerStack,
    HiOutlineFolderOpen,
    HiOutlineUsers,
    HiOutlineCube,
    HiOutlineArrowPath,
} from "react-icons/hi2";

// Tipos de ilustración predefinidos
export type EmptyStateType =
    | "empty"
    | "no-results"
    | "error"
    | "offline"
    | "server-error"
    | "no-data"
    | "no-users"
    | "no-items"
    | "custom";

export interface EmptyStateProps {
    /** Tipo de estado vacío - determina la ilustración por defecto */
    type?: EmptyStateType;
    /** Título principal */
    title: string;
    /** Descripción o texto explicativo */
    description?: string;
    /** Icono personalizado (sobreescribe el del type) - React component */
    icon?: React.ReactNode;
    /** SVG personalizado como string (para SVGs generados por IA) */
    svgContent?: string;
    /** URL de una imagen SVG externa */
    svgUrl?: string;
    /** Clases CSS adicionales para el contenedor del icono/SVG */
    iconClassName?: string;
    /** Texto del botón de acción principal */
    actionLabel?: string;
    /** Callback del botón de acción principal */
    onAction?: () => void;
    /** Texto del botón secundario */
    secondaryActionLabel?: string;
    /** Callback del botón secundario */
    onSecondaryAction?: () => void;
    /** Si está cargando (deshabilita botones) */
    loading?: boolean;
    /** Tamaño del componente */
    size?: "sm" | "md" | "lg";
    /** Contenido adicional debajo de los botones */
    children?: React.ReactNode;
    /** Clase CSS adicional */
    className?: string;
}

// Props para variantes con retry
export interface RetryableEmptyStateProps
    extends Omit<
        EmptyStateProps,
        "type" | "title" | "onAction" | "actionLabel"
    > {
    /** Título personalizado */
    title?: string;
    /** Callback para reintentar */
    onRetry?: () => void;
}

// Mapeo de tipos a iconos
const typeIcons: Record<EmptyStateType, React.ReactNode> = {
    empty: <HiOutlineInboxStack className="w-full h-full" />,
    "no-results": (
        <HiOutlineDocumentMagnifyingGlass className="w-full h-full" />
    ),
    error: <HiOutlineExclamationCircle className="w-full h-full" />,
    offline: <HiOutlineWifi className="w-full h-full" />,
    "server-error": <HiOutlineServerStack className="w-full h-full" />,
    "no-data": <HiOutlineFolderOpen className="w-full h-full" />,
    "no-users": <HiOutlineUsers className="w-full h-full" />,
    "no-items": <HiOutlineCube className="w-full h-full" />,
    custom: <HiOutlineInboxStack className="w-full h-full" />,
};

// Colores por tipo
const typeColors: Record<EmptyStateType, string> = {
    empty: "text-gray-400 dark:text-gray-500",
    "no-results": "text-blue-400 dark:text-blue-500",
    error: "text-red-400 dark:text-red-500",
    offline: "text-yellow-400 dark:text-yellow-500",
    "server-error": "text-orange-400 dark:text-orange-500",
    "no-data": "text-gray-400 dark:text-gray-500",
    "no-users": "text-purple-400 dark:text-purple-500",
    "no-items": "text-teal-400 dark:text-teal-500",
    custom: "text-gray-400 dark:text-gray-500",
};

// Tamaños
const sizeClasses = {
    sm: {
        container: "py-8 px-4",
        icon: "w-12 h-12",
        title: "text-base",
        description: "text-sm",
        button: "px-3 py-1.5 text-sm",
    },
    md: {
        container: "py-12 px-6",
        icon: "w-16 h-16",
        title: "text-lg",
        description: "text-sm",
        button: "px-4 py-2 text-sm",
    },
    lg: {
        container: "py-16 px-8",
        icon: "w-24 h-24",
        title: "text-xl",
        description: "text-base",
        button: "px-6 py-3 text-base",
    },
};

/**
 * EmptyState - Componente para mostrar estados vacíos con ilustración
 *
 * Características:
 * - Múltiples tipos predefinidos (empty, no-results, error, offline, etc.)
 * - Icono personalizable (React component, SVG string, o URL)
 * - Botones de acción principal y secundario
 * - Tres tamaños: sm, md, lg
 * - Soporte para dark mode
 */
export function EmptyState({
    type = "empty",
    title,
    description,
    icon,
    svgContent,
    svgUrl,
    iconClassName,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    loading = false,
    size = "md",
    children,
    className = "",
}: EmptyStateProps) {
    const sizes = sizeClasses[size];
    const iconColor = typeColors[type];

    // Función para renderizar el icono/ilustración
    const renderIllustration = () => {
        // Prioridad: svgContent > svgUrl > icon > tipo predefinido
        if (svgContent) {
            // SVG inline como string (sanitizado)
            return (
                <div
                    className={`${sizes.icon} ${
                        iconClassName || ""
                    } transition-transform hover:scale-110`}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    aria-hidden="true"
                />
            );
        }

        if (svgUrl) {
            // SVG desde URL
            return (
                <div
                    className={`${sizes.icon} ${
                        iconClassName || ""
                    } relative transition-transform hover:scale-110`}
                >
                    <Image
                        src={svgUrl}
                        alt=""
                        fill
                        className="object-contain"
                        aria-hidden="true"
                        unoptimized
                    />
                </div>
            );
        }

        if (icon) {
            // React component personalizado
            return (
                <div
                    className={`${sizes.icon} ${
                        iconClassName || iconColor
                    } transition-transform hover:scale-110`}
                >
                    {icon}
                </div>
            );
        }

        // Icono predefinido por tipo
        return (
            <div
                className={`${sizes.icon} ${
                    iconClassName || iconColor
                } transition-transform hover:scale-110`}
            >
                {typeIcons[type]}
            </div>
        );
    };

    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${sizes.container} ${className}`}
        >
            {/* Ilustración / Icono */}
            <div className="mb-4">{renderIllustration()}</div>

            {/* Título */}
            <h3
                className={`font-semibold text-gray-900 dark:text-white ${sizes.title} mb-2`}
            >
                {title}
            </h3>

            {/* Descripción */}
            {description && (
                <p
                    className={`text-gray-500 dark:text-gray-400 ${sizes.description} max-w-md mb-6`}
                >
                    {description}
                </p>
            )}

            {/* Botones de acción */}
            {(actionLabel || secondaryActionLabel) && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {actionLabel && onAction && (
                        <button
                            onClick={onAction}
                            disabled={loading}
                            className={`inline-flex items-center gap-2 ${sizes.button} font-medium rounded-lg 
                                bg-indigo-600 text-white hover:bg-indigo-700 
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                dark:focus:ring-offset-gray-900`}
                        >
                            {loading ? (
                                <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
                            ) : null}
                            {actionLabel}
                        </button>
                    )}

                    {secondaryActionLabel && onSecondaryAction && (
                        <button
                            onClick={onSecondaryAction}
                            disabled={loading}
                            className={`inline-flex items-center gap-2 ${sizes.button} font-medium rounded-lg 
                                bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                hover:bg-gray-200 dark:hover:bg-gray-600
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                dark:focus:ring-offset-gray-900`}
                        >
                            {secondaryActionLabel}
                        </button>
                    )}
                </div>
            )}

            {/* Contenido adicional */}
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
}

// Variantes pre-configuradas para casos comunes
export function EmptyList({
    onRetry,
    loading,
    title,
    description,
    ...props
}: RetryableEmptyStateProps) {
    return (
        <EmptyState
            type="empty"
            title={title || "No hay elementos"}
            description={description || "Aún no hay elementos para mostrar."}
            actionLabel={onRetry ? "Actualizar" : undefined}
            onAction={onRetry}
            loading={loading}
            {...props}
        />
    );
}

export interface NoSearchResultsProps
    extends Omit<
        EmptyStateProps,
        "type" | "title" | "onAction" | "actionLabel"
    > {
    /** Término de búsqueda para mostrar en el mensaje */
    searchTerm?: string;
    /** Callback para limpiar la búsqueda */
    onClear?: () => void;
}

export function NoSearchResults({
    searchTerm,
    onClear,
    ...props
}: NoSearchResultsProps) {
    return (
        <EmptyState
            type="no-results"
            title="Sin resultados"
            description={
                searchTerm
                    ? `No se encontraron resultados para "${searchTerm}".`
                    : "No se encontraron resultados para tu búsqueda."
            }
            actionLabel={onClear ? "Limpiar búsqueda" : undefined}
            onAction={onClear}
            {...props}
        />
    );
}

export interface ErrorStateProps extends RetryableEmptyStateProps {
    /** Mensaje de error específico */
    errorMessage?: string;
}

export function ErrorState({
    onRetry,
    loading,
    errorMessage,
    title,
    description,
    ...props
}: ErrorStateProps) {
    return (
        <EmptyState
            type="error"
            title={title || "Algo salió mal"}
            description={
                errorMessage ||
                description ||
                "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo."
            }
            actionLabel={onRetry ? "Reintentar" : undefined}
            onAction={onRetry}
            loading={loading}
            {...props}
        />
    );
}

export function OfflineState({
    onRetry,
    loading,
    title,
    ...props
}: RetryableEmptyStateProps) {
    return (
        <EmptyState
            type="offline"
            title={title || "Sin conexión"}
            description="Parece que no tienes conexión a internet. Verifica tu conexión e inténtalo de nuevo."
            actionLabel={onRetry ? "Reintentar" : undefined}
            onAction={onRetry}
            loading={loading}
            {...props}
        />
    );
}

export function ServerErrorState({
    onRetry,
    loading,
    title,
    ...props
}: RetryableEmptyStateProps) {
    return (
        <EmptyState
            type="server-error"
            title={title || "Error del servidor"}
            description="El servidor no está respondiendo. Por favor, inténtalo de nuevo en unos momentos."
            actionLabel={onRetry ? "Reintentar" : undefined}
            onAction={onRetry}
            loading={loading}
            {...props}
        />
    );
}

export default EmptyState;
