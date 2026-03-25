import { HiOutlineBuildingOffice2, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import type { Vendor } from "@/types/api";

interface VendorListProps {
    vendors: Vendor[];
    onEdit: (vendor: Vendor) => void;
    onDelete: (vendor: Vendor) => void;
}

/**
 * Tabla de vendors con acciones de edición y eliminación.
 */
export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
    if (vendors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <HiOutlineBuildingOffice2 className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                    No vendors configured
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
                            Name
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                            URL
                        </th>
                        <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map((vendor, i) => (
                        <tr
                            key={vendor.id}
                            className={i < vendors.length - 1 ? "border-b" : ""}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <HiOutlineBuildingOffice2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {vendor.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                {vendor.url || "—"}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label="Edit"
                                        onClick={() => onEdit(vendor)}
                                    >
                                        <HiPencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        aria-label="Delete"
                                        onClick={() => onDelete(vendor)}
                                        className="text-destructive hover:text-destructive hover:border-destructive"
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
