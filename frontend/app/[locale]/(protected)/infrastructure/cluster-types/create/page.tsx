"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiCube, HiArrowLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clusterTypesApi } from "@/lib/api/infrastructure";

export default function CreateClusterTypePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        licensing_model: "open_source" as "open_source" | "commercial" | "hybrid",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await clusterTypesApi.create(formData);
            router.push("/infrastructure/cluster-types");
        } catch (error) {
            console.error("Failed to create cluster type:", error);
            alert("Failed to create cluster type");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <HiArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <HiCube className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Create Cluster Type
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Define a new cluster type configuration
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="e.g., Kubernetes, OpenShift"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Describe this cluster type..."
                            rows={4}
                        />
                    </div>

                    {/* Licensing Model */}
                    <div className="space-y-2">
                        <Label htmlFor="licensing_model">
                            Licensing Model <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="licensing_model"
                            required
                            value={formData.licensing_model}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    licensing_model: e.target.value as any,
                                })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="open_source">Open Source</option>
                            <option value="commercial">Commercial</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Select the licensing model for this cluster type
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Creating..." : "Create Cluster Type"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
