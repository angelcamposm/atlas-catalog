"use client";

import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { ApiType } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiTypeFormData {
    name: string;
    description?: string | null;
}

export interface ApiTypeFormProps {
    /** Initial data for editing */
    initialData?: ApiType;
    /** Submit handler */
    onSubmit: (data: ApiTypeFormData) => Promise<void>;
    /** Cancel handler */
    onCancel: () => void;
    /** Loading state */
    isLoading?: boolean;
    /** Form mode */
    mode: "create" | "edit";
}

// ============================================================================
// Component
// ============================================================================

export function ApiTypeForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode,
}: ApiTypeFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "El nombre es requerido";
        } else if (name.trim().length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit({
            name: name.trim(),
            description: description.trim() || null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground"
                >
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: "" }));
                        }
                    }}
                    placeholder="Ej: REST API, GraphQL, gRPC..."
                    className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg border bg-background",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-muted-foreground",
                        errors.name
                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                            : "border-input"
                    )}
                    disabled={isLoading}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground"
                >
                    Descripción
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe brevemente este tipo de API..."
                    rows={4}
                    className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg border bg-background resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-muted-foreground border-input"
                    )}
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                    Proporciona una descripción clara para ayudar a otros
                    usuarios a entender cuándo usar este tipo.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading
                        ? "Guardando..."
                        : mode === "create"
                        ? "Crear Tipo"
                        : "Guardar Cambios"}
                </Button>
            </div>
        </form>
    );
}

// ============================================================================
// Modal Wrapper
// ============================================================================

export interface ApiTypeFormModalProps
    extends Omit<ApiTypeFormProps, "onCancel"> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export function ApiTypeFormModal({
    isOpen,
    onClose,
    title,
    ...formProps
}: ApiTypeFormModalProps) {
    if (!isOpen) return null;

    const modalTitle =
        title ||
        (formProps.mode === "create"
            ? "Crear Tipo de API"
            : "Editar Tipo de API");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-background border border-border rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">
                        {modalTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                        <HiOutlineXMark className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-4">
                    <ApiTypeForm {...formProps} onCancel={onClose} />
                </div>
            </div>
        </div>
    );
}
