"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clustersApi, clusterTypesApi } from "@/lib/api";
import type { CreateClusterRequest, ClusterType } from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    const [formData, setFormData] = useState<CreateClusterRequest>({
        name: "",
        description: "",
        cluster_type_id: 0,
        version: "",
        endpoint: "",
        is_active: true,
    });

    useEffect(() => {
        loadClusterTypes();
    }, []);

    const loadClusterTypes = async () => {
        try {
            const response = await clusterTypesApi.getAll(1);
            setClusterTypes(response.data);
        } catch (err) {
            console.error("Error loading cluster types:", err);
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
        value: string | number | boolean
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("name", e.target.value)
                            }
                            placeholder="e.g., Production EKS Cluster"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleChange("description", e.target.value)
                            }
                            placeholder="Describe the cluster..."
                            rows={3}
                        />
                    </div>

                    {/* Cluster Type */}
                    <div className="space-y-2">
                        <Label htmlFor="cluster_type_id">
                            Cluster Type{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.cluster_type_id.toString()}
                            onValueChange={(value: string) =>
                                handleChange("cluster_type_id", parseInt(value))
                            }
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a cluster type" />
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

                    {/* Version */}
                    <div className="space-y-2">
                        <Label htmlFor="version">
                            Version <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="version"
                            required
                            value={formData.version}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("version", e.target.value)
                            }
                            placeholder="e.g., 1.28.0"
                        />
                    </div>

                    {/* Endpoint */}
                    <div className="space-y-2">
                        <Label htmlFor="endpoint">
                            Endpoint <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="endpoint"
                            type="url"
                            required
                            value={formData.endpoint}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange("endpoint", e.target.value)
                            }
                            placeholder="https://api.cluster.example.com"
                        />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked: boolean) =>
                                handleChange("is_active", checked)
                            }
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

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
