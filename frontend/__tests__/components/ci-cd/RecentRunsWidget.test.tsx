import { render, screen } from "@testing-library/react";
import { RecentRunsWidget } from "@/components/ci-cd/RecentRunsWidget";
import type { WorkflowRun } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlinePlay: () => <span data-testid="icon-play" />,
    HiOutlineCheckCircle: () => <span data-testid="icon-check" />,
    HiOutlineXCircle: () => <span data-testid="icon-x" />,
    HiOutlineClock: () => <span data-testid="icon-clock" />,
}));

const createMockRun = (overrides: Partial<WorkflowRun> = {}): WorkflowRun => ({
    id: 1,
    name: "Build & Deploy",
    status: "success",
    started_at: "2024-01-15T10:00:00Z",
    finished_at: "2024-01-15T10:05:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:05:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("RecentRunsWidget", () => {
    describe("Rendering", () => {
        it("should render widget title", () => {
            render(<RecentRunsWidget runs={[]} />);
            expect(screen.getByText("Recent Runs")).toBeInTheDocument();
        });

        it("should render a list of runs", () => {
            const runs = [
                createMockRun({ id: 1, name: "Build & Deploy" }),
                createMockRun({ id: 2, name: "Unit Tests" }),
            ];
            render(<RecentRunsWidget runs={runs} />);
            expect(screen.getByText("Build & Deploy")).toBeInTheDocument();
            expect(screen.getByText("Unit Tests")).toBeInTheDocument();
        });

        it("should show empty state when no runs", () => {
            render(<RecentRunsWidget runs={[]} />);
            expect(screen.getByText(/no recent runs/i)).toBeInTheDocument();
        });

        it("should display run status", () => {
            const runs = [createMockRun({ status: "success" })];
            render(<RecentRunsWidget runs={runs} />);
            expect(screen.getByText("success")).toBeInTheDocument();
        });

        it("should display dash when status is null", () => {
            const runs = [createMockRun({ status: null })];
            render(<RecentRunsWidget runs={runs} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display started_at date", () => {
            const runs = [
                createMockRun({ started_at: "2024-01-15T10:00:00Z" }),
            ];
            render(<RecentRunsWidget runs={runs} />);
            expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
        });
    });
});
