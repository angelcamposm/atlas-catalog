/**
 * List component for Environments
 *
 * Displays a table of environments with edit and delete actions.
 *
 * @example
 * <EnvironmentList
 *   environments={environments}
 *   onEdit={(env) => openEditDialog(env)}
 *   onDelete={(env) => openDeleteDialog(env)}
 * />
 */

import { HiServerStack, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Environment } from "@/types/api";

interface EnvironmentListProps {
    /** Array of environments to display */
    environments: Environment[];
    /** Called when the user requests to edit an environment */
    onEdit: (environment: Environment) => void;
    /** Called when the user requests to delete an environment */
    onDelete: (environment: Environment) => void;
}

export function EnvironmentList({
    environments,
    onEdit,
    onDelete,
}: EnvironmentListProps) {
    if (environments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <HiServerStack className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4">No hay entornos configurados</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Etiqueta
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Aprobación
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Descripción
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {environments.map((env) => (
                        <tr
                            key={env.id}
                            className="border-b border-border last:border-0"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <HiServerStack className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">
                                        {env.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {env.label || "—"}
                            </td>
                            <td className="px-4 py-3">
                                {env.approval_required ? (
                                    <Badge variant="warning">
                                        Requiere aprobación
                                    </Badge>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        —
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {env.description || "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Editar"
                                        onClick={() => onEdit(env)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(env)}
                                    >
                                        <HiTrash className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
