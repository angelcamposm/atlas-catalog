/**
 * List component for Service Models
 *
 * Displays a table of service models with edit and delete actions.
 *
 * @example
 * <ServiceModelList
 *   models={models}
 *   onEdit={(model) => openEditDialog(model)}
 *   onDelete={(model) => openDeleteDialog(model)}
 * />
 */

import { HiCubeTransparent, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import type { ServiceModel } from "@/types/api";

interface ServiceModelListProps {
    /** Array of service models to display */
    models: ServiceModel[];
    /** Called when the user requests to edit a model */
    onEdit: (model: ServiceModel) => void;
    /** Called when the user requests to delete a model */
    onDelete: (model: ServiceModel) => void;
}

export function ServiceModelList({
    models,
    onEdit,
    onDelete,
}: ServiceModelListProps) {
    if (models.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <HiCubeTransparent className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4">No hay modelos de servicio configurados</p>
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
                            Descripción
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model) => (
                        <tr
                            key={model.id}
                            className="border-b border-border last:border-0"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <HiCubeTransparent className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">
                                        {model.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {model.description || "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Editar"
                                        onClick={() => onEdit(model)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(model)}
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
