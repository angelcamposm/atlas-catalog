"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Edit,
    Trash2,
    ExternalLink,
    Copy,
    Check,
    Globe,
    Clock,
    Tag,
    Shield,
    Calendar,
    User,
} from "lucide-react";
import {
    HiServerStack,
    HiCpuChip,
    HiCloud,
    HiCog6Tooth,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
    SlideOverTabs,
    SlideOverDivider,
} from "@/components/ui/SlideOver";
import {
    ClusterTypeIcon,
    InfrastructureTypeIcon,
} from "@/components/ui/TypeIcons";
import {
    clustersApi,
    clusterTypesApi,
    lifecyclesApi,
    infrastructureTypesApi,
    vendorsApi,
} from "@/lib/api";
import type {
    Cluster,
    ClusterType,
    Lifecycle,
    InfrastructureType,
    Vendor,
} from "@/types/api";

interface ClusterDetailSlideOverProps {
    cluster: Cluster | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (cluster: Cluster) => void;
    onDelete?: (cluster: Cluster) => void;
    locale?: string;
}

export function ClusterDetailSlideOver({
    cluster,
    open,
    onClose,
    onEdit,
    onDelete,
    locale = "en",
}: ClusterDetailSlideOverProps) {
    const router = useRouter();
    const [clusterType, setClusterType] = useState<ClusterType | null>(null);
    const [lifecycle, setLifecycle] = useState<Lifecycle | null>(null);
    const [infrastructureType, setInfrastructureType] =
        useState<InfrastructureType | null>(null);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Load related data
    useEffect(() => {
        if (!cluster) return;

        const loadRelatedData = async () => {
            setLoading(true);
            try {
                const [typesRes, lifecyclesRes, infraTypesRes, vendorsRes] =
                    await Promise.all([
                        clusterTypesApi.getAll(1),
                        lifecyclesApi.getAll(1),
                        infrastructureTypesApi.getAll(1),
                        vendorsApi.getAll(1),
                    ]);

                if (cluster.type_id) {
                    const found = typesRes.data.find(
                        (t) => t.id === cluster.type_id
                    );
                    setClusterType(found || null);
                }
                if (cluster.lifecycle_id) {
                    const found = lifecyclesRes.data.find(
                        (l) => l.id === cluster.lifecycle_id
                    );
                    setLifecycle(found || null);
                }
                if (cluster.infrastructure_type_id) {
                    const found = infraTypesRes.data.find(
                        (i) => i.id === cluster.infrastructure_type_id
                    );
                    setInfrastructureType(found || null);
                }
                if (cluster.vendor_id) {
                    const found = vendorsRes.data.find(
                        (v) => v.id === cluster.vendor_id
                    );
                    setVendor(found || null);
                }
            } catch (err) {
                console.error("Error loading related data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadRelatedData();
    }, [cluster]);

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleEdit = () => {
        if (cluster) {
            if (onEdit) {
                onEdit(cluster);
            } else {
                router.push(
                    `/${locale}/infrastructure/clusters/${cluster.id}/edit`
                );
                onClose();
            }
        }
    };

    const handleDelete = async () => {
        if (!cluster) return;

        if (!confirm("Are you sure you want to delete this cluster?")) {
            return;
        }

        try {
            await clustersApi.delete(cluster.id);
            onDelete?.(cluster);
            onClose();
        } catch (err) {
            console.error("Error deleting cluster:", err);
            alert("Failed to delete cluster");
        }
    };

    if (!cluster) return null;

    // Determine cluster status
    const getLifecycleStatus = () => {
        if (!lifecycle)
            return { label: "Unknown", variant: "neutral" as const };
        const name = lifecycle.name.toLowerCase();
        if (name.includes("production") || name.includes("prod")) {
            return { label: "Production", variant: "success" as const };
        }
        if (name.includes("staging") || name.includes("test")) {
            return { label: "Staging", variant: "warning" as const };
        }
        if (name.includes("dev") || name.includes("development")) {
            return { label: "Development", variant: "info" as const };
        }
        if (name.includes("deprecated") || name.includes("retired")) {
            return { label: "Deprecated", variant: "danger" as const };
        }
        return { label: lifecycle.name, variant: "neutral" as const };
    };

    const footer = (
        <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
                ID: {cluster.id}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="gap-2"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
    );

    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: <HiServerStack className="h-4 w-4" />,
        },
        {
            id: "technical",
            label: "Technical",
            icon: <HiCog6Tooth className="h-4 w-4" />,
        },
        {
            id: "metadata",
            label: "Metadata",
            icon: <Calendar className="h-4 w-4" />,
        },
    ];

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={cluster.name}
            description={
                cluster.display_name ||
                `Kubernetes cluster managed by ${vendor?.name || "Unknown"}`
            }
            size="xl"
            footer={footer}
            loading={loading}
            status={getLifecycleStatus()}
            icon={
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-500/20">
                    <HiServerStack className="h-6 w-6 text-white" />
                </div>
            }
            breadcrumbs={[
                { label: "Infrastructure" },
                { label: "Clusters" },
                { label: cluster.name },
            ]}
        >
            {/* Tabs */}
            <SlideOverTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <>
                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <HiCpuChip className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wide">
                                    Type
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {clusterType ? (
                                    <>
                                        <ClusterTypeIcon
                                            name={clusterType.name}
                                            iconClass={clusterType.icon}
                                            size="sm"
                                        />
                                        <span className="font-semibold">
                                            {clusterType.name}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">
                                        —
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <HiCloud className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wide">
                                    Infrastructure
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {infrastructureType ? (
                                    <>
                                        <InfrastructureTypeIcon
                                            name={infrastructureType.name}
                                            size="sm"
                                        />
                                        <span className="font-semibold">
                                            {infrastructureType.name}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">
                                        —
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Version Info */}
                    <SlideOverSection
                        title="Version Information"
                        variant="card"
                    >
                        <div className="space-y-1">
                            <SlideOverField
                                label="Version"
                                value={cluster.version}
                                size="sm"
                            />
                            <SlideOverField
                                label="Full Version"
                                value={cluster.full_version}
                                variant="code"
                                size="sm"
                            />
                            <SlideOverField
                                label="Vendor"
                                value={vendor?.name}
                                size="sm"
                            />
                        </div>
                    </SlideOverSection>

                    {/* Endpoints */}
                    <SlideOverSection
                        title="Endpoints"
                        icon={<Globe className="h-4 w-4" />}
                    >
                        {cluster.api_url && (
                            <div className="mb-3 rounded-lg border border-border/40 bg-muted/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        API URL
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    cluster.api_url!,
                                                    "api_url"
                                                )
                                            }
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === "api_url" ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                        <a
                                            href={cluster.api_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-all"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                                <code className="block text-xs font-mono text-foreground break-all">
                                    {cluster.api_url}
                                </code>
                            </div>
                        )}
                        {cluster.url && (
                            <div className="rounded-lg border border-border/40 bg-muted/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Console URL
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                handleCopy(cluster.url!, "url")
                                            }
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === "url" ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                        <a
                                            href={cluster.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-all"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                                <code className="block text-xs font-mono text-foreground break-all">
                                    {cluster.url}
                                </code>
                            </div>
                        )}
                        {!cluster.api_url && !cluster.url && (
                            <p className="text-sm text-muted-foreground italic">
                                No endpoints configured
                            </p>
                        )}
                    </SlideOverSection>

                    {/* Licensing */}
                    <SlideOverSection
                        title="Licensing"
                        icon={<Shield className="h-4 w-4" />}
                        variant="card"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                License Status
                            </span>
                            <Badge
                                variant={
                                    cluster.has_licensing
                                        ? "success"
                                        : "secondary"
                                }
                            >
                                {cluster.has_licensing
                                    ? "Licensed"
                                    : "No License"}
                            </Badge>
                        </div>
                        {cluster.has_licensing && cluster.licensing_model && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                                <span className="text-sm text-muted-foreground">
                                    Model
                                </span>
                                <span className="text-sm font-medium">
                                    {cluster.licensing_model}
                                </span>
                            </div>
                        )}
                    </SlideOverSection>
                </>
            )}

            {/* Technical Tab */}
            {activeTab === "technical" && (
                <>
                    {/* UUID */}
                    {cluster.cluster_uuid && (
                        <SlideOverSection
                            title="Cluster UUID"
                            variant="minimal"
                        >
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/40">
                                <code className="flex-1 text-xs font-mono break-all">
                                    {cluster.cluster_uuid}
                                </code>
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            cluster.cluster_uuid!,
                                            "uuid"
                                        )
                                    }
                                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                    title="Copy to clipboard"
                                >
                                    {copiedField === "uuid" ? (
                                        <Check className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </SlideOverSection>
                    )}

                    {/* Technical Details */}
                    <SlideOverSection
                        title="Configuration"
                        icon={<HiCog6Tooth className="h-4 w-4" />}
                    >
                        <SlideOverField
                            label="Timezone"
                            value={cluster.timezone}
                            icon={<Clock className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Lifecycle"
                            value={lifecycle?.name}
                        />
                    </SlideOverSection>

                    {/* Tags */}
                    <SlideOverSection
                        title="Tags"
                        icon={<Tag className="h-4 w-4" />}
                        variant="card"
                    >
                        {cluster.tags ? (
                            <div className="flex flex-wrap gap-2">
                                {cluster.tags.split(",").map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {tag.trim()}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                No tags assigned
                            </p>
                        )}
                    </SlideOverSection>
                </>
            )}

            {/* Metadata Tab */}
            {activeTab === "metadata" && (
                <>
                    <SlideOverSection
                        title="Creation"
                        icon={<Calendar className="h-4 w-4" />}
                    >
                        <SlideOverField
                            label="Created At"
                            value={
                                cluster.created_at
                                    ? new Date(
                                          cluster.created_at
                                      ).toLocaleString()
                                    : undefined
                            }
                            icon={<Calendar className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Created By"
                            value={
                                cluster.created_by
                                    ? `User #${cluster.created_by}`
                                    : undefined
                            }
                            icon={<User className="h-4 w-4" />}
                        />
                    </SlideOverSection>

                    <SlideOverDivider />

                    <SlideOverSection
                        title="Last Update"
                        icon={<Clock className="h-4 w-4" />}
                    >
                        <SlideOverField
                            label="Updated At"
                            value={
                                cluster.updated_at
                                    ? new Date(
                                          cluster.updated_at
                                      ).toLocaleString()
                                    : undefined
                            }
                            icon={<Calendar className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Updated By"
                            value={
                                cluster.updated_by
                                    ? `User #${cluster.updated_by}`
                                    : undefined
                            }
                            icon={<User className="h-4 w-4" />}
                        />
                    </SlideOverSection>
                </>
            )}
        </SlideOver>
    );
}

export default ClusterDetailSlideOver;
