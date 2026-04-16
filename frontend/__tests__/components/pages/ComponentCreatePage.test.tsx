/**
 * Tests for the Component Create page.
 *
 * Strategy: mock `componentsApi.create` and navigation, render the form,
 * fill in required fields, submit, and assert API call + navigation.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentCreatePage from "@/app/[locale]/(protected)/components/create/page";

// ── External dependencies ──────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, back: mockBack }),
    useParams: () => ({ locale: "es" }),
}));

jest.mock("react-icons/hi2", () => new Proxy({}, { get: () => () => null }));

jest.mock("@/components/layout/PageHeader", () => ({
    PageHeader: ({ title }: { title: string }) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
        </div>
    ),
}));

// ── API mock ───────────────────────────────────────────────────────────────

const mockCreate = jest.fn();

jest.mock("@/lib/api/components", () => ({
    componentsApi: {
        create: (...args: unknown[]) => mockCreate(...args),
    },
}));

// ── Fixtures ───────────────────────────────────────────────────────────────

beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockCreate.mockClear();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("ComponentCreatePage", () => {
    describe("Layout", () => {
        it("renders the page header", () => {
            render(<ComponentCreatePage />);
            expect(screen.getByTestId("page-header")).toBeInTheDocument();
        });

        it("renders name and slug fields", () => {
            render(<ComponentCreatePage />);
            expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
        });

        it("renders a submit button", () => {
            render(<ComponentCreatePage />);
            expect(
                screen.getByRole("button", { name: /crear|guardar|save/i }),
            ).toBeInTheDocument();
        });

        it("renders a cancel button", () => {
            render(<ComponentCreatePage />);
            expect(
                screen.getByRole("button", { name: /cancelar|cancel/i }),
            ).toBeInTheDocument();
        });
    });

    describe("Form submission", () => {
        it("calls componentsApi.create with form data on submit", async () => {
            const user = userEvent.setup();
            mockCreate.mockResolvedValue({ data: { id: 99, slug: "my-comp" } });

            render(<ComponentCreatePage />);

            await user.type(screen.getByLabelText(/nombre/i), "My Component");
            await user.type(screen.getByLabelText(/slug/i), "my-comp");

            await user.click(
                screen.getByRole("button", { name: /crear|guardar|save/i }),
            );

            await waitFor(() => {
                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: "My Component",
                        slug: "my-comp",
                    }),
                );
            });
        });

        it("navigates to component detail after successful create", async () => {
            const user = userEvent.setup();
            mockCreate.mockResolvedValue({ data: { id: 99, slug: "my-comp" } });

            render(<ComponentCreatePage />);

            await user.type(screen.getByLabelText(/nombre/i), "My Component");
            await user.type(screen.getByLabelText(/slug/i), "my-comp");
            await user.click(
                screen.getByRole("button", { name: /crear|guardar|save/i }),
            );

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith(
                    expect.stringContaining("/components/my-comp"),
                );
            });
        });
    });

    describe("Cancel", () => {
        it("navigates back when cancel is clicked", async () => {
            const user = userEvent.setup();
            render(<ComponentCreatePage />);
            await user.click(
                screen.getByRole("button", { name: /cancelar|cancel/i }),
            );
            expect(mockBack).toHaveBeenCalled();
        });
    });
});
