/**
 * List component for Infrastructure Types
 *
 * Displays a table of infrastructure types with edit and delete actions.
 *
 * @example
 * <InfrastructureTypeList
 *   infrastructureTypes={types}
 *   onEdit={(type) => openEditDialog(type)}
 *   onDelete={(type) => openDeleteDialog(type)}
 * />
 */

import { HiServerStack, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import type { InfrastructureType } from "@/types/api";

interface InfrastructureTypeListProps {
    /** Array of infrastructure types to display */
    infrastructureTypes: InfrastructureType[];
    /** Called when the user requests to edit an infrastructure type */
    onEdit: (infrastructureType: InfrastructureType) => void;
    /** Called when the user requests to delete an infrastructure type */
    onDelete: (infrastructureType: InfrastructureType) => void;
}

export function InfrastructureTypeList({
    infrastructureTypes,
    onEdit,
    onDelete,
}: InfrastructureTypeListProps) {
    if (infrastructureTypes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <HiServerStack className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4">No infrastructure types configured</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {infrastructureTypes.map((type) => (
                        <tr
                            key={type.id}
                            className="border-b border-border last:border-0"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <HiServerStack className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">
                                        {type.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {type.description || "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(type)}
                                        aria-label="Edit"
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDelete(type)}
                                        className="text-destructive hover:text-destructive hover:border-destructive"
                                        aria-label="Delete"
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
