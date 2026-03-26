"use client";

import { HiOutlineShieldCheck, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import type { AuthenticationMethod } from "@/types/api";

/**
 * Lista de métodos de autenticación con acciones de edición y eliminación.
 *
 * @example
 * <AuthMethodList
 *   methods={methods}
 *   onEdit={(m) => openEditModal(m)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
interface AuthMethodListProps {
    /** Métodos de autenticación a mostrar */
    methods: AuthenticationMethod[];
    /** Callback cuando el usuario presiona editar */
    onEdit?: (method: AuthenticationMethod) => void;
    /** Callback cuando el usuario presiona eliminar */
    onDelete?: (id: number) => void;
}

export function AuthMethodList({ methods, onEdit, onDelete }: AuthMethodListProps) {
    if (methods.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <HiOutlineShieldCheck data-testid="icon-shield" className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm">No hay métodos de autenticación registrados</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
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
                    {methods.map((method) => (
                        <tr key={method.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">{method.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {method.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {method.description ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit?.(method)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Editar"
                                    >
                                        <HiOutlinePencilSquare data-testid="icon-edit" className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(method.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Eliminar"
                                    >
                                        <HiOutlineTrash data-testid="icon-trash" className="w-4 h-4" />
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
