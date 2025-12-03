"use client";

import React, { useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiXMark } from "react-icons/hi2";

interface SlidePanelProps {
    children: React.ReactNode;
    panelContent: React.ReactNode;
    panelTitle?: string;
    /** Ancho del panel */
    panelWidth?: string;
    defaultOpen?: boolean;
    position?: "left" | "right";
    /** Si true, ocupa toda la altura del viewport (h-dvh) */
    fullScreen?: boolean;
    /** Clases adicionales para el contenedor */
    className?: string;
}

/**
 * SlidePanel - Panel lateral que empuja el contenido en lugar de superponerse
 *
 * A diferencia de un SlideOver tradicional, este componente:
 * - NO oscurece el fondo
 * - NO se superpone al contenido
 * - EMPUJA el contenido principal cuando se abre
 * - Puede estar a la izquierda o derecha
 * - Soporta modo fullScreen para ocupar toda la pantalla
 * - Responsive: puede tener diferentes anchos en móvil y desktop
 */
export function SlidePanel({
    children,
    panelContent,
    panelTitle = "Panel",
    panelWidth = "400px",
    defaultOpen = false,
    position = "right",
    fullScreen = false,
    className = "",
}: SlidePanelProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const containerClasses = fullScreen
        ? `flex h-dvh w-full overflow-hidden ${className}`
        : `flex h-full w-full overflow-hidden ${className}`;

    return (
        <div className={containerClasses}>
            {/* Left Panel */}
            {position === "left" && isOpen && (
                <aside
                    className="shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ width: panelWidth }}
                >
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {panelTitle}
                            </h3>
                            <button
                                onClick={toggle}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Panel Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {panelContent}
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto relative">
                {children}

                {/* Toggle Button - Left Position */}
                {position === "left" && !isOpen && (
                    <button
                        onClick={toggle}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                        title={`Abrir ${panelTitle}`}
                    >
                        <HiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}

                {/* Toggle Button - Right Position */}
                {position === "right" && !isOpen && (
                    <button
                        onClick={toggle}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-r-0 rounded-l-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                        title={`Abrir ${panelTitle}`}
                    >
                        <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
            </main>

            {/* Right Panel */}
            {position === "right" && isOpen && (
                <aside
                    className="shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ width: panelWidth }}
                >
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {panelTitle}
                            </h3>
                            <button
                                onClick={toggle}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Panel Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {panelContent}
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
}

/**
 * SlidePanelControlled - Versión controlada del SlidePanel
 * Para cuando necesitas controlar el estado desde fuera
 * Soporta fullScreen y responsive
 */
interface SlidePanelControlledProps {
    children: React.ReactNode;
    panelContent: React.ReactNode;
    panelTitle?: string;
    /** Ancho del panel */
    panelWidth?: string;
    isOpen: boolean;
    onToggle: () => void;
    position?: "left" | "right";
    /** Si true, ocupa toda la altura del viewport (h-dvh) */
    fullScreen?: boolean;
    /** Clases adicionales para el contenedor */
    className?: string;
}

export function SlidePanelControlled({
    children,
    panelContent,
    panelTitle = "Panel",
    panelWidth = "400px",
    isOpen,
    onToggle,
    position = "right",
    fullScreen = false,
    className = "",
}: SlidePanelControlledProps) {
    const containerClasses = fullScreen
        ? `flex h-dvh w-full overflow-hidden ${className}`
        : `flex h-full w-full overflow-hidden ${className}`;

    return (
        <div className={containerClasses}>
            {/* Left Panel */}
            {position === "left" && (
                <aside
                    className={`shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "opacity-100" : "opacity-0 w-0"
                    }`}
                    style={{ width: isOpen ? panelWidth : "0px" }}
                >
                    <div
                        className="h-full flex flex-col"
                        style={{ width: panelWidth }}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {panelTitle}
                            </h3>
                            <button
                                onClick={onToggle}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {panelContent}
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto relative transition-all duration-300">
                {children}

                {/* Toggle Buttons */}
                {position === "left" && !isOpen && (
                    <button
                        onClick={onToggle}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                        title={`Abrir ${panelTitle}`}
                    >
                        <HiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}

                {position === "right" && !isOpen && (
                    <button
                        onClick={onToggle}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-r-0 rounded-l-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                        title={`Abrir ${panelTitle}`}
                    >
                        <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
            </main>

            {/* Right Panel */}
            {position === "right" && (
                <aside
                    className={`shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "opacity-100" : "opacity-0 w-0"
                    }`}
                    style={{ width: isOpen ? panelWidth : "0px" }}
                >
                    <div
                        className="h-full flex flex-col"
                        style={{ width: panelWidth }}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {panelTitle}
                            </h3>
                            <button
                                onClick={onToggle}
                                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {panelContent}
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
}

export default SlidePanel;
