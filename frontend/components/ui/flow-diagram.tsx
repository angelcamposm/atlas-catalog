"use client";

import { useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Node,
    Edge,
    MarkerType,
    Handle,
    Position,
    NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
    HiOutlineCloud,
    HiOutlineServer,
    HiOutlineCircleStack,
    HiOutlineCog6Tooth,
    HiOutlineGlobeAlt,
    HiOutlineEnvelope,
    HiOutlineBolt,
} from "react-icons/hi2";

// Node types
type FlowNodeType =
    | "service"
    | "database"
    | "queue"
    | "api"
    | "event"
    | "external"
    | "default";

interface FlowNodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    type?: FlowNodeType;
    status?: "healthy" | "warning" | "error" | "unknown";
    version?: string;
    onClick?: () => void;
}

// Icon map for different node types
const nodeIcons: Record<
    FlowNodeType,
    React.ComponentType<{ className?: string }>
> = {
    service: HiOutlineCog6Tooth,
    database: HiOutlineCircleStack,
    queue: HiOutlineEnvelope,
    api: HiOutlineGlobeAlt,
    event: HiOutlineBolt,
    external: HiOutlineCloud,
    default: HiOutlineServer,
};

// Color map for node types
const nodeColors: Record<
    FlowNodeType,
    { bg: string; border: string; text: string }
> = {
    service: {
        bg: "bg-blue-50 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-600",
        text: "text-blue-700 dark:text-blue-300",
    },
    database: {
        bg: "bg-purple-50 dark:bg-purple-900/30",
        border: "border-purple-300 dark:border-purple-600",
        text: "text-purple-700 dark:text-purple-300",
    },
    queue: {
        bg: "bg-orange-50 dark:bg-orange-900/30",
        border: "border-orange-300 dark:border-orange-600",
        text: "text-orange-700 dark:text-orange-300",
    },
    api: {
        bg: "bg-green-50 dark:bg-green-900/30",
        border: "border-green-300 dark:border-green-600",
        text: "text-green-700 dark:text-green-300",
    },
    event: {
        bg: "bg-yellow-50 dark:bg-yellow-900/30",
        border: "border-yellow-300 dark:border-yellow-600",
        text: "text-yellow-700 dark:text-yellow-300",
    },
    external: {
        bg: "bg-gray-50 dark:bg-gray-800/30",
        border: "border-gray-300 dark:border-gray-600",
        text: "text-gray-700 dark:text-gray-300",
    },
    default: {
        bg: "bg-slate-50 dark:bg-slate-900/30",
        border: "border-slate-300 dark:border-slate-600",
        text: "text-slate-700 dark:text-slate-300",
    },
};

// Status colors
const statusColors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    unknown: "bg-gray-400",
};

// Custom Service Node
function ServiceNode({ data }: NodeProps) {
    const nodeData = data as FlowNodeData;
    const nodeType = nodeData.type || "default";
    const colors = nodeColors[nodeType];
    const Icon = nodeIcons[nodeType];

    return (
        <div
            className={cn(
                "px-4 py-3 rounded-lg border-2 shadow-sm min-w-40 cursor-pointer transition-all hover:shadow-md",
                colors.bg,
                colors.border
            )}
            onClick={nodeData.onClick as (() => void) | undefined}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-gray-400! dark:bg-gray-500!"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-gray-400! dark:bg-gray-500!"
            />

            <div className="flex items-center gap-2">
                <Icon className={cn("w-5 h-5", colors.text)} />
                <div className="flex-1">
                    <div className={cn("font-semibold text-sm", colors.text)}>
                        {nodeData.label}
                    </div>
                    {nodeData.version && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            v{nodeData.version}
                        </div>
                    )}
                </div>
                {nodeData.status && (
                    <div
                        className={cn(
                            "w-2 h-2 rounded-full",
                            statusColors[nodeData.status]
                        )}
                        title={nodeData.status}
                    />
                )}
            </div>
            {nodeData.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {nodeData.description}
                </div>
            )}
        </div>
    );
}

