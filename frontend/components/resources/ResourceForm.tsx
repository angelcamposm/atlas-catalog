"use client";

import { useState, useEffect, FormEvent } from "react";
import { HiCircleStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { resourceCategoriesApi } from "@/lib/api";
import type {
    Resource,
    ResourceCategory,
    CreateResourceRequest,
} from "@/types/api";

interface ResourceFormProps {
    resource?: Resource | null;
    onSubmit: (data: CreateResourceRequest) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ResourceForm({
    resource,
    onSubmit,
    onCancel,
    isLoading = false,
}: ResourceFormProps) {
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Form state
    const [name, setName] = useState(resource?.name || "");
    const [typeId, setTypeId] = useState(resource?.type_id?.toString() || "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await resourceCategoriesApi.getAll(1);
                setCategories(response.data);
            } catch (err) {
                console.error("Error loading categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    // Update form when resource changes
    useEffect(() => {
        if (resource) {
            setName(resource.name || "");
            setTypeId(resource.type_id?.toString() || "");
        }
    }, [resource]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const payload: CreateResourceRequest = {
            name: name.trim(),
            type_id: typeId ? parseInt(typeId, 10) : undefined,
        };
        onSubmit(payload);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <HiCircleStack className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>
                            {resource ? "Edit Resource" : "Create Resource"}
                        </CardTitle>
                        <CardDescription>
                            {resource
                                ? "Update the resource details"
                                : "Add a new infrastructure resource to the catalog"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., PostgreSQL Database"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Category/Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type_id">Category</Label>
                        <Select
                            value={typeId}
                            onValueChange={setTypeId}
                            disabled={loadingCategories}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loadingCategories
                                            ? "Loading categories..."
                                            : "Select a category"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Select the type of resource (Database, Cache, Queue,
                            etc.)
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? "Saving..."
                                : resource
                                ? "Update Resource"
                                : "Create Resource"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
