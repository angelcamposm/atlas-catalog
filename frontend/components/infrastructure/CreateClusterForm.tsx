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
    CreateClusterRequest,
    ClusterType,
    Lifecycle,
    InfrastructureType,
    Vendor,
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

interface CreateClusterFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateClusterForm({
    onSuccess,
    onCancel,
}: CreateClusterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clusterTypes, setClusterTypes] = useState<ClusterType[]>([]);
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [infrastructureTypes, setInfrastructureTypes] = useState<
        InfrastructureType[]
    >([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [formData, setFormData] = useState<CreateClusterRequest>({
        name: "",
        display_name: "",
        type_id: undefined,
        version: "",
        api_url: "",
        url: "",
        lifecycle_id: undefined,
        infrastructure_type_id: undefined,
        vendor_id: undefined,
        has_licensing: false,
        licensing_model: "none",
        timezone: "",
        cluster_uuid: "",
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
            await clustersApi.create(formData);
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Error creating cluster:", err);
            alert("Failed to create cluster. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        field: keyof CreateClusterRequest,
        value: string | number | boolean | undefined
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Cluster</CardTitle>
                <CardDescription>
                    Add a new Kubernetes cluster to your infrastructure
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
                            value={formData.name}
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
                                        {type.name}
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
                                        {type.name}
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
                            {loading ? "Creating..." : "Create Cluster"}
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
