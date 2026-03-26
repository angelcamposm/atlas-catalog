"use client";

import {
    HiOutlineShieldCheck,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineEye,
} from "react-icons/hi2";
import type { ComplianceStandard } from "@/types/api";

/**
 * Lista de estándares de compliance con acciones de ver, editar y eliminar.
 *
 * @example
 * <ComplianceStandardList
 *   standards={standards}
 *   onView={(id) => router.push(`/compliance/${id}`)}
 *   onEdit={(s) => openEditModal(s)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
interface ComplianceStandardListProps {
    /** Estándares de compliance a mostrar */
    standards: ComplianceStandard[];
    /** Callback cuando el usuario presiona ver detalle */
    onView?: (id: number) => void;
    /** Callback cuando el usuario presiona editar */
    onEdit?: (standard: ComplianceStandard) => void;
    /** Callback cuando el usuario presiona eliminar */
    onDelete?: (id: number) => void;
}

export function ComplianceStandardList({
    standards,
    onView,
    onEdit,
    onDelete,
}: ComplianceStandardListProps) {
    if (standards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <HiOutlineShieldCheck
                    data-testid="icon-shield"
                    className="w-12 h-12 mb-3 text-gray-300"
                />
                <p className="text-sm">
                    No hay estándares de compliance registrados
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre descriptivo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            País / Región
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Área
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {standards.map((standard) => (
                        <tr key={standard.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {standard.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {standard.display_name ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {standard.country_code ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {standard.focus_area ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onView?.(standard.id)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Ver detalle"
                                    >
                                        <HiOutlineEye
                                            data-testid="icon-eye"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(standard)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Editar"
                                    >
                                        <HiOutlinePencilSquare
                                            data-testid="icon-edit"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(standard.id)}
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
    );
}
