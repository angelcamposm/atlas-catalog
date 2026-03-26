import { render, screen, fireEvent } from "@testing-library/react";
import { MetricDetail } from "@/components/operations/MetricDetail";
import type { Metric } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineChartBar: () => <span data-testid="icon-chart" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
}));

const createMockMetric = (overrides: Partial<Metric> = {}): Metric => ({
    id: 1,
    name: "CPU Usage",
    value: 75.5,
    unit: "%",
    metric_definition_id: 10,
    component_id: 5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("MetricDetail", () => {
    describe("Rendering", () => {
        it("should render the metric name as heading", () => {
            const metric = createMockMetric({ name: "CPU Usage" });
            render(<MetricDetail metric={metric} />);
            expect(screen.getByText("CPU Usage")).toBeInTheDocument();
        });

        it("should display metric value with unit", () => {
            const metric = createMockMetric({ value: 75.5, unit: "%" });
            render(<MetricDetail metric={metric} />);
            expect(screen.getByText("75.5")).toBeInTheDocument();
            expect(screen.getByText("%")).toBeInTheDocument();
        });

        it("should show dash for null unit", () => {
            const metric = createMockMetric({ unit: null });
            render(<MetricDetail metric={metric} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });

        it("should display metric_definition_id", () => {
            const metric = createMockMetric({ metric_definition_id: 42 });
            render(<MetricDetail metric={metric} />);
            expect(screen.getByText("42")).toBeInTheDocument();
        });

        it("should display component_id when present", () => {
            const metric = createMockMetric({ component_id: 99 });
            render(<MetricDetail metric={metric} />);
            expect(screen.getByText("99")).toBeInTheDocument();
        });

        it("should show dash for null component_id", () => {
            const metric = createMockMetric({ component_id: null });
            render(<MetricDetail metric={metric} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe("Actions", () => {
        it("should call onEdit when edit button is clicked", () => {
            const onEdit = jest.fn();
            const metric = createMockMetric({ id: 1 });
            render(<MetricDetail metric={metric} onEdit={onEdit} />);
            fireEvent.click(
                screen.getByTestId("icon-edit").closest("button")!,
            );
            expect(onEdit).toHaveBeenCalledWith(1);
        });

        it("should call onDelete when delete button is clicked", () => {
            const onDelete = jest.fn();
            const metric = createMockMetric({ id: 1 });
            render(<MetricDetail metric={metric} onDelete={onDelete} />);
            fireEvent.click(
                screen.getByTestId("icon-trash").closest("button")!,
            );
            expect(onDelete).toHaveBeenCalledWith(1);
        });

        it("should not render action buttons when handlers not provided", () => {
            const metric = createMockMetric();
            render(<MetricDetail metric={metric} />);
            expect(screen.queryByTestId("icon-edit")).not.toBeInTheDocument();
            expect(screen.queryByTestId("icon-trash")).not.toBeInTheDocument();
        });
    });
});
