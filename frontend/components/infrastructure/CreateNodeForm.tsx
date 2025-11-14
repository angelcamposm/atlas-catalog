"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nodesApi } from "@/lib/api";
import type { CreateNodeRequest } from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateNodeFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateNodeForm({ onSuccess, onCancel }: CreateNodeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateNodeRequest>({
        name: "",
        ip_address: "",
        fqdn: "",
        node_type: "",
        cpu_type: "",
        cpu_architecture: "",
        cpu_cores: undefined,
        cpu_threads: undefined,
        cpu_sockets: undefined,
        smt_enabled: false,
        memory_bytes: undefined,
        os: "",
        os_version: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await nodesApi.create(formData);
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Error creating node:", err);
            alert("Failed to create node. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        field: keyof CreateNodeRequest,
        value: string | number | boolean
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const gbToBytes = (gb: number) => gb * 1024 * 1024 * 1024;
    const bytesToGb = (bytes: number) => bytes / (1024 * 1024 * 1024);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Node</CardTitle>
                <CardDescription>
                    Add a new node to your infrastructure
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                placeholder="e.g., node-01"
                            />
                        </div>

                        {/* Hostname */}
                        <div className="space-y-2">
                            <Label htmlFor="hostname">
                                Hostname{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="hostname"
                                required
                                value={formData.hostname}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("hostname", e.target.value)}
                                placeholder="e.g., node-01.example.com"
                            />
                        </div>

                        {/* IP Address */}
                        <div className="space-y-2">
                            <Label htmlFor="ip_address">
                                IP Address{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="ip_address"
                                required
                                value={formData.ip_address}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("ip_address", e.target.value)}
                                placeholder="e.g., 192.168.1.10"
                            />
                        </div>

                        {/* Node Type */}
                        <div className="space-y-2">
                            <Label htmlFor="node_type">
                                Node Type{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.node_type}
                                onValueChange={(value: string) =>
                                    handleChange(
                                        "node_type",
                                        value as
                                            | "physical"
                                            | "virtual"
                                            | "cloud"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physical">
                                        Physical
                                    </SelectItem>
                                    <SelectItem value="virtual">
                                        Virtual
                                    </SelectItem>
                                    <SelectItem value="cloud">Cloud</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Node Role */}
                        <div className="space-y-2">
                            <Label htmlFor="node_role">
                                Node Role{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.node_role}
                                onValueChange={(value: string) =>
                                    handleChange(
                                        "node_role",
                                        value as "master" | "worker" | "etcd"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="master">
                                        Master
                                    </SelectItem>
                                    <SelectItem value="worker">
                                        Worker
                                    </SelectItem>
                                    <SelectItem value="etcd">ETCD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* CPU Cores */}
                        <div className="space-y-2">
                            <Label htmlFor="cpu_cores">
                                CPU Cores{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="cpu_cores"
                                type="number"
                                required
                                min="1"
                                value={formData.cpu_cores}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "cpu_cores",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>

                        {/* CPU Architecture */}
                        <div className="space-y-2">
                            <Label htmlFor="cpu_architecture">
                                CPU Architecture{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.cpu_architecture}
                                onValueChange={(value: string) =>
                                    handleChange(
                                        "cpu_architecture",
                                        value as
                                            | "x86_64"
                                            | "arm64"
                                            | "arm"
                                            | "ppc64le"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="x86_64">
                                        x86_64
                                    </SelectItem>
                                    <SelectItem value="arm64">ARM64</SelectItem>
                                    <SelectItem value="arm">ARM</SelectItem>
                                    <SelectItem value="ppc64le">
                                        PPC64LE
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Memory (GB) */}
                        <div className="space-y-2">
                            <Label htmlFor="memory">
                                Memory (GB){" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="memory"
                                type="number"
                                required
                                min="1"
                                step="0.5"
                                value={bytesToGb(formData.memory_bytes)}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "memory_bytes",
                                        gbToBytes(parseFloat(e.target.value))
                                    )
                                }
                            />
                        </div>

                        {/* Storage (GB) */}
                        <div className="space-y-2">
                            <Label htmlFor="storage">
                                Storage (GB){" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="storage"
                                type="number"
                                required
                                min="1"
                                value={bytesToGb(formData.storage_bytes)}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "storage_bytes",
                                        gbToBytes(parseFloat(e.target.value))
                                    )
                                }
                            />
                        </div>

                        {/* Environment ID */}
                        <div className="space-y-2">
                            <Label htmlFor="environment_id">
                                Environment ID{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="environment_id"
                                type="number"
                                required
                                min="1"
                                value={formData.environment_id}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "environment_id",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked: boolean) =>
                                handleChange("is_active", checked)
                            }
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Node"}
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
