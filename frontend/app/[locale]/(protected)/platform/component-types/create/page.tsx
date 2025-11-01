"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiCube, HiArrowLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { componentTypesApi } from "@/lib/api/platform";

export default function CreateComponentTypePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await componentTypesApi.create(formData);
            router.push("/platform/component-types");
        } catch (error) {
            console.error("Failed to create component type:", error);
            alert("Failed to create component type");
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
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <HiCube className="h-8 w-8 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Create Component Type
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Define a new platform component type
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
                            placeholder="e.g., Database, Cache, Queue"
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
                            placeholder="Describe this component type..."
                            rows={4}
                        />
                    </div>

                    {/* Icon */}
                    <div className="space-y-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Input
                            id="icon"
                            type="text"
                            value={formData.icon}
                            onChange={(e) =>
                                setFormData({ ...formData, icon: e.target.value })
                            }
                            placeholder="e.g., database, cache, queue"
                        />
                        <p className="text-xs text-muted-foreground">
                            Optional icon identifier for this component type
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Creating..." : "Create Component Type"}
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
