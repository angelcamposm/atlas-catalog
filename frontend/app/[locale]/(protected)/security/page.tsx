"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { serviceAccountTokensApi } from "@/lib/api";
import type {
    ServiceAccountToken,
    PaginatedServiceAccountTokenResponse,
} from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";

export default function SecurityPage() {
    const [tokens, setTokens] = useState<ServiceAccountToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [visibleTokens, setVisibleTokens] = useState<Set<number>>(new Set());

    const loadTokens = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedServiceAccountTokenResponse =
                await serviceAccountTokensApi.getAll(page);
            setTokens(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load service account tokens");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTokens(currentPage);
    }, [currentPage, loadTokens]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to revoke this token?")) {
            return;
        }

        try {
            await serviceAccountTokensApi.delete(id);
            loadTokens(currentPage);
        } catch (err) {
            console.error("Error deleting token:", err);
            alert("Failed to delete token");
        }
    };

    const toggleTokenVisibility = (id: number) => {
        setVisibleTokens((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const maskToken = (token: string) => {
        if (token.length <= 8) return "••••••••";
        return token.substring(0, 4) + "••••••••" + token.slice(-4);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <Button onClick={() => loadTokens(currentPage)}>
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Security Center</h1>
                        <p className="text-muted-foreground">
                            Manage service account tokens and access
                        </p>
                    </div>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Token
                </Button>
            </div>

            {/* Tokens List */}
            <div className="space-y-4">
                {tokens.map((token) => {
                    const isExpired =
                        token.expires_at &&
                        new Date(token.expires_at) < new Date();
                    const isVisible = visibleTokens.has(token.id);

                    return (
                        <Card key={token.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Key className="h-5 w-5" />
                                        <span>Service Account #{token.service_account_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isExpired && (
                                            <Badge variant="destructive">
                                                Expired
                                            </Badge>
                                        )}
                                        <Badge variant="secondary">
                                            ID: {token.id}
                                        </Badge>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Token Display */}
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 p-3 bg-muted rounded font-mono text-sm break-all">
                                            {isVisible
                                                ? token.token
                                                : maskToken(token.token)}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                toggleTokenVisibility(token.id)
                                            }
                                        >
                                            {isVisible ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Token Info */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">
                                                Created:
                                            </span>
                                            <div className="font-medium">
                                                {new Date(
                                                    token.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {token.expires_at && (
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Expires:
                                                </span>
                                                <div
                                                    className={`font-medium ${
                                                        isExpired
                                                            ? "text-red-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {new Date(
                                                        token.expires_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                        {token.last_used_at && (
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Last Used:
                                                </span>
                                                <div className="font-medium">
                                                    {new Date(
                                                        token.last_used_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(token.id)}
                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Revoke Token
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {tokens.length === 0 && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No tokens found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Create a service account token to get started
                            </p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Token
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
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
