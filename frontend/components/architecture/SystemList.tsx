import { HiServerStack, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import type { System } from "@/types/api";

interface SystemListProps {
    systems: System[];
    onEdit: (system: System) => void;
    onDelete: (system: System) => void;
}

/**
 * Tabla de sistemas de arquitectura con acciones CRUD.
 */
export function SystemList({ systems, onEdit, onDelete }: SystemListProps) {
    if (systems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <HiServerStack className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                    No hay sistemas de arquitectura configurados
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted/30">
                        <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                            Nombre
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                            Descripción
                        </th>
                        <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {systems.map((system, i) => (
                        <tr
                            key={system.id}
                            className={i < systems.length - 1 ? "border-b" : ""}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <HiServerStack className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="font-medium">
                                        {system.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                {system.description ?? (
                                    <span className="italic">
                                        Sin descripción
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Editar"
                                        onClick={() => onEdit(system)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(system)}
                                    >
                                        <HiTrash className="h-4 w-4" />
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
