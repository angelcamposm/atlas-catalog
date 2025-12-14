"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { apisApi } from "@/lib/api/apis";
import { apiTypesApi } from "@/lib/api/api-types";
import {
    apiStatusesApi,
    apiCategoriesApi,
    apiAccessPoliciesApi,
} from "@/lib/api";
import { authenticationMethodsApi } from "@/lib/api/technology";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import { Protocol } from "@/types/api";
import type { Api, ApiType, ApiStatus, Lifecycle } from "@/types/api";
import {
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineExclamationTriangle,
    HiOutlineArrowLeft,
    HiOutlineExclamationCircle,
} from "react-icons/hi2";

interface EditApiFormProps {
    api: Api;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EditApiForm({ api, onSuccess, onCancel }: EditApiFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showDeprecateModal, setShowDeprecateModal] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: api.name,
        display_name: api.display_name ?? "",
        description: api.description ?? "",
        version: api.version ?? "",
        url: api.url ?? "",
        protocol: api.protocol ?? Protocol.HTTPS,
        type_id: api.type_id ?? null,
        status_id: api.status_id ?? null,
        access_policy_id: (api as any).access_policy_id ?? null,
        authentication_method_id: (api as any).authentication_method_id ?? null,
        category_id: api.category_id ?? null,
        document_specification:
            typeof api.document_specification === "string"
                ? api.document_specification
                : api.document_specification
                ? JSON.stringify(api.document_specification, null, 2)
                : "",
    });

    // Field errors
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof typeof formData, string>>
    >({});

    // Options data
    const [apiTypes, setApiTypes] = useState<ApiType[]>([]);
    const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
    const [apiCategories, setApiCategories] = useState<any[]>([]);
    const [apiAccessPolicies, setApiAccessPolicies] = useState<any[]>([]);
    const [authenticationMethods, setAuthenticationMethods] = useState<any[]>(
        []
    );
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    // Load options
    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                const [
                    typesRes,
                    statusesRes,
                    categoriesRes,
                    accessesRes,
                    authRes,
                    lifecyclesRes,
                ] = await Promise.all([
                    apiTypesApi.getAll().catch(() => ({ data: [] })),
                    apiStatusesApi.getAll().catch(() => ({ data: [] })),
                    apiCategoriesApi.getAll().catch(() => ({ data: [] })),
                    apiAccessPoliciesApi.getAll().catch(() => ({ data: [] })),
                    authenticationMethodsApi
                        .getAll()
                        .catch(() => ({ data: [] })),
                    lifecyclesApi.getAll().catch(() => ({ data: [] })),
                ]);

                setApiTypes(typesRes.data || []);
                setApiStatuses(statusesRes.data || []);
                setApiCategories(categoriesRes.data || []);
                setApiAccessPolicies(accessesRes.data || []);
                setAuthenticationMethods(authRes.data || []);
                setLifecycles(lifecyclesRes.data || []);
            } catch (err) {
                console.error("Error loading form options:", err);
            } finally {
                setLoadingOptions(false);
            }
        };

        void loadOptions();
    }, []);

    // Track changes
    useEffect(() => {
        const original = {
            name: api.name,
            display_name: api.display_name ?? "",
            description: api.description ?? "",
            version: api.version ?? "",
            url: api.url ?? "",
            protocol: api.protocol ?? Protocol.HTTPS,
            type_id: api.type_id ?? null,
            status_id: api.status_id ?? null,
            category_id: api.category_id ?? null,
            document_specification:
                typeof api.document_specification === "string"
                    ? api.document_specification
                    : api.document_specification
                    ? JSON.stringify(api.document_specification, null, 2)
                    : "",
        };

        const changed = Object.keys(formData).some(
            (key) =>
                formData[key as keyof typeof formData] !==
                original[key as keyof typeof original]
        );
        setHasChanges(changed);
    }, [formData, api]);

    // Update form field
    const updateField = useCallback(
        <K extends keyof typeof formData>(
            field: K,
            value: (typeof formData)[K]
        ) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (fieldErrors[field]) {
                setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [fieldErrors]
    );

    // Validate form
    const validateForm = useCallback((): boolean => {
        const errors: Partial<Record<keyof typeof formData, string>> = {};

        if (!formData.name.trim()) {
            errors.name = "El nombre es obligatorio";
        } else if (formData.name.length > 255) {
            errors.name = "El nombre no puede superar los 255 caracteres";
        }

        if (formData.description && formData.description.length > 2000) {
            errors.description =
                "La descripción no puede superar los 2000 caracteres";
        }

        if (formData.url && formData.url.trim()) {
            try {
                new URL(formData.url);
            } catch {
                errors.url = "La URL no es válida";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    // Handle form submission
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) return;

            setIsSubmitting(true);
            setSubmitError(null);

            try {
                const submitData = {
                    name: formData.name.trim(),
                    display_name: formData.display_name.trim() || undefined,
                    description: formData.description.trim() || undefined,
                    version: formData.version.trim() || undefined,
                    url: formData.url.trim() || undefined,
                    protocol: formData.protocol || undefined,
                    type_id: formData.type_id ?? undefined,
                    status_id: formData.status_id ?? undefined,
                    access_policy_id:
                        (formData as any).access_policy_id ?? undefined,
                    authentication_method_id:
                        (formData as any).authentication_method_id ?? undefined,
                    category_id: formData.category_id ?? undefined,
                    document_specification:
                        formData.document_specification.trim()
                            ? JSON.parse(formData.document_specification.trim())
                            : undefined,
                };

                await apisApi.update(api.id, submitData);

                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(`/apis/${api.id}`);
                }
            } catch (err) {
                console.error("Error updating API:", err);
                setSubmitError(
                    "No se ha podido actualizar la API. Por favor, inténtalo de nuevo."
                );
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, validateForm, api.id, router, onSuccess]
    );

    // Handle cancel
    const handleCancel = useCallback(() => {
        if (hasChanges) {
            if (
                !confirm(
                    "Tienes cambios sin guardar. ¿Seguro que quieres salir?"
                )
            ) {
                return;
            }
        }

        if (onCancel) {
            onCancel();
        } else {
            router.push(`/apis/${api.id}`);
        }
    }, [hasChanges, router, api.id, onCancel]);

    // Handle deprecation
    const handleDeprecate = useCallback(async () => {
        try {
            await apisApi.update(api.id, {
                deprecated_at: new Date().toISOString(),
            });
            setShowDeprecateModal(false);
            router.refresh();
        } catch (err) {
            console.error("Error deprecating API:", err);
            alert("No se ha podido marcar la API como obsoleta.");
        }
    }, [api.id, router]);

    // Form field component
    const FormField = ({
        id,
        label,
        required = false,
        error,
        children,
        hint,
    }: {
        id: string;
        label: string;
        required?: boolean;
        error?: string;
        children: React.ReactNode;
        hint?: string;
    }) => (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
            {hint && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {hint}
                </p>
            )}
        </div>
    );

    if (loadingOptions) {
        return (
            <div className="py-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                    Cargando formulario...
                </p>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <HiOutlineArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Editar API
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {api.name}
                            </p>
                        </div>
                    </div>

                    {!api.deprecated_at && (
                        <button
                            type="button"
                            onClick={() => setShowDeprecateModal(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                        >
                            <HiOutlineExclamationTriangle className="w-4 h-4" />
                            Marcar como obsoleta
                        </button>
                    )}
                </div>

                {/* Deprecation warning */}
                {api.deprecated_at && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex gap-3">
                            <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                                    Esta API está marcada como obsoleta
                                </h4>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                    Desde el{" "}
                                    {new Date(
                                        api.deprecated_at
                                    ).toLocaleDateString("es-ES")}
                                    . Considera eliminarla o reactivarla si ya
                                    no aplica.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Basic Info Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Información básica
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            id="name"
                            label="Nombre"
                            required
                            error={fieldErrors.name}
                            hint="Identificador único de la API"
                        >
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    updateField("name", e.target.value)
                                }
                                className={cn(
                                    "w-full px-4 py-2 border rounded-lg transition-colors",
                                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                                    fieldErrors.name
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                )}
                            />
                        </FormField>

                        <FormField
                            id="display_name"
                            label="Nombre para mostrar"
                            hint="Nombre legible para la interfaz"
                        >
                            <input
                                type="text"
                                id="display_name"
                                value={formData.display_name}
                                onChange={(e) =>
                                    updateField("display_name", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </FormField>

                        <div className="md:col-span-2">
                            <FormField
                                id="description"
                                label="Descripción"
                                error={fieldErrors.description}
                            >
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        updateField(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                    className={cn(
                                        "w-full px-4 py-2 border rounded-lg resize-none",
                                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                                        "focus:outline-none focus:ring-2 focus:ring-primary-500",
                                        fieldErrors.description
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    )}
                                />
                            </FormField>
                        </div>

                        <FormField
                            id="version"
                            label="Versión"
                            hint="Versión semántica (ej: 1.0.0)"
                        >
                            <input
                                type="text"
                                id="version"
                                value={formData.version}
                                onChange={(e) =>
                                    updateField("version", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </FormField>
                    </div>
                </section>

                {/* Configuration Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Configuración
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            id="url"
                            label="URL Base"
                            error={fieldErrors.url}
                        >
                            <input
                                type="url"
                                id="url"
                                value={formData.url}
                                onChange={(e) =>
                                    updateField("url", e.target.value)
                                }
                                className={cn(
                                    "w-full px-4 py-2 border rounded-lg",
                                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                                    fieldErrors.url
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                )}
                                placeholder="https://api.ejemplo.com/v1"
                            />
                        </FormField>

                        <FormField id="protocol" label="Protocolo">
                            <div className="flex gap-4">
                                {[Protocol.HTTPS, Protocol.HTTP].map(
                                    (protocol) => (
                                        <label
                                            key={protocol}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                                                formData.protocol === protocol
                                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="protocol"
                                                value={protocol}
                                                checked={
                                                    formData.protocol ===
                                                    protocol
                                                }
                                                onChange={() =>
                                                    updateField(
                                                        "protocol",
                                                        protocol
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <span
                                                className={cn(
                                                    "px-2 py-0.5 text-xs font-bold rounded",
                                                    protocol === Protocol.HTTPS
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                                )}
                                            >
                                                {protocol.toUpperCase()}
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>
                        </FormField>

                        <FormField id="type_id" label="Tipo de API">
                            <select
                                id="type_id"
                                value={formData.type_id ?? ""}
                                onChange={(e) =>
                                    updateField(
                                        "type_id",
                                        e.target.value
                                            ? parseInt(e.target.value, 10)
                                            : null
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccionar tipo...</option>
                                {apiTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField id="status_id" label="Estado">
                            <select
                                id="status_id"
                                value={formData.status_id ?? ""}
                                onChange={(e) =>
                                    updateField(
                                        "status_id",
                                        e.target.value
                                            ? parseInt(e.target.value, 10)
                                            : null
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccionar estado...</option>
                                {apiStatuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField id="category_id" label="Ciclo de vida">
                            <select
                                id="category_id"
                                value={formData.category_id ?? ""}
                                onChange={(e) =>
                                    updateField(
                                        "category_id",
                                        e.target.value
                                            ? parseInt(e.target.value, 10)
                                            : null
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">
                                    Seleccionar ciclo de vida...
                                </option>
                                {lifecycles.map((lifecycle) => (
                                    <option
                                        key={lifecycle.id}
                                        value={lifecycle.id}
                                    >
                                        {lifecycle.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>
                </section>

                {/* Documentation Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Documentación
                    </h2>

                    <FormField
                        id="document_specification"
                        label="Especificación OpenAPI"
                    >
                        <textarea
                            id="document_specification"
                            value={formData.document_specification}
                            onChange={(e) =>
                                updateField(
                                    "document_specification",
                                    e.target.value
                                )
                            }
                            rows={16}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            placeholder="Pega aquí tu especificación OpenAPI en formato JSON o YAML..."
                        />
                    </FormField>
                </section>

                {/* Error message */}
                {submitError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex gap-3">
                            <HiOutlineExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {submitError}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <HiOutlineXMark className="w-5 h-5" />
                        Cancelar
                    </button>

                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <span className="text-sm text-amber-600 dark:text-amber-400">
                                Cambios sin guardar
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || !hasChanges}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors",
                                isSubmitting || !hasChanges
                                    ? "bg-primary-400 cursor-not-allowed"
                                    : "bg-primary-600 hover:bg-primary-700"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <HiOutlineCheck className="w-4 h-4" />
                                    Guardar cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Deprecate Modal */}
            {showDeprecateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <HiOutlineExclamationCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Marcar como obsoleta
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Esta acción es reversible
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            La API será marcada como obsoleta y aparecerá con un
                            aviso visual. Los consumidores verán una advertencia
                            indicando que deberían migrar a una alternativa.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeprecateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDeprecate}
                                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                            >
                                Marcar como obsoleta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
