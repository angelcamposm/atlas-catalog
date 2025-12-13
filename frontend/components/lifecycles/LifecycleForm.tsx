"use client";

import { useState } from "react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Lifecycle } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface LifecycleFormData {
    name: string;
    color: string;
    description?: string | null;
    approval_required: boolean;
}

export interface LifecycleFormProps {
    /** Initial data for editing */
    initialData?: Lifecycle;
    /** Submit handler */
    onSubmit: (data: LifecycleFormData) => Promise<void>;
    /** Cancel handler */
    onCancel: () => void;
    /** Loading state */
    isLoading?: boolean;
    /** Form mode */
    mode: "create" | "edit";
}

// ============================================================================
// Color Options
// ============================================================================

const colorOptions = [
    { name: "Azul", value: "blue", class: "bg-blue-500" },
    { name: "Verde", value: "green", class: "bg-green-500" },
    { name: "Amarillo", value: "yellow", class: "bg-yellow-500" },
    { name: "Naranja", value: "orange", class: "bg-orange-500" },
    { name: "Rojo", value: "red", class: "bg-red-500" },
    { name: "Púrpura", value: "purple", class: "bg-purple-500" },
    { name: "Rosa", value: "pink", class: "bg-pink-500" },
    { name: "Gris", value: "gray", class: "bg-gray-500" },
    { name: "Índigo", value: "indigo", class: "bg-indigo-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
];

// ============================================================================
// Component
// ============================================================================

export function LifecycleForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode,
}: LifecycleFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [color, setColor] = useState(initialData?.color || "blue");
    const [description, setDescription] = useState(
        initialData?.description || ""
    );
    const [approvalRequired, setApprovalRequired] = useState(
        initialData?.approval_required ?? false
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "El nombre es requerido";
        } else if (name.trim().length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres";
        }

        if (!color) {
            newErrors.color = "El color es requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit({
            name: name.trim(),
            color: color,
            description: description.trim() || null,
            approval_required: approvalRequired,
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
                    placeholder="Ej: Development, Production, Deprecated..."
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

            {/* Color Field */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                    Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {colorOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                setColor(option.value);
                                if (errors.color) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        color: "",
                                    }));
                                }
                            }}
                            className={cn(
                                "relative w-8 h-8 rounded-full transition-all duration-200",
                                option.class,
                                color === option.value
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : "hover:scale-110"
                            )}
                            title={option.name}
                            disabled={isLoading}
                        >
                            {color === option.value && (
                                <HiCheck className="absolute inset-0 m-auto h-4 w-4 text-white" />
                            )}
                        </button>
                    ))}
                </div>
                {errors.color && (
                    <p className="text-sm text-red-500">{errors.color}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    El color ayuda a identificar visualmente el estado del ciclo
                    de vida.
                </p>
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
                    placeholder="Describe el estado del ciclo de vida y cuándo se debe usar..."
                    rows={3}
                    className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg border bg-background resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-muted-foreground border-input"
                    )}
                    disabled={isLoading}
                />
            </div>

            {/* Approval Required Toggle */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <label
                            htmlFor="approval_required"
                            className="block text-sm font-medium text-foreground"
                        >
                            Requiere aprobación
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Activar si los cambios a este estado requieren
                            aprobación
                        </p>
                    </div>
                    <button
                        type="button"
                        id="approval_required"
                        role="switch"
                        aria-checked={approvalRequired}
                        onClick={() => setApprovalRequired(!approvalRequired)}
                        className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            approvalRequired ? "bg-primary" : "bg-muted"
                        )}
                        disabled={isLoading}
                    >
                        <span
                            className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200",
                                approvalRequired
                                    ? "translate-x-5"
                                    : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-2 pt-2 border-t border-border">
                <label className="block text-sm font-medium text-foreground">
                    Vista previa
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div
                        className={cn(
                            "w-3 h-3 rounded-full",
                            colorOptions.find((c) => c.value === color)
                                ?.class || "bg-gray-500"
                        )}
                    />
                    <span className="font-medium text-foreground">
                        {name || "Nombre del estado"}
                    </span>
                    {approvalRequired && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Requiere aprobación
                        </span>
                    )}
                </div>
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
                        ? "Crear Estado"
                        : "Guardar Cambios"}
                </Button>
            </div>
        </form>
    );
}

// ============================================================================
// Modal Wrapper
// ============================================================================

export interface LifecycleFormModalProps
    extends Omit<LifecycleFormProps, "onCancel"> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export function LifecycleFormModal({
    isOpen,
    onClose,
    title,
    ...formProps
}: LifecycleFormModalProps) {
    if (!isOpen) return null;

    const modalTitle =
        title ||
        (formProps.mode === "create"
            ? "Crear Estado de Ciclo de Vida"
            : "Editar Estado");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-background border border-border rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
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
                    <LifecycleForm {...formProps} onCancel={onClose} />
                </div>
            </div>
        </div>
    );
}
