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
import { lifecyclesApi } from "@/lib/api/lifecycles";
import { groupsApi } from "@/lib/api/groups";
import { authenticationMethodsApi } from "@/lib/api/technology";
import { Protocol } from "@/types/api";
import type { ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineInformationCircle,
    HiOutlineExclamationTriangle,
    HiOutlineDocumentText,
    HiOutlineCog6Tooth,
    HiOutlineUserGroup,
    HiOutlineCloudArrowUp,
} from "react-icons/hi2";

// Form data type
interface ApiFormData {
    // Step 1: Basic Info
    name: string;
    display_name: string | null;
    description: string | null;
    version: string | null;

    // Step 2: Configuration
    url: string;
    protocol: Protocol | null;
    type_id: number | null;
    status_id: number | null;
    category_id: number | null;
    access_policy_id: number | null;
    authentication_method_id: number | null;

    // Step 3: Ownership
    owner_id: number | null;

    // Step 4: Documentation
    document_specification: string | null;
}

// Step configuration
const steps = [
    {
        id: 1,
        title: "Información básica",
        description: "Nombre, descripción y versión",
        icon: HiOutlineDocumentText,
    },
    {
        id: 2,
        title: "Configuración",
        description: "URL, protocolo y clasificación",
        icon: HiOutlineCog6Tooth,
    },
    {
        id: 3,
        title: "Propiedad",
        description: "Equipo responsable",
        icon: HiOutlineUserGroup,
    },
    {
        id: 4,
        title: "Documentación",
        description: "Especificación OpenAPI",
        icon: HiOutlineCloudArrowUp,
    },
];

interface CreateApiWizardProps {
    duplicateFrom?: number;
    onSuccess?: (apiId: number) => void;
    onCancel?: () => void;
}

