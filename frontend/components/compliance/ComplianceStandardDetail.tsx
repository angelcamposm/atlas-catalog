"use client";

import { HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineDocumentText } from "react-icons/hi2";
import type { ComplianceStandard, ComplianceRequirement } from "@/types/api";
import { RequirementTable } from "./RequirementTable";

/**
 * Detalle de un estándar de compliance. Muestra la información del estándar
 * y una tabla de requerimientos asociados (CRUD inline).
 *
 * @example
 * <ComplianceStandardDetail
 *   standard={standard}
 *   requirements={requirements}
 *   onAddRequirement={() => openAddModal()}
 *   onEditRequirement={(r) => openEditModal(r)}
 *   onDeleteRequirement={(id) => handleDelete(id)}
 * />
 */
interface ComplianceStandardDetailProps {
    /** Estándar de compliance a mostrar */
    standard: ComplianceStandard;
    /** Requerimientos del estándar */
    requirements: ComplianceRequirement[];
    /** Callback para agregar un requerimiento */
    onAddRequirement?: () => void;
    /** Callback para editar un requerimiento */
    onEditRequirement?: (requirement: ComplianceRequirement) => void;
    /** Callback para eliminar un requerimiento */
    onDeleteRequirement?: (id: number) => void;
}

export function ComplianceStandardDetail({
    standard,
    requirements,
    onAddRequirement,
    onEditRequirement,
    onDeleteRequirement,
}: ComplianceStandardDetailProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <HiOutlineShieldCheck
                            data-testid="icon-shield"
                            className="w-6 h-6 text-primary"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {standard.name}
                            </h2>
                            {standard.display_name && (
                                <span className="text-sm text-gray-500">
                                    {standard.display_name}
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {requirements.length}
                            </span>
                        </div>
                        {standard.description && (
                            <p className="mt-1 text-sm text-gray-600">{standard.description}</p>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {standard.country_code && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                País / Región
                            </p>
                            <p className="mt-1 text-sm text-gray-900">{standard.country_code}</p>
                        </div>
                    )}
                    {standard.focus_area && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Área
                            </p>
                            <p className="mt-1 text-sm text-gray-900">{standard.focus_area}</p>
                        </div>
                    )}
                    {standard.industry && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Industria
                            </p>
                            <p className="mt-1 text-sm text-gray-900">{standard.industry}</p>
                        </div>
                    )}
                    {standard.url && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                URL
                            </p>
                            <a
                                href={standard.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                                <HiOutlineGlobeAlt className="w-3 h-3" />
                                Referencia
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Requirements section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-base font-medium text-gray-900">Requerimientos</h3>
                </div>
                <RequirementTable
                    requirements={requirements}
                    onAdd={onAddRequirement}
                    onEdit={onEditRequirement}
                    onDelete={onDeleteRequirement}
                />
            </div>
        </div>
    );
}
