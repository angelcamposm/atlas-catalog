"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { linksApi, linkTypesApi } from "@/lib/api";
import type { CreateLinkRequest, LinkType } from "@/types/api";
import { Protocol, CommunicationStyle } from "@/types/api";
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
        link_type_id: 0,
        source_type: "",
        source_id: 0,
        target_type: "",
        target_id: 0,
        protocol: "https",
        communication_style: "synchronous",
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
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Integration Link</CardTitle>
                <CardDescription>
                    Create a new integration link between components
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
                            placeholder="e.g., API to Database Connection"
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
                            placeholder="Describe the integration link..."
                            rows={3}
                        />
                    </div>

                    {/* Link Type */}
                    <div className="space-y-2">
                        <Label htmlFor="link_type_id">
                            Link Type{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.link_type_id.toString()}
                            onValueChange={(value: string) =>
                                handleChange("link_type_id", parseInt(value))
                            }
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a link type" />
                            </SelectTrigger>
                            <SelectContent>
                                {linkTypes.map((type) => (
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Source Type */}
                        <div className="space-y-2">
                            <Label htmlFor="source_type">
                                Source Type{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="source_type"
                                required
                                value={formData.source_type}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange("source_type", e.target.value)
                                }
                                placeholder="e.g., Api"
                            />
                        </div>

                        {/* Source ID */}
                        <div className="space-y-2">
                            <Label htmlFor="source_id">
                                Source ID{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="source_id"
                                type="number"
                                required
                                min="1"
                                value={formData.source_id}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "source_id",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>

                        {/* Target Type */}
                        <div className="space-y-2">
                            <Label htmlFor="target_type">
                                Target Type{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="target_type"
                                required
                                value={formData.target_type}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange("target_type", e.target.value)
                                }
                                placeholder="e.g., Database"
                            />
                        </div>

                        {/* Target ID */}
                        <div className="space-y-2">
                            <Label htmlFor="target_id">
                                Target ID{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="target_id"
                                type="number"
                                required
                                min="1"
                                value={formData.target_id}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "target_id",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>

                        {/* Protocol */}
                        <div className="space-y-2">
                            <Label htmlFor="protocol">
                                Protocol{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.protocol}
                                onValueChange={(value: string) =>
                                    handleChange("protocol", value as Protocol)
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select protocol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Protocol.HTTP}>
                                        HTTP
                                    </SelectItem>
                                    <SelectItem value={Protocol.HTTPS}>
                                        HTTPS
                                    </SelectItem>
                                    <SelectItem value={Protocol.GRPC}>
                                        gRPC
                                    </SelectItem>
                                    <SelectItem value={Protocol.TCP}>
                                        TCP
                                    </SelectItem>
                                    <SelectItem value={Protocol.UDP}>
                                        UDP
                                    </SelectItem>
                                    <SelectItem value={Protocol.WebSocket}>
                                        WebSocket
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Communication Style */}
                        <div className="space-y-2">
                            <Label htmlFor="communication_style">
                                Communication Style{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.communication_style}
                                onValueChange={(value: string) =>
                                    handleChange(
                                        "communication_style",
                                        value as CommunicationStyle
                                    )
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value={CommunicationStyle.Synchronous}
                                    >
                                        Synchronous
                                    </SelectItem>
                                    <SelectItem
                                        value={CommunicationStyle.Asynchronous}
                                    >
                                        Asynchronous
                                    </SelectItem>
                                    <SelectItem
                                        value={CommunicationStyle.EventDriven}
                                    >
                                        Event-Driven
                                    </SelectItem>
                                    <SelectItem
                                        value={CommunicationStyle.Batch}
                                    >
                                        Batch
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
