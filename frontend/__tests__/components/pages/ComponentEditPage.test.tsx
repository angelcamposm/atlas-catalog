/**
 * Tests for the Component Edit page.
 *
 * Strategy: mock `useResourceDetail` + `componentsApi.update`, render the form,
 * assert it loads data, allow editing fields, submit, and verify API call.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentEditPage from "@/app/[locale]/(protected)/components/[id]/edit/page";
import type { Component } from "@/types/api";

// ── External dependencies ──────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, back: mockBack }),
    useParams: () => ({ locale: "es", id: "api-gateway" }),
}));

jest.mock("react-icons/hi2", () => new Proxy({}, { get: () => () => null }));

jest.mock("@/components/layout/PageHeader", () => ({
    PageHeader: ({ title }: { title: string }) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
        </div>
    ),
}));

// ── Hook mock ──────────────────────────────────────────────────────────────

const mockUseResourceDetail = jest.fn();

jest.mock("@/hooks/use-resource", () => ({
    useResourceDetail: (...args: unknown[]) => mockUseResourceDetail(...args),
}));

// ── API mock ───────────────────────────────────────────────────────────────

const mockUpdate = jest.fn();

jest.mock("@/lib/api/components", () => ({
    componentsApi: {
        getBySlug: jest.fn(),
        update: (...args: unknown[]) => mockUpdate(...args),
    },
}));

// ── Fixtures ───────────────────────────────────────────────────────────────

const mockComponent: Component = {
    id: 1,
    name: "api-gateway",
    display_name: "API Gateway",
    slug: "api-gateway",
    description: "Main gateway",
} as Component;

function loadedState(component: Component = mockComponent) {
    return { data: component, loading: false, error: null, refetch: jest.fn() };
}

function loadingState() {
    return { data: null, loading: true, error: null, refetch: jest.fn() };
}

beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockUpdate.mockClear();
    mockUseResourceDetail.mockReturnValue(loadedState());
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("ComponentEditPage", () => {
    describe("Loading state", () => {
        it("shows a loading indicator while fetching", () => {
            mockUseResourceDetail.mockReturnValue(loadingState());
            render(<ComponentEditPage />);
            expect(screen.getByRole("status")).toBeInTheDocument();
        });
    });

    describe("Layout", () => {
        it("renders the page header", () => {
            render(<ComponentEditPage />);
            expect(screen.getByTestId("page-header")).toBeInTheDocument();
        });

        it("pre-populates name field with existing data", () => {
            render(<ComponentEditPage />);
            expect(screen.getByLabelText(/nombre/i)).toHaveValue("api-gateway");
        });

        it("pre-populates slug field with existing data", () => {
            render(<ComponentEditPage />);
            expect(screen.getByLabelText(/slug/i)).toHaveValue("api-gateway");
        });
    });

    describe("Form submission", () => {
        it("calls componentsApi.update with updated data on submit", async () => {
            const user = userEvent.setup();
            mockUpdate.mockResolvedValue({ data: mockComponent });

            render(<ComponentEditPage />);

            const nameField = screen.getByLabelText(/nombre/i);
            await user.clear(nameField);
            await user.type(nameField, "API Gateway Updated");

            await user.click(
                screen.getByRole("button", {
                    name: /guardar|save|actualizar/i,
                }),
            );

            await waitFor(() => {
                expect(mockUpdate).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({ name: "API Gateway Updated" }),
                );
            });
        });

        it("navigates to component detail after successful update", async () => {
            const user = userEvent.setup();
            mockUpdate.mockResolvedValue({
                data: { ...mockComponent, slug: "api-gateway" },
            });

            render(<ComponentEditPage />);
            await user.click(
                screen.getByRole("button", {
                    name: /guardar|save|actualizar/i,
                }),
            );

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith(
                    expect.stringContaining("/components/api-gateway"),
                );
            });
        });
    });

    describe("Cancel", () => {
        it("navigates back when cancel is clicked", async () => {
            const user = userEvent.setup();
            render(<ComponentEditPage />);
            await user.click(
                screen.getByRole("button", { name: /cancelar|cancel/i }),
            );
            expect(mockBack).toHaveBeenCalled();
        });
    });
});
