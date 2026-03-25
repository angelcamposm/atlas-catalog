import { HiCodeBracket, HiPencil, HiTrash } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ProgrammingLanguage } from "@/types/api";

interface LanguageListProps {
    languages: ProgrammingLanguage[];
    onEdit: (language: ProgrammingLanguage) => void;
    onDelete: (language: ProgrammingLanguage) => void;
}

/**
 * Tabla de lenguajes de programación con acciones de edición y eliminación.
 */
export function LanguageList({ languages, onEdit, onDelete }: LanguageListProps) {
    if (languages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <HiCodeBracket className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                    No hay lenguajes de programación configurados
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
                            Estado
                        </th>
                        <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {languages.map((lang, i) => (
                        <tr
                            key={lang.id}
                            className={i < languages.length - 1 ? "border-b" : ""}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <HiCodeBracket className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{lang.name}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                {lang.is_enabled ? (
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
                                        onClick={() => onEdit(lang)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(lang)}
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
