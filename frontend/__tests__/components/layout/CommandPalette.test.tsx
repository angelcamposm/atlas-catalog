/**
 * Tests for CommandPalette layout component
 *
 * Global search overlay triggered by Cmd+K shortcut.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CommandPalette } from "@/components/layout/CommandPalette";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock useGlobalSearch hook
jest.mock("@/hooks/useGlobalSearch", () => ({
    useGlobalSearch: jest.fn(),
}));

// Mock icons
jest.mock("react-icons/hi2", () => ({
    HiMagnifyingGlass: () => <span data-testid="icon-search">search</span>,
    HiXMark: () => <span data-testid="icon-close">x</span>,
    HiArrowRight: () => <span data-testid="icon-arrow">→</span>,
    HiCodeBracket: () => <span data-testid="icon-code">code</span>,
    HiServerStack: () => <span data-testid="icon-server">server</span>,
    HiHome: () => <span data-testid="icon-home">home</span>,
}));

import { useGlobalSearch } from "@/hooks/useGlobalSearch";
const mockUseGlobalSearch = jest.mocked(useGlobalSearch);

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    locale: "en",
};

beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalSearch.mockReturnValue({ results: [], isLoading: false });
});

describe("CommandPalette", () => {
    describe("Visibility", () => {
        it("should not render when isOpen is false", () => {
            render(<CommandPalette {...defaultProps} isOpen={false} />);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("should render dialog when isOpen is true", () => {
            render(<CommandPalette {...defaultProps} />);
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("should render search input when open", () => {
            render(<CommandPalette {...defaultProps} />);
            expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
        });
    });

    describe("Keyboard Navigation", () => {
        it("should call onClose when Escape is pressed", () => {
            const onClose = jest.fn();
            render(<CommandPalette {...defaultProps} onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).toHaveBeenCalled();
        });

        it("should close when backdrop is clicked", () => {
            const onClose = jest.fn();
            render(<CommandPalette {...defaultProps} onClose={onClose} />);
            const backdrop = screen.getByTestId("palette-backdrop");
            fireEvent.click(backdrop);
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe("Loading State", () => {
        it("should show loading indicator when isLoading is true", () => {
            mockUseGlobalSearch.mockReturnValue({
                results: [],
                isLoading: true,
            });
            render(<CommandPalette {...defaultProps} />);
            expect(screen.getByTestId("search-loading")).toBeInTheDocument();
        });

        it("should not show loading indicator when not loading", () => {
            mockUseGlobalSearch.mockReturnValue({
                results: [],
                isLoading: false,
            });
            render(<CommandPalette {...defaultProps} />);
            expect(
                screen.queryByTestId("search-loading"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Results Display", () => {
        it("should show results grouped by category", () => {
            mockUseGlobalSearch.mockReturnValue({
                results: [
                    {
                        id: "api-1",
                        title: "Payments API",
                        subtitle: "Handles payments",
                        href: "/en/catalog/apis/1",
                        category: "APIs",
                    },
                    {
                        id: "cluster-1",
                        title: "prod-cluster",
                        href: "/en/infrastructure/clusters/1",
                        category: "Clusters",
                    },
                ],
                isLoading: false,
            });
            render(<CommandPalette {...defaultProps} />);
            expect(screen.getByText("APIs")).toBeInTheDocument();
            expect(screen.getByText("Clusters")).toBeInTheDocument();
            expect(screen.getByText("Payments API")).toBeInTheDocument();
            expect(screen.getByText("prod-cluster")).toBeInTheDocument();
        });

        it("should show empty state message when no results and query is present", async () => {
            mockUseGlobalSearch.mockReturnValue({
                results: [],
                isLoading: false,
            });
            render(<CommandPalette {...defaultProps} />);
            const input = screen.getByPlaceholderText(/search/i);
            fireEvent.change(input, { target: { value: "zzz" } });
            await waitFor(() => {
                expect(screen.getByTestId("no-results")).toBeInTheDocument();
            });
        });
    });
});
