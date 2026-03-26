"use client";

import { HiOutlineKey, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi2";
import type { ServiceAccountToken } from "@/types/api";

/**
 * Lista de tokens de una service account con botón para generar nuevos tokens.
 *
 * @example
 * <TokenList
 *   tokens={tokens}
 *   onGenerate={() => handleGenerate()}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
interface TokenListProps {
    /** Tokens a mostrar */
    tokens: ServiceAccountToken[];
    /** Callback para generar un nuevo token */
    onGenerate?: () => void;
    /** Callback para eliminar un token */
    onDelete?: (id: number) => void;
}

export function TokenList({ tokens, onGenerate, onDelete }: TokenListProps) {
    return (
        <div className="space-y-4">
            {/* Header with generate button */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                    Tokens de acceso
                </h3>
                <button
                    onClick={() => onGenerate?.()}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <HiOutlinePlus
                        data-testid="icon-plus"
                        className="w-4 h-4"
                    />
                    Generar token
                </button>
            </div>

            {tokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 rounded-lg border border-dashed border-gray-200">
                    <HiOutlineKey
                        data-testid="icon-key"
                        className="w-10 h-10 mb-2 text-gray-300"
                    />
                    <p className="text-sm">No hay tokens generados</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Token
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expira
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tokens.map((token) => (
                                <tr key={token.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {token.id}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                                        {token.token}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(
                                            token.expires_at,
                                        ).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onDelete?.(token.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Eliminar token"
                                        >
                                            <HiOutlineTrash
                                                data-testid="icon-trash"
                                                className="w-4 h-4"
                                            />
                                        </button>
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
