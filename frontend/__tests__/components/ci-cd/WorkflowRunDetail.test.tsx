import { render, screen } from "@testing-library/react";
import { WorkflowRunDetail } from "@/components/ci-cd/WorkflowRunDetail";
import type { WorkflowRun, WorkflowJob, WorkflowCommit } from "@/types/api";

const createMockRun = (overrides: Partial<WorkflowRun> = {}): WorkflowRun => ({
    id: 1,
    name: "Deploy to Production",
    status: "success",
    started_at: "2024-01-15T10:00:00Z",
    finished_at: "2024-01-15T10:05:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:05:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

const createMockJob = (overrides: Partial<WorkflowJob> = {}): WorkflowJob => ({
    id: 1,
    workflow_run_id: 1,
    name: "Build",
    status: "success",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:03:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

const createMockCommit = (
    overrides: Partial<WorkflowCommit> = {},
): WorkflowCommit => ({
    id: 1,
    sha: "abc1234",
    message: "fix: resolve deployment issue",
    author: "Alice",
    committed_at: "2024-01-15T09:55:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("WorkflowRunDetail", () => {
    describe("Rendering", () => {
        it("should render run name", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun({ name: "Deploy to Production" })}
                    jobs={[]}
                    commits={[]}
                />,
            );
            expect(
                screen.getByText("Deploy to Production"),
            ).toBeInTheDocument();
        });

        it("should render run status", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun({ status: "success" })}
                    jobs={[]}
                    commits={[]}
                />,
            );
            expect(screen.getByText("success")).toBeInTheDocument();
        });

        it("should render jobs when provided", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun()}
                    jobs={[createMockJob({ name: "Build" })]}
                    commits={[]}
                />,
            );
            expect(screen.getByText("Build")).toBeInTheDocument();
        });

        it("should render commits when provided", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun()}
                    jobs={[]}
                    commits={[
                        createMockCommit({ sha: "abc1234", message: "fix: resolve deployment issue" }),
                    ]}
                />,
            );
            expect(screen.getByText(/abc1234/)).toBeInTheDocument();
        });

        it("should show dash when status is null", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun({ status: null })}
                    jobs={[]}
                    commits={[]}
                />,
            );
            expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
        });

        it("should show empty state for jobs when none provided", () => {
            render(
                <WorkflowRunDetail
                    run={createMockRun()}
                    jobs={[]}
                    commits={[]}
                />,
            );
            expect(screen.getByText(/no jobs/i)).toBeInTheDocument();
        });
    });
});
