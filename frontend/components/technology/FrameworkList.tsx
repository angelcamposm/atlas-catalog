import { HiCodeBracket, HiPencil, HiTrash } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Framework } from "@/types/api";

interface FrameworkListProps {
    frameworks: Framework[];
    onEdit: (framework: Framework) => void;
    onDelete: (framework: Framework) => void;
}

/**
 * Tabla de frameworks con acciones de edición y eliminación.
 */
export function FrameworkList({
    frameworks,
    onEdit,
    onDelete,
}: FrameworkListProps) {
    if (frameworks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <HiCodeBracket className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                    No hay frameworks configurados
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
                        <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                            Estado
                        </th>
                        <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {frameworks.map((framework, i) => (
                        <tr
                            key={framework.id}
                            className={
                                i < frameworks.length - 1 ? "border-b" : ""
                            }
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <HiCodeBracket className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {framework.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                {framework.description ?? (
                                    <span className="italic">
                                        Sin descripción
                                    </span>
                                )}
                            </td>
                            <td className="p-4">
                                {framework.is_enabled ? (
                                    <Badge variant="success">Activo</Badge>
                                ) : (
                                    <Badge variant="secondary">Inactivo</Badge>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Editar"
                                        onClick={() => onEdit(framework)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(framework)}
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