export function CreateApiWizard({
    duplicateFrom,
    onSuccess,
    onCancel,
}: CreateApiWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState<ApiFormData>({
        name: "",
        display_name: null,
        description: null,
        version: null,
        url: "",
        protocol: Protocol.HTTPS,
        type_id: null,
        status_id: null,
        category_id: null,
        access_policy_id: null,
        authentication_method_id: null,
        owner_id: null,
        document_specification: null,
    });

    // Field errors
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof ApiFormData, string>>
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
    const [groups, setGroups] = useState<Group[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    // Load options and duplicate data
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
                    groupsRes,
                ] = await Promise.all([
                    apiTypesApi.getAll().catch(() => ({ data: [] })),
                    apiStatusesApi.getAll().catch(() => ({ data: [] })),
                    apiCategoriesApi.getAll().catch(() => ({ data: [] })),
                    apiAccessPoliciesApi.getAll().catch(() => ({ data: [] })),
                    authenticationMethodsApi
                        .getAll()
                        .catch(() => ({ data: [] })),
                    lifecyclesApi.getAll().catch(() => ({ data: [] })),
                    groupsApi.getAll().catch(() => ({ data: [] })),
                ]);

                setApiTypes(typesRes.data || []);
                setApiStatuses(statusesRes.data || []);
                setApiCategories(categoriesRes.data || []);
                setApiAccessPolicies(accessesRes.data || []);
                setAuthenticationMethods(authRes.data || []);
                setLifecycles(lifecyclesRes.data || []);
                setGroups(groupsRes.data || []);

                // Load duplicate data if provided
                if (duplicateFrom) {
                    try {
                        const apiRes = await apisApi.getById(duplicateFrom);
                        const api = apiRes.data;
                        setFormData({
                            name: `${api.name} (copia)`,
                            display_name: api.display_name ?? null,
                            description: api.description ?? null,
                            version: api.version ?? null,
                            url: api.url ?? "",
                            protocol: api.protocol ?? Protocol.HTTPS,
                            type_id: api.type_id ?? null,
                            status_id: api.status_id ?? null,
                            category_id: api.category_id ?? null,
                            access_policy_id: api.access_policy_id ?? null,
                            authentication_method_id:
                                api.authentication_method_id ?? null,
                            owner_id: null, // Don't copy owner
                            document_specification:
                                typeof api.document_specification === "string"
                                    ? api.document_specification
                                    : api.document_specification
                                    ? JSON.stringify(
                                          api.document_specification,
                                          null,
                                          2
                                      )
                                    : null,
                        });
                    } catch (err) {
                        console.error("Error loading API to duplicate:", err);
                    }
                }
            } catch (err) {
                console.error("Error loading form options:", err);
            } finally {
                setLoadingOptions(false);
            }
        };

        void loadOptions();
    }, [duplicateFrom]);

    // Update form field
    const updateField = useCallback(
        <K extends keyof ApiFormData>(field: K, value: ApiFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            // Clear field error when user modifies the field
            if (fieldErrors[field]) {
                setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [fieldErrors]
    );

    // Validate current step
    const validateStep = useCallback((): boolean => {
        const errors: Partial<Record<keyof ApiFormData, string>> = {};

        if (currentStep === 1) {
            if (!formData.name.trim()) {
                errors.name = "El nombre es obligatorio";
            } else if (formData.name.length > 255) {
                errors.name = "El nombre no puede superar los 255 caracteres";
            }
            if (formData.description && formData.description.length > 2000) {
                errors.description =
                    "La descripción no puede superar los 2000 caracteres";
            }
        }

        if (currentStep === 2) {
            if (formData.url && formData.url.trim()) {
                try {
                    new URL(formData.url);
                } catch {
                    errors.url = "La URL no es válida";
                }
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }, [currentStep, formData]);

    // Handle next step
    const handleNext = useCallback(() => {
        if (validateStep() && currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [validateStep, currentStep]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Prepare data for API (convert null to undefined)
            const submitData = {
                name: formData.name.trim(),
                display_name: formData.display_name?.trim() || undefined,
                description: formData.description?.trim() || undefined,
                version: formData.version?.trim() || undefined,
                url: formData.url?.trim() || undefined,
                protocol: formData.protocol || undefined,
                type_id: formData.type_id ?? undefined,
                status_id: formData.status_id ?? undefined,
                category_id: formData.category_id ?? undefined,
                access_policy_id:
                    (formData as any).access_policy_id ?? undefined,
                authentication_method_id:
                    (formData as any).authentication_method_id ?? undefined,
                document_specification: formData.document_specification
                    ? JSON.parse(formData.document_specification)
                    : undefined,
            };

            const response = await apisApi.create(submitData);

            if (onSuccess) {
                onSuccess(response.data.id);
            } else {
                router.push(`/apis/${response.data.id}`);
            }
        } catch (err) {
            console.error("Error creating API:", err);
            setSubmitError(
                "No se ha podido crear la API. Por favor, inténtalo de nuevo."
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateStep, router, onSuccess]);

    // Handle cancel
    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        } else {
            router.push("/apis");
        }
    }, [router, onCancel]);

    // Render step indicator
    const renderStepIndicator = () => (
        <nav aria-label="Progress" className="mb-8">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isComplete = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <li
                            key={step.id}
                            className={cn("relative", index !== 0 && "flex-1")}
                        >
                            {index !== 0 && (
                                <div
                                    className={cn(
                                        "absolute top-5 left-0 -translate-y-1/2 h-0.5 w-full -ml-4",
                                        isComplete || isCurrent
                                            ? "bg-primary-500"
                                            : "bg-gray-200 dark:bg-gray-700"
                                    )}
                                />
                            )}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors",
                                        isComplete &&
                                            "bg-primary-500 text-white",
                                        isCurrent &&
                                            "bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 text-primary-600 dark:text-primary-400",
                                        !isComplete &&
                                            !isCurrent &&
                                            "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400"
                                    )}
                                >
                                    {isComplete ? (
                                        <HiOutlineCheck className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium text-center hidden sm:block",
                                        isCurrent
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );

    // Render step content
    const renderStepContent = () => {
        if (loadingOptions) {
            return (
                <div className="py-12 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Cargando opciones...
                    </p>
                </div>
            );
        }

        switch (currentStep) {
            case 1:
                return renderBasicInfoStep();
            case 2:
                return renderConfigurationStep();
            case 3:
                return renderOwnershipStep();
            case 4:
                return renderDocumentationStep();
            default:
                return null;
        }
    };

    // Step 1: Basic Info
    const renderBasicInfoStep = () => (
        <div className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={cn(
                        "w-full px-4 py-2 border rounded-lg transition-colors",
                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500",
                        fieldErrors.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="mi-api-ejemplo"
                />
                {fieldErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.name}
                    </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Identificador único de la API (slug)
                </p>
            </div>

            <div>
                <label
                    htmlFor="display_name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Nombre para mostrar
                </label>
                <input
                    type="text"
                    id="display_name"
                    value={formData.display_name ?? ""}
                    onChange={(e) =>
                        updateField("display_name", e.target.value || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Mi API de Ejemplo"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Nombre legible para mostrar en la interfaz
                </p>
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Descripción
                </label>
                <textarea
                    id="description"
                    value={formData.description ?? ""}
                    onChange={(e) =>
                        updateField("description", e.target.value || null)
                    }
                    rows={4}
                    className={cn(
                        "w-full px-4 py-2 border rounded-lg transition-colors resize-none",
                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500",
                        fieldErrors.description
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="Describe brevemente el propósito y funcionalidad de esta API..."
                />
                {fieldErrors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.description}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="version"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Versión
                </label>
                <input
                    type="text"
                    id="version"
                    value={formData.version ?? ""}
                    onChange={(e) =>
                        updateField("version", e.target.value || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1.0.0"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Versión semántica (ej: 1.0.0, 2.1.3)
                </p>
            </div>
        </div>
    );

    // Step 2: Configuration
    const renderConfigurationStep = () => (
        <div className="space-y-6">
            <div>
                <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    URL Base
                </label>
                <input
                    type="url"
                    id="url"
                    value={formData.url ?? ""}
                    onChange={(e) => updateField("url", e.target.value)}
                    className={cn(
                        "w-full px-4 py-2 border rounded-lg transition-colors",
                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500",
                        fieldErrors.url
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="https://api.ejemplo.com/v1"
                />
                {fieldErrors.url && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.url}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Protocolo
                </label>
                <div className="flex gap-4">
                    {[Protocol.HTTPS, Protocol.HTTP].map((protocol) => (
                        <label
                            key={protocol}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                                formData.protocol === protocol
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                            )}
                        >
                            <input
                                type="radio"
                                name="protocol"
                                value={protocol}
                                checked={formData.protocol === protocol}
                                onChange={() =>
                                    updateField("protocol", protocol)
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
                            <span className="text-sm">
                                {protocol === Protocol.HTTPS
                                    ? "Conexión segura"
                                    : "Sin cifrar"}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="type_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Tipo de API
                </label>
                <select
                    id="type_id"
                    value={formData.type_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "type_id",
                            e.target.value ? parseInt(e.target.value, 10) : null
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
            </div>

            <div>
                <label
                    htmlFor="status_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Estado
                </label>
                <select
                    id="status_id"
                    value={formData.status_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "status_id",
                            e.target.value ? parseInt(e.target.value, 10) : null
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
            </div>

            <div>
                <label
                    htmlFor="access_policy_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Política de Acceso
                </label>
                <select
                    id="access_policy_id"
                    value={(formData as any).access_policy_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "access_policy_id" as any,
                            e.target.value ? parseInt(e.target.value, 10) : null
                        )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Seleccionar política...</option>
                    {apiAccessPolicies.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="authentication_method_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Método de Autenticación
                </label>
                <select
                    id="authentication_method_id"
                    value={(formData as any).authentication_method_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "authentication_method_id" as any,
                            e.target.value ? parseInt(e.target.value, 10) : null
                        )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Seleccionar método...</option>
                    {authenticationMethods.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Ciclo de vida
                </label>
                <select
                    id="category_id"
                    value={formData.category_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "category_id",
                            e.target.value ? parseInt(e.target.value, 10) : null
                        )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Seleccionar ciclo de vida...</option>
                    {lifecycles.map((lifecycle) => (
                        <option key={lifecycle.id} value={lifecycle.id}>
                            {lifecycle.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    // Step 3: Ownership
    const renderOwnershipStep = () => (
        <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-3">
                    <HiOutlineInformationCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                            Asignación de propietario
                        </h4>
                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                            Selecciona el equipo responsable de mantener y
                            gestionar esta API. El propietario recibirá
                            notificaciones sobre cambios y problemas.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label
                    htmlFor="owner_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Equipo propietario
                </label>
                <select
                    id="owner_id"
                    value={formData.owner_id ?? ""}
                    onChange={(e) =>
                        updateField(
                            "owner_id",
                            e.target.value ? parseInt(e.target.value, 10) : null
                        )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Seleccionar equipo...</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Puedes dejarlo vacío y asignarlo más tarde
                </p>
            </div>
        </div>
    );

    // Step 4: Documentation
    const renderDocumentationStep = () => (
        <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex gap-3">
                    <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                            Documentación opcional
                        </h4>
                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                            Puedes pegar aquí tu especificación OpenAPI/Swagger
                            en formato JSON o YAML. También puedes añadirla o
                            actualizarla más tarde.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label
                    htmlFor="document_specification"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Especificación OpenAPI
                </label>
                <textarea
                    id="document_specification"
                    value={formData.document_specification ?? ""}
                    onChange={(e) =>
                        updateField(
                            "document_specification",
                            e.target.value || null
                        )
                    }
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder={`{
  "openapi": "3.0.0",
  "info": {
    "title": "Mi API",
    "version": "1.0.0"
  },
  ...
}`}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto pb-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {duplicateFrom ? "Duplicar API" : "Crear nueva API"}
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {steps[currentStep - 1].description}
                </p>
            </div>

            {/* Step indicator */}
            {renderStepIndicator()}

            {/* Step content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    {steps[currentStep - 1].title}
                </h2>
                {renderStepContent()}
            </div>

            {/* Error message */}
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex gap-3">
                        <HiOutlineExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            {submitError}
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    <HiOutlineXMark className="w-5 h-5" />
                    Cancelar
                </button>

                <div className="flex items-center gap-3">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" />
                            Anterior
                        </button>
                    )}

                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Siguiente
                            <HiOutlineArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors",
                                isSubmitting
                                    ? "bg-primary-400 cursor-not-allowed"
                                    : "bg-primary-600 hover:bg-primary-700"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <HiOutlineCheck className="w-4 h-4" />
                                    Crear API
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
