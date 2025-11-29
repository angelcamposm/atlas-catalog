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
        cpu_cores: 1,
        cpu_threads: 1,
        os: "",
        os_version: "",
        ip_address: "",
        fqdn: "",
        cpu_architecture: "x86-64",
        cpu_sockets: undefined,
        cpu_type: "",
        is_virtual: true,
        memory_bytes: undefined,
        node_type: "V",
        discovery_source: "Manual",
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
        value: string | number | boolean | undefined
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const gbToBytes = (gb: number) => gb * 1024 * 1024 * 1024;

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

                        {/* IP Address */}
                        <div className="space-y-2">
                            <Label htmlFor="ip_address">IP Address</Label>
                            <Input
                                id="ip_address"
                                value={formData.ip_address ?? ""}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("ip_address", e.target.value)}
                                placeholder="e.g., 192.168.1.10"
                            />
                        </div>

                        {/* FQDN */}
                        <div className="space-y-2">
                            <Label htmlFor="fqdn">FQDN</Label>
                            <Input
                                id="fqdn"
                                value={formData.fqdn ?? ""}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("fqdn", e.target.value)}
                                placeholder="e.g., node-01.example.com"
                            />
                        </div>

                        {/* OS */}
                        <div className="space-y-2">
                            <Label htmlFor="os">
                                Operating System{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="os"
                                required
                                value={formData.os}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("os", e.target.value)}
                                placeholder="e.g., Ubuntu"
                            />
                        </div>

                        {/* OS Version */}
                        <div className="space-y-2">
                            <Label htmlFor="os_version">
                                OS Version{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="os_version"
                                required
                                value={formData.os_version}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange("os_version", e.target.value)}
                                placeholder="e.g., 22.04"
                            />
                        </div>

                        {/* Node Type */}
                        <div className="space-y-2">
                            <Label htmlFor="node_type">Node Type</Label>
                            <Select
                                value={formData.node_type ?? "V"}
                                onValueChange={(value: string) =>
                                    handleChange("node_type", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="V">Virtual</SelectItem>
                                    <SelectItem value="P">Physical</SelectItem>
                                    <SelectItem value="H">Hybrid</SelectItem>
                                    <SelectItem value="U">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* CPU Architecture */}
                        <div className="space-y-2">
                            <Label htmlFor="cpu_architecture">
                                CPU Architecture
                            </Label>
                            <Select
                                value={formData.cpu_architecture ?? "x86-64"}
                                onValueChange={(value: string) =>
                                    handleChange("cpu_architecture", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="x86-64">
                                        x86-64
                                    </SelectItem>
                                    <SelectItem value="arm64">ARM64</SelectItem>
                                    <SelectItem value="arm">ARM</SelectItem>
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
                                min={1}
                                value={formData.cpu_cores}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "cpu_cores",
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : 1
                                    )
                                }
                                placeholder="e.g., 4"
                            />
                        </div>

                        {/* CPU Threads */}
                        <div className="space-y-2">
                            <Label htmlFor="cpu_threads">
                                CPU Threads{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="cpu_threads"
                                type="number"
                                required
                                min={1}
                                value={formData.cpu_threads}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "cpu_threads",
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : 1
                                    )
                                }
                                placeholder="e.g., 8"
                            />
                        </div>

                        {/* CPU Sockets */}
                        <div className="space-y-2">
                            <Label htmlFor="cpu_sockets">CPU Sockets</Label>
                            <Input
                                id="cpu_sockets"
                                type="number"
                                min={1}
                                value={formData.cpu_sockets ?? ""}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "cpu_sockets",
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined
                                    )
                                }
                                placeholder="e.g., 1"
                            />
                        </div>

                        {/* Memory (GB) */}
                        <div className="space-y-2">
                            <Label htmlFor="memory_gb">Memory (GB)</Label>
                            <Input
                                id="memory_gb"
                                type="number"
                                min={1}
                                value={
                                    formData.memory_bytes
                                        ? Math.round(
                                              formData.memory_bytes /
                                                  (1024 * 1024 * 1024)
                                          )
                                        : ""
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        "memory_bytes",
                                        e.target.value
                                            ? gbToBytes(
                                                  parseInt(e.target.value)
                                              )
                                            : undefined
                                    )
                                }
                                placeholder="e.g., 16"
                            />
                        </div>

                        {/* Is Virtual */}
                        <div className="flex items-center space-x-2 pt-6">
                            <Switch
                                id="is_virtual"
                                checked={formData.is_virtual ?? true}
                                onCheckedChange={(checked) =>
                                    handleChange("is_virtual", checked)
                                }
                            />
                            <Label htmlFor="is_virtual">Virtual Machine</Label>
                        </div>
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
