"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { HiCircleStack, HiMagnifyingGlass, HiFunnel } from "react-icons/hi2";
import { resourcesApi, resourceCategoriesApi } from "@/lib/api";
import type { Resource, ResourceCategory } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ResourceCard } from "./ResourceCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResourceListProps {
    onSelectResource?: (resource: Resource) => void;
    showFilters?: boolean;
}

export function ResourceList({
    onSelectResource,
    showFilters = true,
}: ResourceListProps) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Create category lookup map
    const categoryMap = useMemo(() => {
        return new Map(categories.map((c) => [c.id, c]));
    }, [categories]);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await resourceCategoriesApi.getAll(1);
                setCategories(response.data);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };
        loadCategories();
    }, []);

    const loadResources = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await resourcesApi.getAll(page);
            setResources(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading resources"
            );
            console.error("Error loading resources:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadResources();
    }, [loadResources]);

    // Filter resources
    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch =
                !searchQuery ||
                resource.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                resource.type_id?.toString() === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [resources, searchQuery, selectedCategory]);

    if (loading) {
        return (
            <div className="space-y-4">
                {showFilters && (
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={loadResources}
                    className="mt-2"
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <EmptyState
                icon={<HiCircleStack className="h-12 w-12" />}
                title="No resources yet"
                description="Resources represent infrastructure components like databases, caches, message queues, and storage systems."
                actionLabel="Add First Resource"
                onAction={() => console.log("Add resource")}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            {showFilters && (
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-50 max-w-sm">
                        <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-45">
                            <HiFunnel className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
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
                </div>
            )}

            {/* Resource Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        category={
                            resource.type_id
                                ? categoryMap.get(resource.type_id)
                                : null
                        }
                        onClick={() => onSelectResource?.(resource)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Empty filtered state */}
            {filteredResources.length === 0 && resources.length > 0 && (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                        No resources match your filters
                    </p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                        }}
                    >
                        Clear filters
                    </Button>
                </div>
            )}
        </div>
    );
}
