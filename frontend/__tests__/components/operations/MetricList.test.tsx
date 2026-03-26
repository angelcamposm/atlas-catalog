import { render, screen, fireEvent } from "@testing-library/react";
import { MetricList } from "@/components/operations/MetricList";
import type { Metric } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineChartBar: () => <span data-testid="icon-chart" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
    HiOutlineEye: () => <span data-testid="icon-eye" />,
}));

const createMockMetric = (overrides: Partial<Metric> = {}): Metric => ({
    id: 1,
    name: "CPU Usage",
    value: 75.5,
    unit: "%",
    metric_definition_id: 10,
    component_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("MetricList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of metrics", () => {
            const metrics = [
                createMockMetric({ id: 1, name: "CPU Usage" }),
                createMockMetric({ id: 2, name: "Memory Usage" }),
            ];
            render(<MetricList metrics={metrics} />);
            expect(screen.getByText("CPU Usage")).toBeInTheDocument();
            expect(screen.getByText("Memory Usage")).toBeInTheDocument();
        });

        it("should display metric value and unit", () => {
            const metrics = [createMockMetric({ value: 75.5, unit: "%" })];
            render(<MetricList metrics={metrics} />);
            expect(screen.getByText("75.5")).toBeInTheDocument();
            expect(screen.getByText("%")).toBeInTheDocument();
        });

        it("should show a dash when unit is null", () => {
            const metrics = [createMockMetric({ unit: null })];
            render(<MetricList metrics={metrics} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });

        it("should render empty state when no metrics", () => {
            render(<MetricList metrics={[]} />);
            expect(screen.getByText(/no metrics/i)).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should call onView when view button is clicked", () => {
            const onView = jest.fn();
            const metrics = [createMockMetric({ id: 1 })];
            render(<MetricList metrics={metrics} onView={onView} />);
            fireEvent.click(screen.getByTestId("icon-eye").closest("button")!);
            expect(onView).toHaveBeenCalledWith(1);
        });

        it("should call onEdit when edit button is clicked", () => {
            const onEdit = jest.fn();
            const metrics = [createMockMetric({ id: 1 })];
            render(<MetricList metrics={metrics} onEdit={onEdit} />);
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(1);
        });

        it("should call onDelete when delete button is clicked", () => {
            const onDelete = jest.fn();
            const metrics = [createMockMetric({ id: 1 })];
            render(<MetricList metrics={metrics} onDelete={onDelete} />);
            fireEvent.click(
                screen.getByTestId("icon-trash").closest("button")!,
            );
            expect(onDelete).toHaveBeenCalledWith(1);
        });

        it("should not render action buttons when handlers not provided", () => {
            const metrics = [createMockMetric({ id: 1 })];
            render(<MetricList metrics={metrics} />);
            expect(screen.queryByTestId("icon-edit")).not.toBeInTheDocument();
            expect(screen.queryByTestId("icon-trash")).not.toBeInTheDocument();
        });
    });

    describe("Multiple Metrics", () => {
        it("should render correct number of rows", () => {
            const metrics = [
                createMockMetric({ id: 1, name: "CPU Usage" }),
                createMockMetric({ id: 2, name: "Memory" }),
                createMockMetric({ id: 3, name: "Disk" }),
            ];
            render(<MetricList metrics={metrics} />);
            expect(screen.getByText("CPU Usage")).toBeInTheDocument();
            expect(screen.getByText("Memory")).toBeInTheDocument();
            expect(screen.getByText("Disk")).toBeInTheDocument();
        });
    });
});
