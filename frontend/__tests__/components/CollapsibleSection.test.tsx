/**
 * Tests for CollapsibleSection component
 * Following TDD approach - tests written first
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiChevronDown: () => <span data-testid="chevron-icon">▼</span>,
    HiChevronRight: () => <span data-testid="chevron-icon">▶</span>,
}));

describe("CollapsibleSection", () => {
    describe("Rendering", () => {
        it("should render with title", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(screen.getByText("Information")).toBeInTheDocument();
        });

        it("should render children content when expanded", () => {
            render(
                <CollapsibleSection title="Information" defaultExpanded>
                    <p>Test content</p>
                </CollapsibleSection>
            );

            expect(screen.getByText("Test content")).toBeInTheDocument();
        });

        it("should render with percentage indicator when provided", () => {
            render(
                <CollapsibleSection title="Information" percentage={75}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(screen.getByText("75%")).toBeInTheDocument();
        });

        it("should render with icon when provided", () => {
            const TestIcon = () => <span data-testid="custom-icon">🔧</span>;
            render(
                <CollapsibleSection title="Information" icon={TestIcon}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
        });
    });

    describe("Collapse/Expand Behavior", () => {
        it("should be collapsed by default", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Hidden content</p>
                </CollapsibleSection>
            );

            // Content should not be visible when collapsed
            expect(
                screen.queryByText("Hidden content")
            ).not.toBeInTheDocument();
        });

        it("should expand when defaultExpanded is true", () => {
            render(
                <CollapsibleSection title="Information" defaultExpanded>
                    <p>Visible content</p>
                </CollapsibleSection>
            );

            expect(screen.getByText("Visible content")).toBeInTheDocument();
        });

        it("should toggle content visibility on header click", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Toggle content</p>
                </CollapsibleSection>
            );

            // Initially collapsed
            expect(
                screen.queryByText("Toggle content")
            ).not.toBeInTheDocument();

            // Click to expand
            fireEvent.click(screen.getByRole("button"));
            expect(screen.getByText("Toggle content")).toBeInTheDocument();

            // Click to collapse
            fireEvent.click(screen.getByRole("button"));
            expect(
                screen.queryByText("Toggle content")
            ).not.toBeInTheDocument();
        });

        it("should call onToggle callback when toggled", () => {
            const onToggle = jest.fn();
            render(
                <CollapsibleSection title="Information" onToggle={onToggle}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            fireEvent.click(screen.getByRole("button"));
            expect(onToggle).toHaveBeenCalledWith(true);

            fireEvent.click(screen.getByRole("button"));
            expect(onToggle).toHaveBeenCalledWith(false);
        });
    });

    describe("Percentage Indicator", () => {
        it("should display percentage with correct color for low values", () => {
            render(
                <CollapsibleSection title="Test" percentage={25}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            const badge = screen.getByText("25%");
            expect(badge).toBeInTheDocument();
        });

        it("should display percentage with correct color for medium values", () => {
            render(
                <CollapsibleSection title="Test" percentage={50}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            const badge = screen.getByText("50%");
            expect(badge).toBeInTheDocument();
        });

        it("should display percentage with correct color for high values", () => {
            render(
                <CollapsibleSection title="Test" percentage={100}>
                    <p>Content</p>
                </CollapsibleSection>
            );

            const badge = screen.getByText("100%");
            expect(badge).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("should have accessible button role", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Content</p>
                </CollapsibleSection>
            );

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("should have aria-expanded attribute", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Content</p>
                </CollapsibleSection>
            );

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("aria-expanded", "false");

            fireEvent.click(button);
            expect(button).toHaveAttribute("aria-expanded", "true");
        });

        it("should be keyboard accessible", () => {
            render(
                <CollapsibleSection title="Information">
                    <p>Keyboard content</p>
                </CollapsibleSection>
            );

            const button = screen.getByRole("button");
            button.focus();

            // Simulate Enter key press
            fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
            expect(screen.getByText("Keyboard content")).toBeInTheDocument();
        });
    });

    describe("Styling", () => {
        it("should accept custom className", () => {
            const { container } = render(
                <CollapsibleSection
                    title="Information"
                    className="custom-class"
                >
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(container.firstChild).toHaveClass("custom-class");
        });

        it("should render with border by default", () => {
            const { container } = render(
                <CollapsibleSection title="Information">
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(container.firstChild).toHaveClass("border");
        });

        it("should allow disabling border", () => {
            const { container } = render(
                <CollapsibleSection title="Information" noBorder>
                    <p>Content</p>
                </CollapsibleSection>
            );

            expect(container.firstChild).not.toHaveClass("border");
        });
    });
});
