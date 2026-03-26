"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiServerStack, HiPlus, HiXCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { InfrastructureTypeList } from "@/components/infrastructure/InfrastructureTypeList";
import { infrastructureTypesApi } from "@/lib/api";
import type { InfrastructureType, PaginatedResponse } from "@/types/api";

export default function InfrastructureTypesPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [infrastructureTypes, setInfrastructureTypes] = useState<
        InfrastructureType[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadInfrastructureTypes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedResponse<InfrastructureType> =
                await infrastructureTypesApi.getAll(page);
            setInfrastructureTypes(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load infrastructure types");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInfrastructureTypes(currentPage);
    }, [currentPage, loadInfrastructureTypes]);

    const handleEdit = (infrastructureType: InfrastructureType) => {
        router.push(
            `/${locale}/infrastructure/types/${infrastructureType.id}/edit`,
        );
    };

    const handleDelete = async (infrastructureType: InfrastructureType) => {
        if (
            !confirm(
                `Are you sure you want to delete "${infrastructureType.name}"?`,
            )
        ) {
            return;
        }

        try {
            await infrastructureTypesApi.delete(infrastructureType.id);
            await loadInfrastructureTypes(currentPage);
        } catch (err) {
            console.error("Failed to delete infrastructure type:", err);
            alert("Failed to delete infrastructure type");
        }
    };

    if (loading && infrastructureTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <HiServerStack className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Infrastructure Types
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage infrastructure type configurations
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        router.push(`/${locale}/infrastructure/types/create`)
                    }
                    className="flex items-center gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Create Infrastructure Type
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="p-6 border-destructive">
                    <div className="flex items-center gap-2 text-destructive">
                        <HiXCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                </Card>
            )}

            {/* Infrastructure Types List */}
            <InfrastructureTypeList
                infrastructureTypes={infrastructureTypes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
