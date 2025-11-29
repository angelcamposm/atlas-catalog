"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { linksApi } from "@/lib/api";
import type { CreateLinkRequest } from "@/types/api";
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

interface CreateLinkFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateLinkForm({ onSuccess, onCancel }: CreateLinkFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateLinkRequest>({
        name: "",
        description: "",
        url: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await linksApi.create(formData);
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Error creating link:", err);
            alert("Failed to create link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CreateLinkRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Link</CardTitle>
                <CardDescription>Create a new link resource</CardDescription>
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
                            placeholder="e.g., API Documentation"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description ?? ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => handleChange("description", e.target.value)}
                            placeholder="Describe the link..."
                            rows={3}
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">
                            URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="url"
                            type="url"
                            required
                            value={formData.url}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("url", e.target.value)}
                            placeholder="https://example.com/docs"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Link"}
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
