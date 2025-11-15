"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    HiServerStack,
    HiPlus,
    HiPencil,
    HiTrash,
    HiXCircle,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { clusterServiceAccountsApi } from "@/lib/api/infrastructure";
import type { ClusterServiceAccount, PaginatedResponse } from "@/types/api";

export default function ClusterServiceAccountsPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<ClusterServiceAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadAccounts = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedResponse<ClusterServiceAccount> =
                await clusterServiceAccountsApi.getAll(page);
            setAccounts(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load cluster service accounts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAccounts(currentPage);
    }, [currentPage, loadAccounts]);

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                "Are you sure you want to delete this cluster service account?"
            )
        ) {
            return;
        }

        try {
            await clusterServiceAccountsApi.delete(id);
            await loadAccounts(currentPage);
        } catch (err) {
            console.error("Failed to delete cluster service account:", err);
            alert("Failed to delete cluster service account");
        }
    };

    // Removed toggleStatus - ClusterServiceAccount is a pivot table without is_active field

    if (loading && accounts.length === 0) {
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
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <HiServerStack className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Cluster Service Accounts
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage service accounts associated with clusters
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        router.push(
                            "/infrastructure/cluster-service-accounts/create"
                        )
                    }
                    className="flex items-center gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Create Account
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

            {/* Accounts Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr className="text-left">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Cluster</th>
                                <th className="p-4 font-semibold">
                                    Service Account
                                </th>
                                <th className="p-4 font-semibold">Created</th>
                                <th className="p-4 font-semibold text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr
                                    key={account.id}
                                    className="border-b hover:bg-muted/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <span className="font-mono text-sm">
                                            {account.id}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">
                                            Cluster #{account.cluster_id}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">
                                            SA #{account.service_account_id}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {new Date(
                                            account.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/infrastructure/cluster-service-accounts/${account.id}/edit`
                                                    )
                                                }
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(account.id)
                                                }
                                                className="text-destructive hover:text-destructive hover:border-destructive"
                                            >
                                                <HiTrash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {!loading && accounts.length === 0 && (
                <Card className="p-12 text-center">
                    <HiServerStack className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No cluster service accounts found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Get started by creating your first cluster service
                        account association.
                    </p>
                    <Button
                        onClick={() =>
                            router.push(
                                "/infrastructure/cluster-service-accounts/create"
                            )
                        }
                        className="flex items-center gap-2 mx-auto"
                    >
                        <HiPlus className="h-5 w-5" />
                        Create Account
                    </Button>
                </Card>
            )}

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
