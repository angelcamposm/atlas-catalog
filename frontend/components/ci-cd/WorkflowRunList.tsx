import {
    HiOutlinePlay,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiOutlineEye,
} from "react-icons/hi2";
import type { WorkflowRun } from "@/types/api";

interface WorkflowRunListProps {
    runs: WorkflowRun[];
    onView?: (id: number) => void;
}

function StatusIcon({ status }: { status: string | null }) {
    if (status === "success")
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-600" />;
    if (status === "failure" || status === "failed")
        return <HiOutlineXCircle className="h-5 w-5 text-red-600" />;
    if (status === "running" || status === "in_progress")
        return <HiOutlinePlay className="h-5 w-5 text-blue-600" />;
    return <HiOutlineClock className="h-5 w-5 text-gray-400" />;
}

/**
 * Table listing CI/CD workflow runs.
 *
 * @example
 * <WorkflowRunList runs={runs} onView={handleView} />
 */
export function WorkflowRunList({ runs, onView }: WorkflowRunListProps) {
    if (runs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <HiOutlineClock className="mx-auto h-12 w-12 mb-3" />
                <p>No workflow runs found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Started
                        </th>
                        {onView && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {runs.map((run) => (
                        <tr key={run.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {run.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <StatusIcon status={run.status} />
                                    {run.status ?? "—"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {run.started_at
                                    ? run.started_at.slice(0, 10)
                                    : "—"}
                            </td>
                            {onView && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onView(run.id)}
                                        className="text-blue-600 hover:text-blue-900"
                                        aria-label={`View ${run.name}`}
                                    >
                                        <HiOutlineEye className="h-5 w-5" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
