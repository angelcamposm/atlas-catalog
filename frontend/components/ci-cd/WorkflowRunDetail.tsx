import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePlay,
    HiOutlineClock,
} from "react-icons/hi2";
import type { WorkflowRun, WorkflowJob, WorkflowCommit } from "@/types/api";

interface WorkflowRunDetailProps {
    run: WorkflowRun;
    jobs: WorkflowJob[];
    commits: WorkflowCommit[];
}

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return <span className="text-gray-500">—</span>;
    const colors: Record<string, string> = {
        success: "bg-green-100 text-green-800",
        failure: "bg-red-100 text-red-800",
        failed: "bg-red-100 text-red-800",
        running: "bg-blue-100 text-blue-800",
        in_progress: "bg-blue-100 text-blue-800",
    };
    const cls = colors[status] ?? "bg-gray-100 text-gray-800";
    return (
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls}`}
        >
            {status}
        </span>
    );
}

/**
 * Detailed view of a workflow run including jobs and commits.
 *
 * @example
 * <WorkflowRunDetail run={run} jobs={jobs} commits={commits} />
 */
export function WorkflowRunDetail({
    run,
    jobs,
    commits,
}: WorkflowRunDetailProps) {
    return (
        <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {run.name}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <StatusBadge status={run.status} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Started
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {run.started_at
                                ? run.started_at.slice(0, 10)
                                : "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">
                            Finished
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {run.finished_at
                                ? run.finished_at.slice(0, 10)
                                : "—"}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Jobs */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Jobs
                </h3>
                {jobs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No jobs found</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <li
                                key={job.id}
                                className="py-3 flex items-center justify-between"
                            >
                                <span className="text-sm font-medium text-gray-900">
                                    {job.name}
                                </span>
                                <StatusBadge status={job.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Commits */}
            {commits.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Commits
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        {commits.map((commit) => (
                            <li key={commit.id} className="py-3">
                                <div className="flex items-start gap-3">
                                    <code className="text-xs text-gray-500 font-mono">
                                        {commit.sha.slice(0, 7)}
                                    </code>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">
                                            {commit.message ?? "—"}
                                        </p>
                                        {commit.author && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {commit.author}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
