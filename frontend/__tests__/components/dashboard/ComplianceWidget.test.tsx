import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ComplianceWidget } from "@/components/dashboard/widgets/ComplianceWidget";

jest.mock("@/lib/api", () => ({
    complianceApi: {
        standards: {
            getAll: jest.fn(),
        },
    },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineShieldCheck: () => (
        <span data-testid="icon-compliance">compliance</span>
    ),
}));

const { complianceApi } = jest.requireMock("@/lib/api");

const createMockStandard = (overrides = {}) => ({
    id: 1,
    name: "ISO 27001",
    description: "Information security",
    version: "2013",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("ComplianceWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Loading state", () => {
        it("renders loading skeleton initially", () => {
            complianceApi.standards.getAll.mockReturnValue(
                new Promise(() => {}),
            );
            render(<ComplianceWidget />);
            expect(
                document.querySelector(".animate-pulse") ||
                    screen.queryByTestId("skeleton"),
            ).toBeTruthy();
        });
    });

    describe("Loaded state", () => {
        it("shows compliance widget title", async () => {
            complianceApi.standards.getAll.mockResolvedValue({
                data: [createMockStandard()],
                meta: {
                    total: 1,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 1,
                    to: 1,
                },
            });
            render(<ComplianceWidget />);
            await waitFor(() => {
                expect(
                    screen.getByText("Compliance Standards"),
                ).toBeInTheDocument();
            });
        });

        it("shows standard count (2 items)", async () => {
            complianceApi.standards.getAll.mockResolvedValue({
                data: [
                    createMockStandard({ id: 1 }),
                    createMockStandard({ id: 2 }),
                ],
                meta: {
                    total: 2,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 1,
                    to: 2,
                },
            });
            render(<ComplianceWidget />);
            await waitFor(() => {
                expect(screen.getByText("2")).toBeInTheDocument();
            });
        });

        it("handles empty data showing 0", async () => {
            complianceApi.standards.getAll.mockResolvedValue({
                data: [],
                meta: {
                    total: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 0,
                    to: 0,
                },
            });
            render(<ComplianceWidget />);
            await waitFor(() => {
                expect(screen.getByText("0")).toBeInTheDocument();
            });
        });

        it("handles error gracefully", async () => {
            complianceApi.standards.getAll.mockRejectedValue(
                new Error("Server error"),
            );
            render(<ComplianceWidget />);
            await waitFor(() => {
                expect(screen.queryByText(/0|error/i)).toBeTruthy();
            });
        });
    });
});
