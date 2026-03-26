import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VendorList } from "@/components/technology/VendorList";
import type { Vendor } from "@/types/api";

function createMockVendor(overrides: Partial<Vendor> = {}): Vendor {
    return {
        id: 1,
        name: "AWS",
        icon: null,
        url: "https://aws.amazon.com",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("VendorList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of vendors", () => {
            const vendors = [
                createMockVendor({ id: 1, name: "AWS" }),
                createMockVendor({ id: 2, name: "Google Cloud" }),
            ];
            render(
                <VendorList
                    vendors={vendors}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("AWS")).toBeInTheDocument();
            expect(screen.getByText("Google Cloud")).toBeInTheDocument();
        });

        it("should render the url when provided", () => {
            const vendors = [
                createMockVendor({ url: "https://aws.amazon.com" }),
            ];
            render(
                <VendorList
                    vendors={vendors}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText("https://aws.amazon.com"),
            ).toBeInTheDocument();
        });

        it("should render dash when url is null", () => {
            const vendors = [createMockVendor({ url: null })];
            render(
                <VendorList
                    vendors={vendors}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should show empty state when no vendors", () => {
            render(
                <VendorList
                    vendors={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText(/No vendors configured/i),
            ).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const vendor = createMockVendor({ id: 5, name: "Azure" });
            render(
                <VendorList
                    vendors={[vendor]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /edit/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(vendor);
        });

        it("should call onDelete when delete button is clicked", () => {
            const vendor = createMockVendor({ id: 7, name: "Azure" });
            render(
                <VendorList
                    vendors={[vendor]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /delete/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(vendor);
        });
    });
});
