"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiArrowLeft,
    HiPencilSquare,
    HiTrash,
    HiCircleStack,
    HiClock,
    HiUser,
    HiTag,
} from "react-icons/hi2";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resourcesApi, resourceCategoriesApi } from "@/lib/api";
import type { Resource, ResourceCategory } from "@/types/api";

export default function ResourceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "en";
    const resourceId = params.id as string;

    const [resource, setResource] = useState<Resource | null>(null);
    const [category, setCategory] = useState<ResourceCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadResource = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await resourcesApi.getById(parseInt(resourceId));
            setResource(response.data);

            // Load category if resource has type_id
            if (response.data.type_id) {
                try {
                    const categoryResponse =
                        await resourceCategoriesApi.getById(
                            response.data.type_id
                        );
                    setCategory(categoryResponse.data);
                } catch {
                    // Category might not exist
                    setCategory(null);
                }
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading resource"
            );
            console.error("Error loading resource:", err);
        } finally {
            setLoading(false);
        }
    }, [resourceId]);

    useEffect(() => {
        if (resourceId) {
            loadResource();
        }
    }, [resourceId, loadResource]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await resourcesApi.delete(parseInt(resourceId));
            router.push(`/${locale}/resources`);
        } catch (err) {
            console.error("Error deleting resource:", err);
            setError(
                err instanceof Error ? err.message : "Error deleting resource"
            );
        } finally {
            setDeleting(false);
        }
    };

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

    if (loading) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                    <h2 className="text-lg font-semibold text-destructive">
                        Error Loading Resource
                    </h2>
                    <p className="mt-2 text-sm text-destructive/80">{error}</p>
                    <div className="mt-4 flex gap-3">
                        <Button variant="outline" onClick={loadResource}>
                            Retry
                        </Button>
                        <Link href={`/${locale}/resources`}>
                            <Button variant="ghost">Back to Resources</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="text-center py-12">
                    <HiCircleStack className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-lg font-semibold">
                        Resource Not Found
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The requested resource could not be found.
                    </p>
                    <Link href={`/${locale}/resources`}>
                        <Button className="mt-4">Back to Resources</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            {/* Back Button */}
            <Link
                href={`/${locale}/resources`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <HiArrowLeft className="h-4 w-4" />
                Back to Resources
            </Link>

            {/* Header */}
            <PageHeader
                title={resource.name || "Unnamed Resource"}
                subtitle={
                    category
                        ? `${category.name} resource in the catalog`
                        : "Infrastructure resource in the catalog"
                }
                actions={
                    <div className="flex items-center gap-3">
                        <Link href={`/${locale}/resources/${resource.id}/edit`}>
                            <Button variant="outline">
                                <HiPencilSquare className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <HiTrash className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Resource
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete &quot;
                                        {resource.name}&quot;? This action
                                        cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={deleting}
                                    >
                                        {deleting ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            />

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HiCircleStack className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Core details about this resource
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-sm text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm font-medium">
                                    {resource.id}
                                </dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-sm text-muted-foreground">
                                    Name
                                </dt>
                                <dd className="text-sm font-medium">
                                    {resource.name || "N/A"}
                                </dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-sm text-muted-foreground">
                                    Type ID
                                </dt>
                                <dd className="text-sm font-medium">
                                    {resource.type_id || "N/A"}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Category Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HiTag className="h-5 w-5" />
                            Category
                        </CardTitle>
                        <CardDescription>
                            Resource classification and type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {category ? (
                            <dl className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <dt className="text-sm text-muted-foreground">
                                        Category Name
                                    </dt>
                                    <dd>
                                        <Badge variant="outline">
                                            {category.name}
                                        </Badge>
                                    </dd>
                                </div>
                                {category.description && (
                                    <div className="border-b pb-2">
                                        <dt className="text-sm text-muted-foreground mb-1">
                                            Description
                                        </dt>
                                        <dd className="text-sm">
                                            {category.description}
                                        </dd>
                                    </div>
                                )}
                                {category.icon && (
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-muted-foreground">
                                            Icon
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {category.icon}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No category assigned to this resource.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Timestamps */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HiClock className="h-5 w-5" />
                            Timestamps
                        </CardTitle>
                        <CardDescription>
                            Creation and modification dates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-sm text-muted-foreground">
                                    Created At
                                </dt>
                                <dd className="text-sm font-medium">
                                    {formatDate(resource.created_at)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">
                                    Updated At
                                </dt>
                                <dd className="text-sm font-medium">
                                    {formatDate(resource.updated_at)}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* User References */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HiUser className="h-5 w-5" />
                            User References
                        </CardTitle>
                        <CardDescription>
                            Users who created and modified this resource
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-sm text-muted-foreground">
                                    Created By
                                </dt>
                                <dd className="text-sm font-medium">
                                    {resource.created_by
                                        ? `User #${resource.created_by}`
                                        : "N/A"}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-muted-foreground">
                                    Updated By
                                </dt>
                                <dd className="text-sm font-medium">
                                    {resource.updated_by
                                        ? `User #${resource.updated_by}`
                                        : "N/A"}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
