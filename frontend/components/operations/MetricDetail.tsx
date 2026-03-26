import {
    HiOutlineChartBar,
    HiOutlinePencilSquare,
    HiOutlineTrash,
} from "react-icons/hi2";
import type { Metric } from "@/types/api";

/**
 * Detail view for a single metric showing all fields and optional actions
 *
 * @example
 * <MetricDetail
 *   metric={metric}
 *   onEdit={(id) => openEditDialog(id)}
 *   onDelete={(id) => confirmDelete(id)}
 * />
 */
interface MetricDetailProps {
    /** The metric to display */
    metric: Metric;
    /** Called with metric id when Edit is clicked */
    onEdit?: (id: number) => void;
    /** Called with metric id when Delete is clicked */
    onDelete?: (id: number) => void;
}

export function MetricDetail({ metric, onEdit, onDelete }: MetricDetailProps) {
    const hasActions = onEdit || onDelete;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <HiOutlineChartBar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {metric.name}
                        </h2>
                    </div>
                </div>
                {hasActions && (
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(metric.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100"
                                title="Edit"
                            >
                                <HiOutlinePencilSquare className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(metric.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                                title="Delete"
                            >
                                <HiOutlineTrash className="w-4 h-4" />
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {metric.value}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {metric.unit ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Definition ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {metric.metric_definition_id}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Component ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {metric.component_id ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {new Date(metric.created_at).toLocaleDateString()}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                        {new Date(metric.updated_at).toLocaleDateString()}
                    </dd>
                </div>
            </div>
        </div>
    );
}
