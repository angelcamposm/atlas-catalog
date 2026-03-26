import { render, screen, fireEvent } from "@testing-library/react";
import { WorkflowRunList } from "@/components/ci-cd/WorkflowRunList";
import type { WorkflowRun } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlinePlay: () => <span data-testid="icon-play" />,
    HiOutlineCheckCircle: () => <span data-testid="icon-check" />,
    HiOutlineXCircle: () => <span data-testid="icon-x" />,
    HiOutlineClock: () => <span data-testid="icon-clock" />,
    HiOutlineEye: () => <span data-testid="icon-eye" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
}));

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

describe("WorkflowRunList", () => {
    describe("Rendering", () => {
        it("should render the runs list", () => {
            const runs = [
                createMockRun({ id: 1, name: "Deploy to Production" }),
                createMockRun({ id: 2, name: "Run Tests" }),
            ];
            render(<WorkflowRunList runs={runs} />);
            expect(
                screen.getByText("Deploy to Production"),
            ).toBeInTheDocument();
            expect(screen.getByText("Run Tests")).toBeInTheDocument();
        });

        it("should display status for each run", () => {
            render(
                <WorkflowRunList
                    runs={[createMockRun({ status: "success" })]}
                />,
            );
            expect(screen.getByText("success")).toBeInTheDocument();
        });

        it("should display dash when status is null", () => {
            render(
                <WorkflowRunList runs={[createMockRun({ status: null })]} />,
            );
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display started_at date", () => {
            render(
                <WorkflowRunList
                    runs={[
                        createMockRun({ started_at: "2024-01-15T10:00:00Z" }),
                    ]}
                />,
            );
            expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
        });

        it("should show empty state when runs list is empty", () => {
            render(<WorkflowRunList runs={[]} />);
            expect(screen.getByText(/no workflow runs/i)).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should call onView with run id when view button is clicked", () => {
            const onView = jest.fn();
            render(
                <WorkflowRunList
                    runs={[createMockRun({ id: 42 })]}
                    onView={onView}
                />,
            );
            const icon = screen.getByTestId("icon-eye");
            fireEvent.click(icon.closest("button")!);
            expect(onView).toHaveBeenCalledWith(42);
        });

        it("should not render action buttons when handlers not provided", () => {
            render(<WorkflowRunList runs={[createMockRun()]} />);
            expect(screen.queryByTestId("icon-eye")).not.toBeInTheDocument();
        });
    });
});
