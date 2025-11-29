"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiServerStack, HiArrowLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    clusterServiceAccountsApi,
    clustersApi,
} from "@/lib/api/infrastructure";
import type { Cluster } from "@/types/api";

export default function CreateClusterServiceAccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [formData, setFormData] = useState({
        cluster_id: "",
        service_account_id: "",
    });

    useEffect(() => {
        loadClusters();
    }, []);

    const loadClusters = async () => {
        try {
            const response = await clustersApi.getAll(1);
            setClusters(response.data);
        } catch (error) {
            console.error("Failed to load clusters:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await clusterServiceAccountsApi.create({
                cluster_id: parseInt(formData.cluster_id),
                service_account_id: parseInt(formData.service_account_id),
            });
            router.push("/infrastructure/cluster-service-accounts");
        } catch (error) {
            console.error("Failed to create cluster service account:", error);
            alert("Failed to create cluster service account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <HiArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <HiServerStack className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Create Cluster Service Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Associate a service account with a cluster
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cluster */}
                    <div className="space-y-2">
                        <Label htmlFor="cluster_id">
                            Cluster <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="cluster_id"
                            required
                            value={formData.cluster_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    cluster_id: e.target.value,
                                })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">Select a cluster...</option>
                            {clusters.map((cluster) => (
                                <option key={cluster.id} value={cluster.id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Account ID */}
                    <div className="space-y-2">
                        <Label htmlFor="service_account_id">
                            Service Account ID{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="service_account_id"
                            type="number"
                            required
                            value={formData.service_account_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    service_account_id: e.target.value,
                                })
                            }
                            placeholder="Enter service account ID"
                        />
                        <p className="text-xs text-muted-foreground">
                            Numeric ID of the service account
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Creating..." : "Create Association"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
