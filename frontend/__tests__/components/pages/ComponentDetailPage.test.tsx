/**
 * Tests for Component Detail page (`app/[locale]/(protected)/components/[id]/page.tsx`).
 *
 * Lean refactor: uses `useResourceDetail` + shared catalog sub-components.
 * No next-intl. No manual fetch. No motion. No tabs (out of scope for Phase 1 MVP).
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComponentDetailPage from "@/app/[locale]/(protected)/components/[id]/page";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
};
let mockParams: Record<string, string> = { locale: "es", id: "api-gateway" };

jest.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
    useParams: () => mockParams,
    useSearchParams: () => new URLSearchParams(),
}));

// Blanket mock for react-icons/hi2 — covers icons used by sub-components.
jest.mock(
    "react-icons/hi2",
    () =>
        new Proxy(
            {},
            {
                get: () => () => null,
            },
        ),
);

// Mock next/link to plain anchor.
jest.mock("next/link", () => {
    return function MockLink({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) {
        return <a href={href}>{children}</a>;
    };
});

// Stub out the heavy catalog sub-components so we test the page's
// orchestration (data loading + layout), not the inner rendering
// (which has its own dedicated tests in ComponentDetail.test.tsx).
jest.mock("@/components/catalog/component-detail", () => ({
    ComponentDetailHeader: ({ component }: { component: { name: string } }) => (
        <header data-testid="component-header">{component.name}</header>
    ),
    InformationSection: () => <section data-testid="information-section" />,
    OtherDetailsSection: () => <section data-testid="other-details-section" />,
    BusinessSupportSection: () => (
        <section data-testid="business-support-section" />
    ),
    LifecycleTimeline: () => <section data-testid="lifecycle-timeline" />,
    DeploymentsSection: () => <section data-testid="deployments-section" />,
    DependenciesSection: () => <section data-testid="dependencies-section" />,
}));

// Mock the API clients.
const mockGetBySlug = jest.fn();
jest.mock("@/lib/api/components", () => ({
    componentsApi: {
        getBySlug: (...args: unknown[]) => mockGetBySlug(...args),
    },
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockComponent = {
    id: 1,
    name: "api-gateway",
    display_name: "API Gateway",
    slug: "api-gateway",
    description: "Main edge gateway",
    type_id: 2,
    lifecycle_id: 3,
    domain_id: null,
    owner_id: null,
    platform_id: null,
    tier_id: null,
    status_id: null,
    operational_status_id: null,
    criticality_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ComponentDetailPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockParams = { locale: "es", id: "api-gateway" };
    });

    describe("Loading state", () => {
        it("shows a loading indicator while fetching", () => {
            // Never-resolving promise to keep loading=true
            mockGetBySlug.mockReturnValue(new Promise(() => {}));

            render(<ComponentDetailPage />);

            expect(screen.getByRole("status")).toBeInTheDocument();
        });
    });

    describe("Data loaded", () => {
        it("renders the header with the component name", async () => {
            mockGetBySlug.mockResolvedValue({ data: mockComponent });

            render(<ComponentDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("component-header")).toHaveTextContent(
                    "api-gateway",
                );
            });
        });

        it("renders the detail sections", async () => {
            mockGetBySlug.mockResolvedValue({ data: mockComponent });

            render(<ComponentDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByTestId("information-section"),
                ).toBeInTheDocument();
            });
            expect(
                screen.getByTestId("other-details-section"),
            ).toBeInTheDocument();
            expect(
                screen.getByTestId("business-support-section"),
            ).toBeInTheDocument();
            expect(screen.getByTestId("lifecycle-timeline")).toBeInTheDocument();
        });

        it("calls getBySlug with the id from the route", async () => {
            mockGetBySlug.mockResolvedValue({ data: mockComponent });

            render(<ComponentDetailPage />);

            await waitFor(() => {
                expect(mockGetBySlug).toHaveBeenCalled();
            });
            // First positional arg is the slug.
            expect(mockGetBySlug.mock.calls[0][0]).toBe("api-gateway");
        });
    });

    describe("Error state", () => {
        it("renders an error message when the request fails", async () => {
            mockGetBySlug.mockRejectedValue(new Error("not found"));

            render(<ComponentDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/componente no disponible/i),
                ).toBeInTheDocument();
            });
        });
    });
});
