"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Calendar, User, Building2 } from "lucide-react";
import { HiCube, HiCog6Tooth, HiDocumentText } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
    SlideOverTabs,
    SlideOverDivider,
} from "@/components/ui/SlideOver";
import { VendorIcon } from "@/components/ui/TypeIcons";
import { hasVendorIcon } from "@/lib/icons/vendor-icons";
import { vendorsApi } from "@/lib/api";
import type { ClusterType, Vendor } from "@/types/api";

interface ClusterTypeDetailSlideOverProps {
    clusterType: ClusterType | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (clusterType: ClusterType) => void;
    onDelete?: (clusterType: ClusterType) => void;
    locale?: string;
}

export function ClusterTypeDetailSlideOver({
    clusterType,
    open,
    onClose,
    onEdit,
    onDelete,
    locale = "en",
}: ClusterTypeDetailSlideOverProps) {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Load related data
    useEffect(() => {
        if (!clusterType) return;

        const loadRelatedData = async () => {
            setLoading(true);
            try {
                if (clusterType.vendor_id) {
                    const vendorsRes = await vendorsApi.getAll(1);
                    const found = vendorsRes.data.find(
                        (v) => v.id === clusterType.vendor_id
                    );
                    setVendor(found || null);
                } else {
                    setVendor(null);
                }
            } catch (error) {
                console.error("Error loading related data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRelatedData();
    }, [clusterType]);

    // Reset tab when modal opens
    useEffect(() => {
        if (open) {
            setActiveTab("overview");
        }
    }, [open]);

    if (!clusterType) return null;

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(clusterType);
        } else {
            router.push(
                `/${locale}/infrastructure/cluster-types/${clusterType.id}/edit`
            );
        }
        onClose();
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(clusterType);
        }
    };

    // Tabs configuration
    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: <HiDocumentText className="h-4 w-4" />,
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
            title={clusterType.name}
            description={`Cluster Type ID: ${clusterType.id}`}
            size="lg"
            icon={<HiCube className="h-5 w-5" />}
            status={{
                label: clusterType.is_enabled ? "Enabled" : "Disabled",
                variant: clusterType.is_enabled ? "success" : "neutral",
            }}
            loading={loading}
            breadcrumbs={[
                { label: "Infrastructure" },
                { label: "Cluster Types" },
                { label: clusterType.name },
            ]}
            footer={
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-destructive hover:text-destructive hover:border-destructive gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                    <Button size="sm" onClick={handleEdit} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Cluster Type
                    </Button>
                </div>
            }
        >
            {/* Tabs Navigation */}
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
                        <div className="rounded-xl border border-border/60 bg-linear-to-br from-card to-muted/20 p-4 overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-linear-to-br from-cyan-500 to-cyan-600 p-2.5 shadow-lg shadow-cyan-500/20 shrink-0">
                                    <HiCube className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        Type ID
                                    </p>
                                    <p className="font-semibold font-mono">
                                        {clusterType.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-linear-to-br from-card to-muted/20 p-4 overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-linear-to-br from-purple-500 to-purple-600 p-2.5 shadow-lg shadow-purple-500/20 shrink-0">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        Vendor
                                    </p>
                                    <p
                                        className="font-semibold truncate"
                                        title={vendor?.name || "Not assigned"}
                                    >
                                        {vendor?.name || "Not assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* General Information */}
                    <SlideOverSection
                        title="General Information"
                        icon={<HiDocumentText className="h-4 w-4" />}
                        variant="card"
                    >
                        <SlideOverField
                            label="Name"
                            value={clusterType.name}
                            icon={<HiCube className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Status"
                            value={
                                <Badge
                                    variant={
                                        clusterType.is_enabled
                                            ? "success"
                                            : "secondary"
                                    }
                                >
                                    {clusterType.is_enabled
                                        ? "Enabled"
                                        : "Disabled"}
                                </Badge>
                            }
                        />
                        {clusterType.icon && (
                            <SlideOverField
                                label="Icon"
                                value={
                                    <div className="flex items-center gap-2">
                                        <HiCube className="h-5 w-5 text-cyan-500" />
                                        <span className="font-mono text-sm">
                                            {clusterType.icon}
                                        </span>
                                    </div>
                                }
                            />
                        )}
                    </SlideOverSection>

                    <SlideOverDivider />

                    {/* Vendor Information */}
                    <SlideOverSection
                        title="Vendor"
                        icon={<Building2 className="h-4 w-4" />}
                        variant="default"
                        collapsible
                        defaultCollapsed={false}
                    >
                        {vendor ? (
                            <>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-xs text-muted-foreground">
                                        Vendor Name
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {hasVendorIcon(vendor.name) ? (
                                            <VendorIcon
                                                name={vendor.name}
                                                className="h-5 w-5"
                                            />
                                        ) : (
                                            <Building2 className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {vendor.name}
                                        </span>
                                    </div>
                                </div>
                                <SlideOverField
                                    label="Vendor ID"
                                    value={vendor.id.toString()}
                                    copyable
                                />
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground py-2">
                                No vendor associated with this cluster type.
                            </p>
                        )}
                    </SlideOverSection>
                </>
            )}

            {/* Metadata Tab */}
            {activeTab === "metadata" && (
                <>
                    <SlideOverSection
                        title="Timestamps"
                        icon={<Calendar className="h-4 w-4" />}
                        variant="card"
                    >
                        <SlideOverField
                            label="Created At"
                            value={formatDate(clusterType.created_at)}
                            icon={<Calendar className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Last Updated"
                            value={formatDate(clusterType.updated_at)}
                            icon={<Calendar className="h-4 w-4" />}
                        />
                    </SlideOverSection>

                    <SlideOverSection
                        title="User References"
                        icon={<User className="h-4 w-4" />}
                        variant="default"
                        collapsible
                    >
                        <SlideOverField
                            label="Created By"
                            value={
                                clusterType.created_by
                                    ? `User #${clusterType.created_by}`
                                    : "System"
                            }
                            icon={<User className="h-4 w-4" />}
                        />
                        <SlideOverField
                            label="Updated By"
                            value={
                                clusterType.updated_by
                                    ? `User #${clusterType.updated_by}`
                                    : "System"
                            }
                            icon={<User className="h-4 w-4" />}
                        />
                    </SlideOverSection>

                    <SlideOverSection
                        title="Internal IDs"
                        icon={<HiCog6Tooth className="h-4 w-4" />}
                        variant="minimal"
                    >
                        <SlideOverField
                            label="Cluster Type ID"
                            value={clusterType.id.toString()}
                            copyable
                        />
                        {clusterType.vendor_id && (
                            <SlideOverField
                                label="Vendor ID"
                                value={clusterType.vendor_id.toString()}
                                copyable
                            />
                        )}
                    </SlideOverSection>
                </>
            )}
        </SlideOver>
    );
}
