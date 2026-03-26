import React from "react";
import { render, screen } from "@testing-library/react";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineBolt: () => <span data-testid="icon-bolt">bolt</span>,
    HiOutlinePlusCircle: () => <span data-testid="icon-plus">plus</span>,
    HiOutlineMagnifyingGlass: () => (
        <span data-testid="icon-search">search</span>
    ),
    HiOutlineDocumentText: () => <span data-testid="icon-doc">doc</span>,
    HiOutlineServer: () => <span data-testid="icon-server">server</span>,
    HiOutlineGlobeAlt: () => <span data-testid="icon-globe">globe</span>,
}));

describe("QuickActionsWidget", () => {
    describe("Rendering", () => {
        it("renders widget title", () => {
            render(<QuickActionsWidget />);
            expect(
                screen.getByText(/Quick Actions|Acciones/i),
            ).toBeInTheDocument();
        });

        it("renders navigation links", () => {
            render(<QuickActionsWidget />);
            const links = screen.getAllByRole("link");
            expect(links.length).toBeGreaterThan(0);
        });

        it("renders New API or similar action", () => {
            render(<QuickActionsWidget />);
            expect(screen.getByText("New API")).toBeInTheDocument();
        });

        it("renders without crash", () => {
            expect(() => render(<QuickActionsWidget />)).not.toThrow();
        });
    });
});
