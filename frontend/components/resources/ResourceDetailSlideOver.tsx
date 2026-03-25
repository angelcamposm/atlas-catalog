"use client";

import {
    HiCircleStack,
    HiPencilSquare,
    HiTrash,
    HiClock,
    HiUser,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
} from "@/components/ui/SlideOver";
import type { Resource, ResourceCategory } from "@/types/api";

interface ResourceDetailSlideOverProps {
    resource: Resource | null;
    category?: ResourceCategory | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (resource: Resource) => void;
    onDelete?: (resource: Resource) => void;
    locale?: string;
}

export function ResourceDetailSlideOver({
    resource,
    category,
    open,
    onClose,
    onEdit,
    onDelete,
    locale = "en",
}: ResourceDetailSlideOverProps) {
    if (!resource) return null;

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={resource.name || "Unnamed Resource"}
            description={
                category
                    ? `${category.name} resource`
                    : "Infrastructure resource"
            }
            icon={<HiCircleStack className="h-5 w-5" />}
            status={
                category ? { label: category.name, variant: "info" } : undefined
            }
            footer={
                <div className="flex gap-3">
                    {onEdit && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onEdit(resource)}
                        >
                            <HiPencilSquare className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => onDelete(resource)}
                        >
                            <HiTrash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    )}
                </div>
            }
        >
            {/* Basic Information */}
            <SlideOverSection title="Basic Information">
                <SlideOverField label="ID" value={resource.id.toString()} />
                <SlideOverField label="Name" value={resource.name || "N/A"} />
                {resource.type_id && (
                    <SlideOverField
                        label="Type ID"
                        value={resource.type_id.toString()}
                    />
                )}
            </SlideOverSection>

            {/* Category Information */}
            {category && (
                <SlideOverSection title="Category Details">
                    <SlideOverField label="Category" value={category.name} />
                    {category.description && (
                        <SlideOverField
                            label="Description"
                            value={category.description}
                        />
                    )}
                </SlideOverSection>
            )}

            {/* Timestamps */}
            <SlideOverSection
                title="Timestamps"
                icon={<HiClock className="h-4 w-4" />}
            >
                <SlideOverField
                    label="Created"
                    value={formatDate(resource.created_at)}
                />
                <SlideOverField
                    label="Updated"
                    value={formatDate(resource.updated_at)}
                />
            </SlideOverSection>

            {/* User References */}
            {(resource.created_by || resource.updated_by) && (
                <SlideOverSection
                    title="User References"
                    icon={<HiUser className="h-4 w-4" />}
                >
                    {resource.created_by && (
                        <SlideOverField
                            label="Created by"
                            value={`User #${resource.created_by}`}
                        />
                    )}
                    {resource.updated_by && (
                        <SlideOverField
                            label="Updated by"
                            value={`User #${resource.updated_by}`}
                        />
                    )}
                </SlideOverSection>
            )}
        </SlideOver>
    );
}
