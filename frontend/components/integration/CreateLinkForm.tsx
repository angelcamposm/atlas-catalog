"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { linksApi, linkTypesApi } from "@/lib/api";
import type { CreateLinkRequest, LinkType } from "@/types/api";
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

interface CreateLinkFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateLinkForm({ onSuccess, onCancel }: CreateLinkFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [linkTypes, setLinkTypes] = useState<LinkType[]>([]);
    const [formData, setFormData] = useState<CreateLinkRequest>({
        name: "",
        description: "",
        type_id: undefined,
        model_name: "",
        model_id: undefined,
        url: "",
    });

    useEffect(() => {
        loadLinkTypes();
    }, []);

    const loadLinkTypes = async () => {
        try {
            const response = await linkTypesApi.getAll(1);
            setLinkTypes(response.data);
        } catch (err) {
            console.error("Error loading link types:", err);
        }
    };

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

    const handleChange = (
        field: keyof CreateLinkRequest,
        value: string | number | undefined
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Link</CardTitle>
                <CardDescription>
                    Create a new link between components
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name ?? ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("name", e.target.value)}
                            placeholder="e.g., API Integration"
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

                    {/* Link Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type_id">Link Type</Label>
                        <Select
                            value={
                                formData.type_id
                                    ? String(formData.type_id)
                                    : undefined
                            }
                            onValueChange={(value) =>
                                handleChange("type_id", parseInt(value))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select link type" />
                            </SelectTrigger>
                            <SelectContent>
                                {linkTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={String(type.id)}
                                    >
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={formData.url ?? ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("url", e.target.value)}
                            placeholder="https://example.com/link"
                        />
                    </div>

                    {/* Model Name */}
                    <div className="space-y-2">
                        <Label htmlFor="model_name">Model Name</Label>
                        <Input
                            id="model_name"
                            value={formData.model_name ?? ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange("model_name", e.target.value)}
                            placeholder="e.g., Component"
                        />
                    </div>

                    {/* Model ID */}
                    <div className="space-y-2">
                        <Label htmlFor="model_id">Model ID</Label>
                        <Input
                            id="model_id"
                            type="number"
                            value={formData.model_id ?? ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                handleChange(
                                    "model_id",
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                )
                            }
                            placeholder="e.g., 1"
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
