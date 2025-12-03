"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";
import {
    HiOutlineArrowsPointingOut,
    HiOutlineCodeBracket,
} from "react-icons/hi2";

// Initialize mermaid with default config
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
    },
    sequence: {
        useMaxWidth: true,
        actorMargin: 50,
        messageMargin: 40,
    },
    themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#2563eb",
        lineColor: "#6b7280",
        secondaryColor: "#f3f4f6",
        tertiaryColor: "#e5e7eb",
    },
});

interface MermaidDiagramProps {
    chart: string;
    className?: string;
    title?: string;
    showSource?: boolean;
    theme?: "default" | "dark" | "forest" | "neutral";
}

export function MermaidDiagram({
    chart,
    className,
    title,
    showSource = false,
    theme = "default",
}: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showCode, setShowCode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const renderChart = async () => {
            if (!containerRef.current) return;

            try {
                // Update theme
                mermaid.initialize({
                    theme: theme,
                    themeVariables:
                        theme === "dark"
                            ? {
                                  primaryColor: "#3b82f6",
                                  primaryTextColor: "#e5e7eb",
                                  primaryBorderColor: "#60a5fa",
                                  lineColor: "#9ca3af",
                                  secondaryColor: "#374151",
                                  tertiaryColor: "#4b5563",
                                  background: "#1f2937",
                              }
                            : undefined,
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
                setError(null);
            } catch (err) {
                console.error("Mermaid rendering error:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to render diagram"
                );
                setSvg("");
            }
        };

        renderChart();
    }, [chart, theme]);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            containerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    return (
        <div
            className={cn(
                "rounded-lg border bg-white dark:bg-gray-900 overflow-hidden",
                isFullscreen && "fixed inset-0 z-50 rounded-none",
                className
            )}
        >
            {/* Header */}
            {(title || showSource) && (
                <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
                    {title && (
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {title}
                        </h3>
                    )}
                    <div className="flex items-center gap-2">
                        {showSource && (
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className={cn(
                                    "p-1.5 rounded transition-colors",
                                    showCode
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                )}
                                title={showCode ? "Hide source" : "Show source"}
                            >
                                <HiOutlineCodeBracket className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                            title={
                                isFullscreen ? "Exit fullscreen" : "Fullscreen"
                            }
                        >
                            <HiOutlineArrowsPointingOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex">
                {/* Diagram */}
                <div
                    ref={containerRef}
                    className={cn(
                        "flex-1 p-4 overflow-auto flex items-center justify-center min-h-[200px]",
                        showCode && "w-1/2"
                    )}
                >
                    {error ? (
                        <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded">
                            <strong>Error:</strong> {error}
                        </div>
                    ) : svg ? (
                        <div
                            className="mermaid-svg-container"
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                    ) : (
                        <div className="text-gray-400 animate-pulse">
                            Loading diagram...
                        </div>
                    )}
                </div>

                {/* Source code */}
                {showCode && (
                    <div className="w-1/2 border-l bg-gray-900 p-4 overflow-auto">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                            {chart}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

// Pre-built diagram templates
export const MermaidTemplates = {
    // Sequence diagram
    sequence: (
        actors: string[],
        messages: {
            from: string;
            to: string;
            message: string;
            type?: "solid" | "dotted";
        }[]
    ) => {
        const actorDefs = actors.map((a) => `participant ${a}`).join("\n");
        const messageDefs = messages
            .map((m) => {
                const arrow = m.type === "dotted" ? "-->>" : "->>";
                return `${m.from}${arrow}${m.to}: ${m.message}`;
            })
            .join("\n");
        return `sequenceDiagram\n${actorDefs}\n${messageDefs}`;
    },

    // Flowchart
    flowchart: (
        nodes: {
            id: string;
            label: string;
            shape?: "rect" | "round" | "stadium" | "diamond";
        }[],
        edges: { from: string; to: string; label?: string }[],
        direction: "TB" | "LR" | "BT" | "RL" = "TB"
    ) => {
        const shapeMap = {
            rect: (id: string, label: string) => `${id}[${label}]`,
            round: (id: string, label: string) => `${id}(${label})`,
            stadium: (id: string, label: string) => `${id}([${label}])`,
            diamond: (id: string, label: string) => `${id}{${label}}`,
        };

        const nodeDefs = nodes
            .map((n) => shapeMap[n.shape || "rect"](n.id, n.label))
            .join("\n");
        const edgeDefs = edges
            .map((e) =>
                e.label
                    ? `${e.from} -->|${e.label}| ${e.to}`
                    : `${e.from} --> ${e.to}`
            )
            .join("\n");

        return `flowchart ${direction}\n${nodeDefs}\n${edgeDefs}`;
    },

    // Class diagram
    classDiagram: (
        classes: { name: string; methods?: string[]; attributes?: string[] }[],
        relations: {
            from: string;
            to: string;
            type: "inheritance" | "composition" | "aggregation" | "association";
        }[]
    ) => {
        const relationMap = {
            inheritance: "<|--",
            composition: "*--",
            aggregation: "o--",
            association: "--",
        };

        const classDefs = classes
            .map((c) => {
                const attrs =
                    c.attributes?.map((a) => `+${a}`).join("\n") || "";
                const methods =
                    c.methods?.map((m) => `+${m}()`).join("\n") || "";
                return `class ${c.name} {\n${attrs}\n${methods}\n}`;
            })
            .join("\n");

        const relationDefs = relations
            .map((r) => `${r.from} ${relationMap[r.type]} ${r.to}`)
            .join("\n");

        return `classDiagram\n${classDefs}\n${relationDefs}`;
    },

    // Entity Relationship diagram
    erDiagram: (
        entities: {
            name: string;
            attributes: { name: string; type: string; pk?: boolean }[];
        }[],
        relations: {
            from: string;
            to: string;
            relationship: string;
            fromCardinality: string;
            toCardinality: string;
        }[]
    ) => {
        const entityDefs = entities
            .map((e) => {
                const attrs = e.attributes
                    .map((a) => `${a.type} ${a.name}${a.pk ? " PK" : ""}`)
                    .join("\n");
                return `${e.name} {\n${attrs}\n}`;
            })
            .join("\n");

        const relationDefs = relations
            .map(
                (r) =>
                    `${r.from} ${r.fromCardinality}--${r.toCardinality} ${r.to} : "${r.relationship}"`
            )
            .join("\n");

        return `erDiagram\n${entityDefs}\n${relationDefs}`;
    },
};
