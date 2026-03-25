/**
 * EntityList — tabla de entidades de arquitectura con acciones de editar/eliminar.
 *
 * @example
 * <EntityList entities={entities} onEdit={handleEdit} onDelete={handleDelete} />
 */

import { HiOutlinePencil, HiOutlineTrash, HiSquares2X2 } from "react-icons/hi2";
import type { Entity } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface EntityListProps {
    /** Lista de entidades a mostrar */
    entities: Entity[];
    /** Callback al pulsar Editar */
    onEdit: (entity: Entity) => void;
    /** Callback al pulsar Eliminar */
    onDelete: (entity: Entity) => void;
}

export function EntityList({ entities, onEdit, onDelete }: EntityListProps) {
    if (entities.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-10 text-center">
                <HiSquares2X2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                    No hay entidades de arquitectura configuradas
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium">
                            Nombre
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                            Descripción
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                            Estado
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {entities.map((entity) => (
                        <tr key={entity.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2 font-medium">
                                    <HiSquares2X2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    {entity.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {entity.description ?? (
                                    <span className="italic text-muted-foreground/50">
                                        Sin descripción
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <Badge
                                    variant={
                                        entity.is_enabled
                                            ? "primary"
                                            : "secondary"
                                    }
                                >
                                    {entity.is_enabled ? "Activo" : "Inactivo"}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Editar"
                                        onClick={() => onEdit(entity)}
                                    >
                                        <HiOutlinePencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(entity)}
                                    >
                                        <HiOutlineTrash className="h-4 w-4" />
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
