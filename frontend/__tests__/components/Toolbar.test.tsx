/**
 * Tests for the <Toolbar> component.
 *
 * Toolbar provides a search input, optional filter slots, action buttons,
 * and an optional total-results counter.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toolbar } from "@/components/ui/Toolbar";

describe("Toolbar", () => {
    describe("Search", () => {
        it("renders a search input", () => {
            render(<Toolbar />);
            expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });

        it("renders the placeholder text when provided", () => {
            render(<Toolbar searchPlaceholder="Search components..." />);
            expect(
                screen.getByPlaceholderText("Search components..."),
            ).toBeInTheDocument();
        });

        it("shows a default placeholder when none provided", () => {
            render(<Toolbar />);
            expect(screen.getByRole("searchbox")).toHaveAttribute(
                "placeholder",
                expect.any(String),
            );
        });

        it("calls onSearch when the input changes", async () => {
            const user = userEvent.setup();
            const onSearch = jest.fn();

            render(<Toolbar onSearch={onSearch} />);

            await user.type(screen.getByRole("searchbox"), "test");
            expect(onSearch).toHaveBeenLastCalledWith("test");
        });

        it("displays the searchValue passed in", () => {
            render(<Toolbar searchValue="my query" />);
            expect(screen.getByRole("searchbox")).toHaveValue("my query");
        });
    });

    describe("Filters slot", () => {
        it("renders children as filter controls", () => {
            render(
                <Toolbar>
                    <select data-testid="filter-select">
                        <option>All</option>
                    </select>
                </Toolbar>,
            );

            expect(screen.getByTestId("filter-select")).toBeInTheDocument();
        });

        it("renders nothing for filters when no children", () => {
            const { container } = render(<Toolbar />);
            // There is no extra filter wrapper element besides the toolbar itself
            expect(container.querySelectorAll("select")).toHaveLength(0);
        });
    });

    describe("Actions slot", () => {
        it("renders action elements when provided", () => {
            render(
                <Toolbar
                    actions={<button data-testid="create-btn">Create</button>}
                />,
            );

            expect(screen.getByTestId("create-btn")).toBeInTheDocument();
        });

        it("does not render an actions area when actions prop is omitted", () => {
            const { container } = render(<Toolbar />);
            expect(
                container.querySelectorAll("[data-slot='toolbar-actions']"),
            ).toHaveLength(0);
        });
    });

    describe("Total results", () => {
        it("displays total results count when provided", () => {
            render(<Toolbar totalResults={42} />);
            expect(screen.getByText(/42/)).toBeInTheDocument();
        });

        it("does not display the count when not provided", () => {
            render(<Toolbar />);
            expect(screen.queryByText(/\d+ result/i)).not.toBeInTheDocument();
        });
    });
});
