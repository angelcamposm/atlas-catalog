"use client";

import {
    HiOutlineComputerDesktop,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineEye,
} from "react-icons/hi2";
import type { ServiceAccount } from "@/types/api";

/**
 * Lista de service accounts con acciones de vista, edición y eliminación.
 *
 * @example
 * <ServiceAccountList
 *   accounts={accounts}
 *   onView={(id) => router.push(`/security/service-accounts/${id}`)}
 *   onEdit={(account) => openEditModal(account)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
interface ServiceAccountListProps {
    /** Cuentas de servicio a mostrar */
    accounts: ServiceAccount[];
    /** Callback al ver detalle */
    onView?: (id: number) => void;
    /** Callback al editar */
    onEdit?: (account: ServiceAccount) => void;
    /** Callback al eliminar */
    onDelete?: (id: number) => void;
}

export function ServiceAccountList({
    accounts,
    onView,
    onEdit,
    onDelete,
}: ServiceAccountListProps) {
    if (accounts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <HiOutlineComputerDesktop
                    data-testid="icon-computer"
                    className="w-12 h-12 mb-3 text-gray-300"
                />
                <p className="text-sm">No hay service accounts registradas</p>
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
                            Namespace
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {account.id}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {account.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {account.namespace ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onView?.(account.id)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Ver detalle"
                                    >
                                        <HiOutlineEye
                                            data-testid="icon-view"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(account)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Editar"
                                    >
                                        <HiOutlinePencilSquare
                                            data-testid="icon-edit"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(account.id)}
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
