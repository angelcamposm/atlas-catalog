"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    clustersApi,
    clusterTypesApi,
    lifecyclesApi,
    infrastructureTypesApi,
    vendorsApi,
} from "@/lib/api";
import type {
    UpdateClusterRequest,
    ClusterType,
    Lifecycle,
    InfrastructureType,
    Vendor,
    Cluster,
} from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    ClusterTypeIcon,
    InfrastructureTypeIcon,
} from "@/components/ui/TypeIcons";

interface EditClusterFormProps {
    cluster: Cluster;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EditClusterForm({
    cluster,
    onSuccess,
    onCancel,
}: EditClusterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clusterTypes, setClusterTypes] = useState<ClusterType[]>([]);
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [infrastructureTypes, setInfrastructureTypes] = useState<
        InfrastructureType[]
    >([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [formData, setFormData] = useState<UpdateClusterRequest>({
        name: cluster.name,
        display_name: cluster.display_name || "",
        type_id: cluster.type_id ?? undefined,
        version: cluster.version || "",
        api_url: cluster.api_url || "",
        url: cluster.url || "",
        lifecycle_id: cluster.lifecycle_id ?? undefined,
        infrastructure_type_id: cluster.infrastructure_type_id ?? undefined,
        vendor_id: cluster.vendor_id ?? undefined,
        has_licensing: cluster.has_licensing || false,
        licensing_model: cluster.licensing_model || "none",
        timezone: cluster.timezone || "",
        cluster_uuid: cluster.cluster_uuid || "",
    });

    // Valid licensing models from backend K8sLicensingModel enum
    const licensingModels = [
        { value: "none", label: "None" },
        { value: "openshift", label: "OpenShift" },
    ];

    useEffect(() => {
        loadFormData();
    }, []);

    const loadFormData = async () => {
        try {
            const [typesRes, lifecyclesRes, infraTypesRes, vendorsRes] =
                await Promise.all([
                    clusterTypesApi.getAll(1),
                    lifecyclesApi.getAll(1),
                    infrastructureTypesApi.getAll(1),
                    vendorsApi.getAll(1),
                ]);
            setClusterTypes(typesRes.data);
            setLifecycles(lifecyclesRes.data);
            setInfrastructureTypes(infraTypesRes.data);
            setVendors(vendorsRes.data);
        } catch (err) {
            console.error("Error loading form data:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await clustersApi.update(cluster.id, formData);
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Error updating cluster:", err);
            alert("Failed to update cluster. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        field: keyof UpdateClusterRequest,
        value: string | number | boolean | undefined
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Cluster</CardTitle>
                <CardDescription>
                    Update the details of this Kubernetes cluster
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            required
                            value={formData.name || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("name", e.target.value)}
                            placeholder="e.g., prod-eks-cluster"
                        />
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            id="display_name"
                            value={formData.display_name || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("display_name", e.target.value)}
                            placeholder="Production EKS Cluster"
                        />
                    </div>

                    {/* Cluster Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type_id">Cluster Type</Label>
                        <Select
                            value={formData.type_id?.toString() || ""}
                            onValueChange={(value) =>
                                handleChange(
                                    "type_id",
                                    value ? parseInt(value) : undefined
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select cluster type" />
                            </SelectTrigger>
                            <SelectContent>
                                {clusterTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={type.id.toString()}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ClusterTypeIcon
                                                name={type.name}
                                                iconClass={type.icon}
                                                size="sm"
                                            />
                                            {type.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Infrastructure Type */}
                    <div className="space-y-2">
                        <Label htmlFor="infrastructure_type_id">
                            Infrastructure Type
                        </Label>
                        <Select
                            value={
                                formData.infrastructure_type_id?.toString() ||
                                ""
                            }
                            onValueChange={(value) =>
                                handleChange(
                                    "infrastructure_type_id",
                                    value ? parseInt(value) : undefined
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select infrastructure type" />
                            </SelectTrigger>
                            <SelectContent>
                                {infrastructureTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={type.id.toString()}
                                    >
                                        <span className="flex items-center gap-2">
                                            <InfrastructureTypeIcon
                                                name={type.name}
                                                size="sm"
                                            />
                                            {type.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Vendor */}
                    <div className="space-y-2">
                        <Label htmlFor="vendor_id">Vendor</Label>
                        <Select
                            value={formData.vendor_id?.toString() || ""}
                            onValueChange={(value) =>
                                handleChange(
                                    "vendor_id",
                                    value ? parseInt(value) : undefined
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.map((vendor) => (
                                    <SelectItem
                                        key={vendor.id}
                                        value={vendor.id.toString()}
                                    >
                                        {vendor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lifecycle */}
                    <div className="space-y-2">
                        <Label htmlFor="lifecycle_id">Lifecycle</Label>
                        <Select
                            value={formData.lifecycle_id?.toString() || ""}
                            onValueChange={(value) =>
                                handleChange(
                                    "lifecycle_id",
                                    value ? parseInt(value) : undefined
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select lifecycle" />
                            </SelectTrigger>
                            <SelectContent>
                                {lifecycles.map((lifecycle) => (
                                    <SelectItem
                                        key={lifecycle.id}
                                        value={lifecycle.id.toString()}
                                    >
                                        {lifecycle.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Version */}
                    <div className="space-y-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                            id="version"
                            value={formData.version || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("version", e.target.value)}
                            placeholder="e.g., 1.28.0"
                        />
                    </div>

                    {/* API URL */}
                    <div className="space-y-2">
                        <Label htmlFor="api_url">API URL</Label>
                        <Input
                            id="api_url"
                            type="url"
                            value={formData.api_url || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("api_url", e.target.value)}
                            placeholder="https://api.cluster.example.com"
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={formData.url || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("url", e.target.value)}
                            placeholder="https://cluster.example.com"
                        />
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                            id="timezone"
                            value={formData.timezone || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("timezone", e.target.value)}
                            placeholder="e.g., UTC, America/New_York"
                        />
                    </div>

                    {/* Cluster UUID */}
                    <div className="space-y-2">
                        <Label htmlFor="cluster_uuid">Cluster UUID</Label>
                        <Input
                            id="cluster_uuid"
                            value={formData.cluster_uuid || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("cluster_uuid", e.target.value)}
                            placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                        />
                    </div>

                    {/* Has Licensing */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has_licensing"
                            checked={formData.has_licensing || false}
                            onCheckedChange={(checked) =>
                                handleChange("has_licensing", checked)
                            }
                        />
                        <Label htmlFor="has_licensing">Has Licensing</Label>
                    </div>

                    {/* Licensing Model (shown if has_licensing is true) */}
                    {formData.has_licensing && (
                        <div className="space-y-2">
                            <Label htmlFor="licensing_model">
                                Licensing Model
                            </Label>
                            <Select
                                value={formData.licensing_model || "none"}
                                onValueChange={(value) =>
                                    handleChange("licensing_model", value)
                                }
                            >
                                <SelectTrigger id="licensing_model">
                                    <SelectValue placeholder="Select licensing model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {licensingModels.map((model) => (
                                        <SelectItem
                                            key={model.value}
                                            value={model.value}
                                        >
                                            {model.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
