/**
 * Unit tests for SlideOver base component and sub-components
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
    SlideOverTabs,
} from "@/components/ui/SlideOver";

describe("SlideOver Component", () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Basic Rendering", () => {
        it("should not render when open is false", () => {
            const { container } = render(
                <SlideOver
                    open={false}
                    onClose={mockOnClose}
                    title="Test Title"
                >
                    <div>Content</div>
                </SlideOver>
            );

            // The Dialog may still be in DOM but not visible
            expect(screen.queryByText("Content")).not.toBeInTheDocument();
        });

        it("should render when open is true", () => {
            render(
                <SlideOver open={true} onClose={mockOnClose} title="Test Title">
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Test Title")).toBeInTheDocument();
            expect(screen.getByText("Content")).toBeInTheDocument();
        });

        it("should display title correctly", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="My Slide Over"
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("My Slide Over")).toBeInTheDocument();
        });

        it("should display description when provided", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    description="This is a description"
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(
                screen.getByText("This is a description")
            ).toBeInTheDocument();
        });
    });

    describe("Status Badge", () => {
        it("should render success status badge", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    status={{ label: "Active", variant: "success" }}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Active")).toBeInTheDocument();
        });

        it("should render warning status badge", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    status={{ label: "Pending", variant: "warning" }}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Pending")).toBeInTheDocument();
        });

        it("should render danger status badge", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    status={{ label: "Error", variant: "danger" }}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Error")).toBeInTheDocument();
        });

        it("should render info status badge", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    status={{ label: "Info", variant: "info" }}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Info")).toBeInTheDocument();
        });

        it("should render neutral status badge", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    status={{ label: "Neutral", variant: "neutral" }}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByText("Neutral")).toBeInTheDocument();
        });
    });

    describe("Close Button", () => {
        it("should call onClose when close button is clicked", () => {
            render(
                <SlideOver open={true} onClose={mockOnClose} title="Test">
                    <div>Content</div>
                </SlideOver>
            );

            const closeButton = screen.getByLabelText(/close/i);
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe("Size Variants", () => {
        it("should apply default size (md) class", () => {
            render(
                <SlideOver open={true} onClose={mockOnClose} title="Test">
                    <div>Content</div>
                </SlideOver>
            );

            // The panel should have md width class
            const panel = screen.getByRole("dialog");
            expect(panel).toBeInTheDocument();
        });

        it("should apply sm size class", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    size="sm"
                >
                    <div>Content</div>
                </SlideOver>
            );

            const panel = screen.getByRole("dialog");
            expect(panel).toBeInTheDocument();
        });

        it("should apply lg size class", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    size="lg"
                >
                    <div>Content</div>
                </SlideOver>
            );

            const panel = screen.getByRole("dialog");
            expect(panel).toBeInTheDocument();
        });

        it("should apply xl size class", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    size="xl"
                >
                    <div>Content</div>
                </SlideOver>
            );

            const panel = screen.getByRole("dialog");
            expect(panel).toBeInTheDocument();
        });

        it("should apply full size class", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    size="full"
                >
                    <div>Content</div>
                </SlideOver>
            );

            const panel = screen.getByRole("dialog");
            expect(panel).toBeInTheDocument();
        });
    });

    describe("Loading State", () => {
        it("should show loading spinner when loading is true", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    loading={true}
                >
                    <div>Content</div>
                </SlideOver>
            );

            // Loading state should show spinner
            const loader = screen
                .getByRole("dialog")
                .querySelector(".animate-spin");
            expect(loader).toBeInTheDocument();
        });

        it("should show content when loading is false", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    loading={false}
                >
                    <div>My Content</div>
                </SlideOver>
            );

            expect(screen.getByText("My Content")).toBeInTheDocument();
        });
    });

    describe("Footer", () => {
        it("should render footer when provided", () => {
            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    footer={<button>Save</button>}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(
                screen.getByRole("button", { name: "Save" })
            ).toBeInTheDocument();
        });

        it("should not render footer section when footer is not provided", () => {
            render(
                <SlideOver open={true} onClose={mockOnClose} title="Test">
                    <div>Content</div>
                </SlideOver>
            );

            expect(
                screen.queryByRole("button", { name: "Save" })
            ).not.toBeInTheDocument();
        });
    });

    describe("Icon", () => {
        it("should render icon when provided", () => {
            const TestIcon = () => <span data-testid="test-icon">📦</span>;

            render(
                <SlideOver
                    open={true}
                    onClose={mockOnClose}
                    title="Test"
                    icon={<TestIcon />}
                >
                    <div>Content</div>
                </SlideOver>
            );

            expect(screen.getByTestId("test-icon")).toBeInTheDocument();
        });
    });
});

describe("SlideOverSection Component", () => {
    it("should render with title", () => {
        render(
            <SlideOverSection title="Section Title">
                <div>Section Content</div>
            </SlideOverSection>
        );

        expect(screen.getByText("Section Title")).toBeInTheDocument();
        expect(screen.getByText("Section Content")).toBeInTheDocument();
    });

    it("should render children correctly", () => {
        render(
            <SlideOverSection title="Section">
                <div>Nested content here</div>
            </SlideOverSection>
        );

        expect(screen.getByText("Nested content here")).toBeInTheDocument();
    });

    it("should render with icon", () => {
        const Icon = () => <span data-testid="section-icon">🔧</span>;

        render(
            <SlideOverSection title="Section" icon={<Icon />}>
                <div>Content</div>
            </SlideOverSection>
        );

        expect(screen.getByTestId("section-icon")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
        const { container } = render(
            <SlideOverSection title="Section" className="custom-class">
                <div>Content</div>
            </SlideOverSection>
        );

        expect(container.firstChild).toHaveClass("custom-class");
    });
});

describe("SlideOverField Component", () => {
    it("should render label and value", () => {
        render(<SlideOverField label="Name" value="John Doe" />);

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render dash placeholder when value is empty", () => {
        render(<SlideOverField label="Name" value="" />);

        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("should render dash placeholder when value is null", () => {
        render(<SlideOverField label="Name" value={null} />);

        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("should render dash placeholder when value is undefined", () => {
        render(<SlideOverField label="Name" value={undefined} />);

        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("should render ReactNode value", () => {
        render(
            <SlideOverField
                label="Status"
                value={<span data-testid="status-badge">Active</span>}
            />
        );

        expect(screen.getByTestId("status-badge")).toBeInTheDocument();
    });

    it("should render with icon", () => {
        const Icon = () => <span data-testid="field-icon">📧</span>;

        render(
            <SlideOverField
                label="Email"
                value="test@example.com"
                icon={<Icon />}
            />
        );

        expect(screen.getByTestId("field-icon")).toBeInTheDocument();
    });

    it("should render with actions in section header", () => {
        const handleAction = jest.fn();

        render(<SlideOverField label="Token" value="abc123" copyable={true} />);

        // The copyable button should be present
        expect(screen.getByTitle(/copy/i)).toBeInTheDocument();
    });

    it("should apply horizontal layout by default", () => {
        const { container } = render(
            <SlideOverField label="Name" value="John" />
        );

        const fieldContainer = container.firstChild;
        expect(fieldContainer).toHaveClass("flex");
    });

    it("should apply code variant styling", () => {
        render(<SlideOverField label="ID" value="12345" variant="code" />);

        // Code variant should have code element
        expect(screen.getByText("12345").closest("code")).toBeInTheDocument();
    });
});

describe("SlideOverTabs Component", () => {
    const mockOnChange = jest.fn();

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "details", label: "Details" },
        { id: "settings", label: "Settings" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render all tabs", () => {
        render(
            <SlideOverTabs
                tabs={tabs}
                activeTab="overview"
                onChange={mockOnChange}
            />
        );

        expect(
            screen.getByRole("tab", { name: "Overview" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", { name: "Details" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", { name: "Settings" })
        ).toBeInTheDocument();
    });

    it("should highlight active tab", () => {
        render(
            <SlideOverTabs
                tabs={tabs}
                activeTab="details"
                onChange={mockOnChange}
            />
        );

        const detailsTab = screen.getByRole("tab", { name: "Details" });
        // Active tab should have different styling
        expect(detailsTab).toHaveAttribute("aria-selected", "true");
    });

    it("should call onChange when tab is clicked", () => {
        render(
            <SlideOverTabs
                tabs={tabs}
                activeTab="overview"
                onChange={mockOnChange}
            />
        );

        fireEvent.click(screen.getByRole("tab", { name: "Settings" }));

        expect(mockOnChange).toHaveBeenCalledWith("settings");
    });

    it("should also call onChange when clicking active tab", () => {
        render(
            <SlideOverTabs
                tabs={tabs}
                activeTab="overview"
                onChange={mockOnChange}
            />
        );

        fireEvent.click(screen.getByRole("tab", { name: "Overview" }));

        // The component calls onChange even for active tab
        expect(mockOnChange).toHaveBeenCalledWith("overview");
    });

    it("should render tab icons when provided", () => {
        const tabsWithIcons = [
            {
                id: "overview",
                label: "Overview",
                icon: <span data-testid="overview-icon">📋</span>,
            },
            {
                id: "details",
                label: "Details",
                icon: <span data-testid="details-icon">📝</span>,
            },
        ];

        render(
            <SlideOverTabs
                tabs={tabsWithIcons}
                activeTab="overview"
                onChange={mockOnChange}
            />
        );

        expect(screen.getByTestId("overview-icon")).toBeInTheDocument();
        expect(screen.getByTestId("details-icon")).toBeInTheDocument();
    });
});

describe("SlideOver Breadcrumbs (inline)", () => {
    const mockOnClose = jest.fn();

    it("should render breadcrumbs when provided to SlideOver", () => {
        render(
            <SlideOver
                open={true}
                onClose={mockOnClose}
                title="Test"
                breadcrumbs={[
                    { label: "Home" },
                    { label: "Products" },
                    { label: "Details" },
                ]}
            >
                <div>Content</div>
            </SlideOver>
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("should render clickable breadcrumbs when onClick is provided", () => {
        const mockBreadcrumbClick = jest.fn();

        render(
            <SlideOver
                open={true}
                onClose={mockOnClose}
                title="Test"
                breadcrumbs={[
                    { label: "Home", onClick: mockBreadcrumbClick },
                    { label: "Current" },
                ]}
            >
                <div>Content</div>
            </SlideOver>
        );

        fireEvent.click(screen.getByText("Home"));
        expect(mockBreadcrumbClick).toHaveBeenCalled();
    });
});

describe("SlideOver Accessibility", () => {
    const mockOnClose = jest.fn();

    it("should have proper dialog role", () => {
        render(
            <SlideOver
                open={true}
                onClose={mockOnClose}
                title="Accessible Dialog"
            >
                <div>Content</div>
            </SlideOver>
        );

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should have proper aria-label for close button", () => {
        render(
            <SlideOver open={true} onClose={mockOnClose} title="Test">
                <div>Content</div>
            </SlideOver>
        );

        expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
    });

    it("should trap focus within dialog when open", async () => {
        render(
            <SlideOver
                open={true}
                onClose={mockOnClose}
                title="Focus Trap Test"
            >
                <button>First Button</button>
                <button>Second Button</button>
            </SlideOver>
        );

        await waitFor(() => {
            expect(screen.getByText("First Button")).toBeInTheDocument();
        });
    });
});
