"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clustersApi } from "@/lib/api";
import type { CreateClusterRequest } from "@/types/api";
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
    const [formData, setFormData] = useState<CreateClusterRequest>({
        name: "",
        display_name: "",
        type_id: undefined,
        version: "",
        api_url: "",
        lifecycle_id: undefined,
    });

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
                            placeholder="e.g., Production EKS Cluster"
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
                            placeholder="Cluster display name"
                        />
                    </div>

                    {/* Cluster Type ID */}
                    <div className="space-y-2">
                        <Label htmlFor="type_id">Cluster Type ID</Label>
                        <Input
                            id="type_id"
                            type="number"
                            value={formData.type_id || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                handleChange(
                                    "type_id",
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                )
                            }
                            placeholder="Type ID"
                        />
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
