"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ResourceList, ResourceDetailSlideOver } from "@/components/resources";
import { resourceCategoriesApi } from "@/lib/api";
import type { Resource, ResourceCategory } from "@/types/api";
import { useEffect, useMemo } from "react";

export default function ResourcesPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "en";

    const [selectedResource, setSelectedResource] = useState<Resource | null>(
        null
    );
    const [slideOverOpen, setSlideOverOpen] = useState(false);
    const [categories, setCategories] = useState<ResourceCategory[]>([]);

    // Load categories for the slide over
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

    const categoryMap = useMemo(() => {
        return new Map(categories.map((c) => [c.id, c]));
    }, [categories]);

    const handleSelectResource = (resource: Resource) => {
        setSelectedResource(resource);
        setSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setSlideOverOpen(false);
        setTimeout(() => setSelectedResource(null), 300);
    };

    const handleEditResource = (resource: Resource) => {
        router.push(`/${locale}/resources/${resource.id}/edit`);
        handleCloseSlideOver();
    };

    const handleDeleteResource = () => {
        router.refresh();
    };

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Resources"
                subtitle="Manage databases, caches, queues, and other infrastructure resources"
                actions={
                    <Link href={`/${locale}/resources/new`}>
                        <Button>
                            <HiPlus className="mr-2 h-4 w-4" />
                            Add Resource
                        </Button>
                    </Link>
                }
            />

            <ResourceList onSelectResource={handleSelectResource} />

            <ResourceDetailSlideOver
                resource={selectedResource}
                category={
                    selectedResource?.type_id
                        ? categoryMap.get(selectedResource.type_id)
                        : null
                }
                open={slideOverOpen}
                onClose={handleCloseSlideOver}
                onEdit={handleEditResource}
                onDelete={handleDeleteResource}
                locale={locale}
            />
        </div>
    );
}
