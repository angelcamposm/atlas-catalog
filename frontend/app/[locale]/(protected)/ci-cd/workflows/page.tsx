"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import {
    HiArrowPath,
    HiCodeBracket,
    HiCheckCircle,
    HiXCircle,
    HiClock,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/Badge";
import { workflowsApi } from "@/lib/api";
import type { WorkflowRun, WorkflowCommit } from "@/types/api";

type TabId = "runs" | "commits";

const STATUS_ICON: Record<string, React.ReactNode> = {
    success: <HiCheckCircle className="h-4 w-4 text-green-500" />,
    failed: <HiXCircle className="h-4 w-4 text-red-500" />,
    running: <HiArrowPath className="h-4 w-4 animate-spin text-blue-500" />,
    pending: <HiClock className="h-4 w-4 text-yellow-500" />,
};

const STATUS_VARIANT: Record<
    string,
    "primary" | "secondary" | "success" | "warning" | "danger" | "outline"
> = {
    success: "success",
    failed: "danger",
    running: "outline",
    pending: "warning",
};

export default function WorkflowsPage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locale = (params.locale as string) || "en";

    const [activeTab, setActiveTab] = useState<TabId>("runs");
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [commits, setCommits] = useState<WorkflowCommit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageRuns, setPageRuns] = useState(1);
    const [pageCommits, setPageCommits] = useState(1);
    const [totalPagesRuns, setTotalPagesRuns] = useState(1);
    const [totalPagesCommits, setTotalPagesCommits] = useState(1);

    const loadRuns = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await workflowsApi.getRuns(pageRuns);
            setRuns(response.data);
            setTotalPagesRuns(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading workflow runs");
            console.error("Error loading workflow runs:", err);
        } finally {
            setLoading(false);
        }
    }, [pageRuns]);

    const loadCommits = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await workflowsApi.getCommits(pageCommits);
            setCommits(response.data);
            setTotalPagesCommits(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading commits");
            console.error("Error loading commits:", err);
        } finally {
            setLoading(false);
        }
    }, [pageCommits]);

    useEffect(() => {
        if (activeTab === "runs") loadRuns();
        else loadCommits();
    }, [activeTab, loadRuns, loadCommits]);

    if (loading && runs.length === 0 && commits.length === 0) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    const currentPage = activeTab === "runs" ? pageRuns : pageCommits;
    const totalPages = activeTab === "runs" ? totalPagesRuns : totalPagesCommits;
    const setCurrentPage = activeTab === "runs" ? setPageRuns : setPageCommits;

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Workflows"
                subtitle="Monitor CI/CD workflow runs and commits"
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
                <button
                    onClick={() => setActiveTab("runs")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "runs"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <HiArrowPath className="h-4 w-4" />
                    Workflow Runs
                </button>
                <button
                    onClick={() => setActiveTab("commits")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "commits"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <HiCodeBracket className="h-4 w-4" />
                    Commits
                </button>
            </div>

            {/* Runs Table */}
            {activeTab === "runs" && (
                <div className="rounded-lg border border-border bg-card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Started
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Finished
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {runs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        <HiArrowPath className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-4">No workflow runs found</p>
                                    </td>
                                </tr>
                            ) : (
                                runs.map((run) => (
                                    <tr
                                        key={run.id}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-medium">{run.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {STATUS_ICON[run.status ?? ""] ?? (
                                                    <HiClock className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANT[run.status ?? ""] ?? "secondary"
                                                    }
                                                >
                                                    {run.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {run.started_at
                                                ? new Date(run.started_at).toLocaleString()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {run.finished_at
                                                ? new Date(run.finished_at).toLocaleString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Commits Table */}
            {activeTab === "commits" && (
                <div className="rounded-lg border border-border bg-card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    SHA
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Message
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Author
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Committed
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {commits.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        <HiCodeBracket className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-4">No commits found</p>
                                    </td>
                                </tr>
                            ) : (
                                commits.map((commit) => (
                                    <tr
                                        key={commit.id}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                                                {commit.sha.slice(0, 7)}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {commit.message}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {commit.author}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {commit.committed_at
                                                ? new Date(commit.committed_at).toLocaleString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
