import { HiBuildingOffice2, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import type { BusinessCapability } from "@/types/api";

interface CapabilityListProps {
    capabilities: BusinessCapability[];
    onEdit: (capability: BusinessCapability) => void;
    onDelete: (capability: BusinessCapability) => void;
}

/**
 * Tabla de capacidades de negocio con jerarquía (parent_id) y acciones CRUD.
 */
export function CapabilityList({
    capabilities,
    onEdit,
    onDelete,
}: CapabilityListProps) {
    if (capabilities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <HiBuildingOffice2 className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                    No hay capacidades de negocio configuradas
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
                    {capabilities.map((capability, i) => (
                        <tr
                            key={capability.id}
                            data-testid={
                                capability.parent_id
                                    ? `child-capability-${capability.id}`
                                    : undefined
                            }
                            className={
                                i < capabilities.length - 1 ? "border-b" : ""
                            }
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {capability.parent_id && (
                                        <span className="ml-4 text-muted-foreground">
                                            ↳
                                        </span>
                                    )}
                                    <HiBuildingOffice2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="font-medium">
                                        {capability.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                {capability.description ?? (
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
                                        onClick={() => onEdit(capability)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(capability)}
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