// Custom Event Node
function EventNode({ data }: NodeProps) {
    const nodeData = data as FlowNodeData;
    return (
        <div
            className={cn(
                "px-3 py-2 rounded-full border-2 shadow-sm cursor-pointer transition-all hover:shadow-md",
                "bg-yellow-50 dark:bg-yellow-900/30",
                "border-yellow-300 dark:border-yellow-600"
            )}
            onClick={nodeData.onClick as (() => void) | undefined}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="w-2 h-2 bg-yellow-500!"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-2 h-2 bg-yellow-500!"
            />

            <div className="flex items-center gap-2">
                <HiOutlineBolt className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {nodeData.label}
                </span>
            </div>
        </div>
    );
}

// Node type definitions for ReactFlow
const nodeTypes = {
    service: ServiceNode,
    event: EventNode,
};

// Main FlowDiagram component
export interface FlowDiagramProps {
    nodes: Node[];
    edges: Edge[];
    className?: string;
    height?: string;
    onNodeClick?: (node: Node) => void;
    onEdgeClick?: (edge: Edge) => void;
    showMiniMap?: boolean;
    showControls?: boolean;
    showBackground?: boolean;
    fitView?: boolean;
    interactive?: boolean;
}

export function FlowDiagram({
    nodes: initialNodes,
    edges: initialEdges,
    className,
    height = "500px",
    onNodeClick,
    onEdgeClick,
    showMiniMap = true,
    showControls = true,
    showBackground = true,
    fitView = true,
    interactive = true,
}: FlowDiagramProps) {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            onNodeClick?.(node);
        },
        [onNodeClick]
    );

    const handleEdgeClick = useCallback(
        (_: React.MouseEvent, edge: Edge) => {
            onEdgeClick?.(edge);
        },
        [onEdgeClick]
    );

    return (
        <div
            className={cn(
                "rounded-lg border bg-white dark:bg-gray-900 overflow-hidden",
                className
            )}
            style={{ height }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={interactive ? onNodesChange : undefined}
                onEdgesChange={interactive ? onEdgesChange : undefined}
                onConnect={interactive ? onConnect : undefined}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                nodeTypes={nodeTypes}
                fitView={fitView}
                nodesDraggable={interactive}
                nodesConnectable={interactive}
                elementsSelectable={interactive}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { strokeWidth: 2 },
                }}
            >
                {showBackground && (
                    <Background
                        color="#e5e7eb"
                        gap={20}
                        className="dark:bg-gray-900!"
                    />
                )}
                {showControls && (
                    <Controls className="bg-white! dark:bg-gray-800!" />
                )}
                {showMiniMap && (
                    <MiniMap
                        className="bg-gray-100! dark:bg-gray-800!"
                        nodeColor={(node) => {
                            const nodeType =
                                (node.data as FlowNodeData | undefined)?.type ||
                                "default";
                            const colorMap: Record<string, string> = {
                                service: "#3b82f6",
                                database: "#a855f7",
                                queue: "#f97316",
                                api: "#22c55e",
                                event: "#eab308",
                                external: "#6b7280",
                                default: "#64748b",
                            };
                            return colorMap[nodeType] || colorMap.default;
                        }}
                    />
                )}
            </ReactFlow>
        </div>
    );
}

// Helper to create nodes easily
export function createNode(
    id: string,
    label: string,
    position: { x: number; y: number },
    options: Partial<FlowNodeData> & { nodeType?: "service" | "event" } = {}
): Node {
    const { nodeType = "service", ...data } = options;
    return {
        id,
        type: nodeType,
        position,
        data: {
            label,
            ...data,
        } as FlowNodeData,
    };
}

// Helper to create edges easily
export function createEdge(
    source: string,
    target: string,
    options: Partial<Edge> = {}
): Edge {
    return {
        id: `${source}-${target}`,
        source,
        target,
        type: "smoothstep",
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed },
        ...options,
    };
}
