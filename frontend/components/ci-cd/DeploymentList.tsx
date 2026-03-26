import type { CiDeployment } from "@/types/api";
import {
    HiOutlineEye,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePlay,
    HiOutlineClock,
} from "react-icons/hi2";

interface DeploymentListProps {
    deployments: CiDeployment[];
    onView?: (id: number) => void;
}

function StatusIcon({ status }: { status: string | null }) {
    switch (status) {
        case "success":
            return (
                <HiOutlineCheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
            );
        case "failure":
        case "failed":
            return (
                <HiOutlineXCircle className="h-4 w-4 text-red-500 inline mr-1" />
            );
        case "running":
        case "in_progress":
            return (
                <HiOutlinePlay className="h-4 w-4 text-blue-500 inline mr-1" />
            );
        default:
            return (
                <HiOutlineClock className="h-4 w-4 text-gray-400 inline mr-1" />
            );
    }
}

/**
 * Table listing CI/CD deployments (read-only, no create/delete).
 *
 * @example
 * <DeploymentList deployments={deployments} onView={handleView} />
 */
export function DeploymentList({ deployments, onView }: DeploymentListProps) {
    if (deployments.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No deployments found</p>
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
                            Started At
                        </th>
                        {onView && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {deployments.map((deployment) => (
                        <tr key={deployment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {deployment.version ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <StatusIcon status={deployment.status ?? null} />
                                {deployment.status ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {deployment.started_at
                                    ? deployment.started_at.slice(0, 10)
                                    : "—"}
                            </td>
                            {onView && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        aria-label="View"
                                        onClick={() => onView(deployment.id)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <HiOutlineEye className="h-4 w-4 inline" />
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
