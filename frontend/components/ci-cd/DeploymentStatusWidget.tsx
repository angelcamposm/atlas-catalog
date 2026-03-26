import {
    HiOutlineRocketLaunch,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
} from "react-icons/hi2";
import type { CiDeployment } from "@/types/api";

/**
 * Widget showing recent deployments with status indicators.
 *
 * @example
 * <DeploymentStatusWidget deployments={recentDeployments} />
 */
interface DeploymentStatusWidgetProps {
    /** List of recent deployments to display */
    deployments: CiDeployment[];
}

function StatusIcon({ status }: { status: string | null }) {
    if (status === "success")
        return (
            <HiOutlineCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
        );
    if (status === "failure")
        return (
            <HiOutlineXCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        );
    if (status === "in_progress")
        return (
            <HiOutlineRocketLaunch className="w-4 h-4 text-blue-500 flex-shrink-0" />
        );
    return <HiOutlineClock className="w-4 h-4 text-gray-400 flex-shrink-0" />;
}

export function DeploymentStatusWidget({
    deployments,
}: DeploymentStatusWidgetProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Recent Deployments
            </h3>

            {deployments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                    No recent deployments
                </p>
            ) : (
                <ul className="space-y-2">
                    {deployments.map((deployment) => (
                        <li
                            key={deployment.id}
                            className="flex items-center gap-3 text-sm"
                        >
                            <StatusIcon status={deployment.status ?? null} />
                            <span className="flex-1 truncate text-gray-800 dark:text-gray-200">
                                {deployment.version ?? "—"}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                                {deployment.status ?? "—"}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
