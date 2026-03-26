"use client";

import {
    HiOutlineDocumentText,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlinePlus,
} from "react-icons/hi2";
import type { ComplianceRequirement } from "@/types/api";

/**
 * Tabla de requerimientos de compliance con acciones de agregar, editar y eliminar.
 *
 * @example
 * <RequirementTable
 *   requirements={requirements}
 *   onAdd={() => openAddModal()}
 *   onEdit={(r) => openEditModal(r)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
interface RequirementTableProps {
    /** Requerimientos a mostrar */
    requirements: ComplianceRequirement[];
    /** Callback cuando el usuario presiona agregar */
    onAdd?: () => void;
    /** Callback cuando el usuario presiona editar */
    onEdit?: (requirement: ComplianceRequirement) => void;
    /** Callback cuando el usuario presiona eliminar */
    onDelete?: (id: number) => void;
}

export function RequirementTable({
    requirements,
    onAdd,
    onEdit,
    onDelete,
}: RequirementTableProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <button
                    onClick={() => onAdd?.()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    title="Agregar requerimiento"
                >
                    <HiOutlinePlus
                        data-testid="icon-plus"
                        className="w-4 h-4"
                    />
                    Agregar
                </button>
            </div>

            {requirements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <HiOutlineDocumentText
                        data-testid="icon-document"
                        className="w-10 h-10 mb-3 text-gray-300"
                    />
                    <p className="text-sm">
                        No hay requerimientos registrados para este estándar
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requirements.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {req.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {req.description ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit?.(req)}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Editar"
                                            >
                                                <HiOutlinePencilSquare
                                                    data-testid="icon-edit"
                                                    className="w-4 h-4"
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete?.(req.id)
                                                }
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Eliminar"
                                            >
                                                <HiOutlineTrash
                                                    data-testid="icon-trash"
                                                    className="w-4 h-4"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
