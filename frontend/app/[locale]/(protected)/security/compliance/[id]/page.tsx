"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { complianceStandardsApi, complianceRequirementsApi } from "@/lib/api";
import { ComplianceStandardDetail } from "@/components/compliance/ComplianceStandardDetail";
import type { ComplianceStandard, ComplianceRequirement } from "@/types/api";

export default function ComplianceStandardDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();

    const [standard, setStandard] = useState<ComplianceStandard | null>(null);
    const [requirements, setRequirements] = useState<ComplianceRequirement[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [standardResponse, requirementsResponse] = await Promise.all([
                complianceStandardsApi.getById(parseInt(id)),
                complianceRequirementsApi.getAll(),
            ]);

            setStandard(standardResponse.data);
            // Filter requirements belonging to this standard
            const filtered = requirementsResponse.data.filter(
                (r) => r.compliance_standard_id === parseInt(id),
            );
            setRequirements(filtered);
        } catch (err) {
            console.error("Error loading compliance standard:", err);
            setError("Error al cargar el estándar de compliance");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddRequirement = async () => {
        const name = prompt("Nombre del requerimiento:");
        if (!name?.trim()) return;
        try {
            const response = await complianceRequirementsApi.create({
                compliance_standard_id: parseInt(id),
                name: name.trim(),
            });
            setRequirements((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error creating requirement:", err);
            alert("Error al crear el requerimiento");
        }
    };

    const handleEditRequirement = async (
        requirement: ComplianceRequirement,
    ) => {
        const name = prompt("Nuevo nombre:", requirement.name);
        if (!name?.trim() || name.trim() === requirement.name) return;
        try {
            const response = await complianceRequirementsApi.update(
                requirement.id,
                {
                    name: name.trim(),
                },
            );
            setRequirements((prev) =>
                prev.map((r) => (r.id === requirement.id ? response.data : r)),
            );
        } catch (err) {
            console.error("Error updating requirement:", err);
            alert("Error al actualizar el requerimiento");
        }
    };

    const handleDeleteRequirement = async (requirementId: number) => {
        if (!confirm("¿Eliminar este requerimiento?")) return;
        try {
            await complianceRequirementsApi.delete(requirementId);
            setRequirements((prev) =>
                prev.filter((r) => r.id !== requirementId),
            );
        } catch (err) {
            console.error("Error deleting requirement:", err);
            alert("Error al eliminar el requerimiento");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                    <p className="text-gray-500 text-sm">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !standard) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/security/compliance`}>
                        <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <HiArrowLeft className="w-4 h-4" />
                            Volver
                        </button>
                    </Link>
                </div>
                <p className="text-red-600">
                    {error ?? "Estándar de compliance no encontrado"}
                </p>
                <button
                    onClick={loadData}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link
                    href={`/${locale}/security/compliance`}
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Compliance Standards
                </Link>
                <span>/</span>
                <span className="text-gray-900">{standard.name}</span>
            </div>

            {/* Detail + Requirements */}
            <ComplianceStandardDetail
                standard={standard}
                requirements={requirements}
                onAddRequirement={handleAddRequirement}
                onEditRequirement={handleEditRequirement}
                onDeleteRequirement={handleDeleteRequirement}
            />

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() =>
                        router.push(`/${locale}/security/compliance`)
                    }
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Volver a la lista
                </button>
            </div>
        </div>
    );
}
