/**
 * Tests for the <DataTable> generic component.
 *
 * DataTable renders a table from a columns definition + data array.
 * It handles loading (skeleton rows), empty state, row clicks, and pagination.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type Column } from "@/components/ui/DataTable";

interface TestRow {
    id: number;
    name: string;
    status: string;
}

const columns: Column<TestRow>[] = [
    { key: "name", header: "Name", accessor: "name" },
    { key: "status", header: "Status", accessor: "status" },
];

const rows: TestRow[] = [
    { id: 1, name: "Component A", status: "active" },
    { id: 2, name: "Component B", status: "deprecated" },
];

describe("DataTable", () => {
    describe("Rendering", () => {
        it("renders column headers", () => {
            render(<DataTable columns={columns} data={rows} />);

            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Status")).toBeInTheDocument();
        });

        it("renders a row for each data item", () => {
            render(<DataTable columns={columns} data={rows} />);

            expect(screen.getByText("Component A")).toBeInTheDocument();
            expect(screen.getByText("Component B")).toBeInTheDocument();
        });

        it("renders cell value via accessor", () => {
            render(<DataTable columns={columns} data={rows} />);

            expect(screen.getByText("active")).toBeInTheDocument();
            expect(screen.getByText("deprecated")).toBeInTheDocument();
        });

        it("renders cell via custom render function", () => {
            const customColumns: Column<TestRow>[] = [
                {
                    key: "name",
                    header: "Name",
                    render: (row) => (
                        <span data-testid={`name-${row.id}`}>{row.name}</span>
                    ),
                },
            ];

            render(<DataTable columns={customColumns} data={rows} />);

            expect(screen.getByTestId("name-1")).toHaveTextContent(
                "Component A",
            );
        });
    });

    describe("Loading state", () => {
        it("renders skeleton rows when loading is true", () => {
            render(
                <DataTable
                    columns={columns}
                    data={[]}
                    loading
                    loadingRows={3}
                />,
            );

            const skeletons = screen.getAllByTestId("data-table-skeleton-row");
            expect(skeletons).toHaveLength(3);
        });

        it("does not render data rows when loading", () => {
            render(<DataTable columns={columns} data={rows} loading />);

            expect(screen.queryByText("Component A")).not.toBeInTheDocument();
        });

        it("renders 5 skeleton rows by default when loading", () => {
            render(<DataTable columns={columns} data={[]} loading />);

            const skeletons = screen.getAllByTestId("data-table-skeleton-row");
            expect(skeletons).toHaveLength(5);
        });
    });

    describe("Empty state", () => {
        it("shows empty state when data is empty and not loading", () => {
            render(
                <DataTable
                    columns={columns}
                    data={[]}
                    emptyTitle="No components found"
                />,
            );

            expect(screen.getByText("No components found")).toBeInTheDocument();
        });

        it("shows default empty message when no emptyTitle provided", () => {
            render(<DataTable columns={columns} data={[]} />);

            expect(screen.getByText("No results")).toBeInTheDocument();
        });

        it("does not show empty state when data is present", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    emptyTitle="No components found"
                />,
            );

            expect(
                screen.queryByText("No components found"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Row interaction", () => {
        it("calls onRowClick with the row when clicked", async () => {
            const user = userEvent.setup();
            const onRowClick = jest.fn();

            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    onRowClick={onRowClick}
                />,
            );

            await user.click(screen.getByText("Component A"));
            expect(onRowClick).toHaveBeenCalledWith(rows[0]);
        });

        it("adds cursor-pointer class on rows when onRowClick is provided", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    onRowClick={jest.fn()}
                />,
            );

            const row = screen.getByText("Component A").closest("tr");
            expect(row).toHaveClass("cursor-pointer");
        });
    });

    describe("Pagination", () => {
        const pagination = {
            page: 2,
            totalPages: 5,
            onPageChange: jest.fn(),
        };

        it("renders pagination controls when provided", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={pagination}
                />,
            );

            expect(
                screen.getByRole("button", { name: /previous/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /next/i }),
            ).toBeInTheDocument();
        });

        it("displays current page and total pages", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={pagination}
                />,
            );

            expect(screen.getByText(/2.*5/)).toBeInTheDocument();
        });

        it("calls onPageChange with page - 1 when previous is clicked", async () => {
            const user = userEvent.setup();
            const onPageChange = jest.fn();

            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={{ page: 2, totalPages: 5, onPageChange }}
                />,
            );

            await user.click(screen.getByRole("button", { name: /previous/i }));
            expect(onPageChange).toHaveBeenCalledWith(1);
        });

        it("calls onPageChange with page + 1 when next is clicked", async () => {
            const user = userEvent.setup();
            const onPageChange = jest.fn();

            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={{ page: 2, totalPages: 5, onPageChange }}
                />,
            );

            await user.click(screen.getByRole("button", { name: /next/i }));
            expect(onPageChange).toHaveBeenCalledWith(3);
        });

        it("disables previous button on first page", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={{
                        page: 1,
                        totalPages: 5,
                        onPageChange: jest.fn(),
                    }}
                />,
            );

            expect(
                screen.getByRole("button", { name: /previous/i }),
            ).toBeDisabled();
        });

        it("disables next button on last page", () => {
            render(
                <DataTable
                    columns={columns}
                    data={rows}
                    pagination={{
                        page: 5,
                        totalPages: 5,
                        onPageChange: jest.fn(),
                    }}
                />,
            );

            expect(
                screen.getByRole("button", { name: /next/i }),
            ).toBeDisabled();
        });

        it("does not render pagination when not provided", () => {
            render(<DataTable columns={columns} data={rows} />);

            expect(
                screen.queryByRole("button", { name: /previous/i }),
            ).not.toBeInTheDocument();
        });
    });
});
