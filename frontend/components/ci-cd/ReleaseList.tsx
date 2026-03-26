import type { CiRelease } from "@/types/api";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

interface ReleaseListProps {
    releases: CiRelease[];
    onView?: (id: number) => void;
    onEdit?: (release: CiRelease) => void;
    onDelete?: (id: number) => void;
}

/**
 * Table listing CI/CD releases with optional CRUD actions.
 *
 * @example
 * <ReleaseList releases={releases} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
 */
export function ReleaseList({
    releases,
    onView,
    onEdit,
    onDelete,
}: ReleaseListProps) {
    const hasActions = onView || onEdit || onDelete;

    if (releases.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No releases found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Version
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Released At
                        </th>
                        {hasActions && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {releases.map((release) => (
                        <tr key={release.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {release.version ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {release.status ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {release.released_at
                                    ? release.released_at.slice(0, 10)
                                    : "—"}
                            </td>
                            {hasActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {onView && (
                                        <button
                                            aria-label="View"
                                            onClick={() => onView(release.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <HiOutlineEye className="h-4 w-4 inline" />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            aria-label="Edit"
                                            onClick={() => onEdit(release)}
                                            className="text-yellow-600 hover:text-yellow-900"
                                        >
                                            <HiOutlinePencil className="h-4 w-4 inline" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            aria-label="Delete"
                                            onClick={() => onDelete(release.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <HiOutlineTrash className="h-4 w-4 inline" />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
