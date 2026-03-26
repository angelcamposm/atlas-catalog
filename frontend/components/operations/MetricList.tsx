import {
    HiOutlineChartBar,
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlineTrash,
} from "react-icons/hi2";
import type { Metric } from "@/types/api";

/**
 * Table listing metrics with optional CRUD actions
 *
 * @example
 * <MetricList
 *   metrics={metrics}
 *   onView={(id) => router.push(`/operations/metrics/${id}`)}
 *   onEdit={(id) => openEditDialog(id)}
 *   onDelete={(id) => confirmDelete(id)}
 * />
 */
interface MetricListProps {
    /** List of metrics to display */
    metrics: Metric[];
    /** Called with metric id when View is clicked */
    onView?: (id: number) => void;
    /** Called with metric id when Edit is clicked */
    onEdit?: (id: number) => void;
    /** Called with metric id when Delete is clicked */
    onDelete?: (id: number) => void;
}

export function MetricList({
    metrics,
    onView,
    onEdit,
    onDelete,
}: MetricListProps) {
    const hasActions = onView || onEdit || onDelete;

    if (metrics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <HiOutlineChartBar className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm">No metrics found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Definition ID
                        </th>
                        {hasActions && (
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.map((metric) => (
                        <tr key={metric.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {metric.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {metric.value}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {metric.unit ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {metric.metric_definition_id}
                            </td>
                            {hasActions && (
                                <td className="px-4 py-3 text-right text-sm">
                                    <div className="flex items-center justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() =>
                                                    onView(metric.id)
                                                }
                                                className="text-gray-400 hover:text-blue-600"
                                                title="View"
                                            >
                                                <HiOutlineEye className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() =>
                                                    onEdit(metric.id)
                                                }
                                                className="text-gray-400 hover:text-amber-600"
                                                title="Edit"
                                            >
                                                <HiOutlinePencilSquare className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() =>
                                                    onDelete(metric.id)
                                                }
                                                className="text-gray-400 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
