"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformsApi } from "@/lib/api";
import type { CreatePlatformRequest } from "@/types/api";
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

interface CreatePlatformFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreatePlatformForm({
    onSuccess,
    onCancel,
}: CreatePlatformFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreatePlatformRequest>({
        name: "",
        description: "",
        version: "",
        url: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await platformsApi.create(formData);
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Error creating platform:", err);
            alert("Failed to create platform. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        field: keyof CreatePlatformRequest,
        value: string | boolean
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Platform</CardTitle>
                <CardDescription>
                    Add a new platform to your catalog
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
                            placeholder="e.g., Customer Portal"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => handleChange("description", e.target.value)}
                            placeholder="Describe the platform..."
                            rows={3}
                        />
                    </div>

                    {/* Version */}
                    <div className="space-y-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                            id="version"
                            value={formData.version}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("version", e.target.value)}
                            placeholder="e.g., 1.0.0"
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={formData.url}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("url", e.target.value)}
                            placeholder="https://platform.example.com"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Platform"}
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
