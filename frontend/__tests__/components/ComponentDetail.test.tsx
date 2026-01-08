/**
 * Tests for Component Detail sections
 * Following TDD approach - tests written first
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    ComponentDetailHeader,
    InformationSection,
    OtherDetailsSection,
    BusinessSupportSection,
    LifecycleTimeline,
    DeploymentsSection,
    DependenciesSection,
} from "@/components/catalog/component-detail";
import type { Component } from "@/types/api";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

// Mock next/link
jest.mock("next/link", () => {
    return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    };
});

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiChevronDown: () => <span data-testid="chevron-down">▼</span>,
    HiChevronRight: () => <span data-testid="chevron-right">▶</span>,
    HiOutlineInformationCircle: () => <span>ℹ</span>,
    HiOutlineSquare3Stack3D: () => <span>📦</span>,
    HiOutlineBuildingOffice: () => <span>🏢</span>,
    HiOutlineClock: () => <span>🕐</span>,
    HiOutlineServerStack: () => <span>🖥</span>,
    HiOutlineArrowsRightLeft: () => <span>↔</span>,
    HiOutlinePencilSquare: () => <span>✏</span>,
    HiOutlineChevronLeft: () => <span>←</span>,
    HiOutlineTag: () => <span>🏷</span>,
    HiOutlineUserCircle: () => <span>👤</span>,
    HiOutlineCube: () => <span>📦</span>,
    HiOutlineGlobeAlt: () => <span>🌐</span>,
}));

// Sample component data for tests
const mockComponent: Component = {
    id: 1,
    name: "user-auth-service",
    display_name: "User Authentication Service",
    description: "Handles user authentication and authorization",
    slug: "user-auth-service",
    type_id: 1,
    lifecycle_id: 2,
    platform_id: 1,
    domain_id: 1,
    owner_id: 1,
    tier_id: 2,
    criticality_id: 3,
    operational_status_id: 1,
    status_id: 1,
    is_stateless: true,
    has_zero_downtime_deployment: true,
    tags: { team: "auth-team", cost_center: "CC-001" },
    discovery_source: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-15T10:30:00Z",
    created_by: 1,
    updated_by: 1,
};

const mockOwner = {
    id: 1,
    name: "Eugenia",
    email: "eugenia@test.com",
    avatar: null,
};

const mockComponentType = {
    id: 1,
    name: "Service",
    description: "A microservice",
    icon: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
};

const mockLifecycle = {
    id: 2,
    name: "Active",
    color: "#22c55e",
    description: "Component is in active use",
    approval_required: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
};

const mockPlatform = {
    id: 1,
    name: "AWS",
    description: "Amazon Web Services",
    icon: "aws",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
};

const mockBusinessDomain = {
    id: 1,
    name: "Corporate / Human Resources",
    description: null,
    display_name: "Human Resources",
    parent_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
};

const mockDeployments = [
    {
        id: 1,
        environment: { id: 1, name: "DLT", label: "Development" },
        release_id: 1,
        version: "1.2.3",
        deployed_at: "2024-06-15T10:00:00Z",
        deployed_by: 1,
    },
    {
        id: 2,
        environment: { id: 2, name: "INT", label: "Integration" },
        release_id: 2,
        version: "1.2.3",
        deployed_at: "2024-06-14T15:00:00Z",
        deployed_by: 1,
    },
    {
        id: 3,
        environment: { id: 3, name: "UAT", label: "User Acceptance" },
        release_id: 3,
        version: "1.2.2",
        deployed_at: "2024-06-10T09:00:00Z",
        deployed_by: 1,
    },
];

const mockDependencies = {
    provides: [
        { id: 1, name: "Authentication API", type: "api" },
        { id: 2, name: "User Management API", type: "api" },
    ],
    consumes: [
        { id: 3, name: "database-service", type: "component" },
        { id: 4, name: "cache-service", type: "component" },
    ],
    imports: [
        { id: 5, name: "logging-library", type: "library" },
    ],
    requiredBy: [
        { id: 6, name: "api-gateway", type: "component" },
        { id: 7, name: "web-frontend", type: "component" },
    ],
};

// ============================================================================
// ComponentDetailHeader Tests
// ============================================================================

describe("ComponentDetailHeader", () => {
    it("should render component name", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByText("User Authentication Service")).toBeInTheDocument();
    });

    it("should render owner information", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByText("Eugenia")).toBeInTheDocument();
    });

    it("should render lifecycle badge", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render component type badge", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByText("Service")).toBeInTheDocument();
    });

    it("should render breadcrumb navigation", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Components")).toBeInTheDocument();
    });

    it("should render action buttons", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                locale="es"
            />
        );

        expect(screen.getByRole("link", { name: /follow/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /hire me/i })).toBeInTheDocument();
    });

    it("should render profile completion percentage", () => {
        render(
            <ComponentDetailHeader
                component={mockComponent}
                owner={mockOwner}
                componentType={mockComponentType}
                lifecycle={mockLifecycle}
                profileCompletion={75}
                locale="es"
            />
        );

        expect(screen.getByText("75%")).toBeInTheDocument();
    });
});

// ============================================================================
// InformationSection Tests
// ============================================================================

describe("InformationSection", () => {
    it("should render section title", () => {
        render(<InformationSection component={mockComponent} />);
        expect(screen.getByText("Information")).toBeInTheDocument();
    });

    it("should render component name field", () => {
        render(<InformationSection component={mockComponent} defaultExpanded />);
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("user-auth-service")).toBeInTheDocument();
    });

    it("should render component description", () => {
        render(<InformationSection component={mockComponent} defaultExpanded />);
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText(/Handles user authentication/)).toBeInTheDocument();
    });

    it("should show dash when description is empty", () => {
        const componentWithoutDesc = { ...mockComponent, description: null };
        render(<InformationSection component={componentWithoutDesc} defaultExpanded />);
        expect(screen.getByText("—")).toBeInTheDocument();
    });
});

// ============================================================================
// OtherDetailsSection Tests
// ============================================================================

describe("OtherDetailsSection", () => {
    it("should render section title", () => {
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
            />
        );
        expect(screen.getByText("Other Details")).toBeInTheDocument();
    });

    it("should render category/type", () => {
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
                defaultExpanded
            />
        );
        expect(screen.getByText("Category")).toBeInTheDocument();
    });

    it("should render framework when provided", () => {
        const mockFramework = { 
            id: 1, 
            name: "Spring Boot", 
            language_id: 1,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
        };
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
                framework={mockFramework}
                defaultExpanded
            />
        );
        expect(screen.getByText("Framework")).toBeInTheDocument();
        expect(screen.getByText("Spring Boot")).toBeInTheDocument();
    });

    it("should render owner", () => {
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
                owner={mockOwner}
                defaultExpanded
            />
        );
        expect(screen.getByText("Owner")).toBeInTheDocument();
        expect(screen.getByText("Eugenia")).toBeInTheDocument();
    });

    it("should render platform", () => {
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
                defaultExpanded
            />
        );
        expect(screen.getByText("Platform")).toBeInTheDocument();
        expect(screen.getByText("AWS")).toBeInTheDocument();
    });

    it("should render tags", () => {
        render(
            <OtherDetailsSection
                component={mockComponent}
                componentType={mockComponentType}
                platform={mockPlatform}
                defaultExpanded
            />
        );
        expect(screen.getByText("Tags")).toBeInTheDocument();
        expect(screen.getByText(/team/)).toBeInTheDocument();
    });
});

// ============================================================================
// BusinessSupportSection Tests
// ============================================================================

describe("BusinessSupportSection", () => {
    it("should render section title", () => {
        render(<BusinessSupportSection component={mockComponent} />);
        expect(screen.getByText("Business Support")).toBeInTheDocument();
    });

    it("should render business domain", () => {
        render(
            <BusinessSupportSection
                component={mockComponent}
                businessDomain={mockBusinessDomain}
                defaultExpanded
            />
        );
        expect(screen.getByText("Business Domain")).toBeInTheDocument();
        expect(screen.getByText("Human Resources")).toBeInTheDocument();
    });

    it("should render business criticality", () => {
        const mockCriticality = { id: 3, name: "Mission Critical" };
        render(
            <BusinessSupportSection
                component={mockComponent}
                businessCriticality={mockCriticality}
                defaultExpanded
            />
        );
        expect(screen.getByText("Business Criticality")).toBeInTheDocument();
        expect(screen.getByText("Mission Critical")).toBeInTheDocument();
    });

    it("should render TIM information", () => {
        render(
            <BusinessSupportSection
                component={mockComponent}
                businessTIM="BU-1"
                functionalTIM="FT-1"
                defaultExpanded
            />
        );
        expect(screen.getByText("Business TIM")).toBeInTheDocument();
        expect(screen.getByText("Functional TIM")).toBeInTheDocument();
    });
});

// ============================================================================
// LifecycleTimeline Tests
// ============================================================================

describe("LifecycleTimeline", () => {
    const lifecyclePhases = [
        { id: 1, name: "Plan", date: "2024-01-11", color: "#3b82f6" },
        { id: 2, name: "Phase In", date: "2024-05-30", color: "#8b5cf6" },
        { id: 3, name: "Active", date: "2024-09-03", color: "#22c55e" },
        { id: 4, name: "Phase Out", date: "2026-04-20", color: "#f59e0b" },
        { id: 5, name: "End of Life", date: "2026-10-31", color: "#ef4444" },
    ];

    it("should render section title", () => {
        render(
            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={3}
            />
        );
        expect(screen.getByText("Lifecycle")).toBeInTheDocument();
    });

    it("should render all lifecycle phases", () => {
        render(
            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={3}
                defaultExpanded
            />
        );

        expect(screen.getByText("Plan")).toBeInTheDocument();
        expect(screen.getByText("Phase In")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
        expect(screen.getByText("Phase Out")).toBeInTheDocument();
        expect(screen.getByText("End of Life")).toBeInTheDocument();
    });

    it("should highlight current phase", () => {
        render(
            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={3}
                defaultExpanded
            />
        );

        // The active phase should have special styling
        const activePhase = screen.getByText("Active");
        expect(activePhase).toBeInTheDocument();
    });

    it("should render phase dates", () => {
        render(
            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={3}
                defaultExpanded
            />
        );

        expect(screen.getByText("2024-01-11")).toBeInTheDocument();
    });
});

// ============================================================================
// DeploymentsSection Tests
// ============================================================================

describe("DeploymentsSection", () => {
    it("should render section title", () => {
        render(<DeploymentsSection deployments={mockDeployments} />);
        expect(screen.getByText("Deployments")).toBeInTheDocument();
    });

    it("should render environment columns", () => {
        render(<DeploymentsSection deployments={mockDeployments} defaultExpanded />);

        expect(screen.getByText("DLT")).toBeInTheDocument();
        expect(screen.getByText("INT")).toBeInTheDocument();
        expect(screen.getByText("UAT")).toBeInTheDocument();
    });

    it("should render versions", () => {
        render(<DeploymentsSection deployments={mockDeployments} defaultExpanded />);

        expect(screen.getAllByText("1.2.3")).toHaveLength(2);
        expect(screen.getByText("1.2.2")).toBeInTheDocument();
    });

    it("should render application environments row", () => {
        render(
            <DeploymentsSection
                deployments={mockDeployments}
                applicationName="user-auth-service"
                defaultExpanded
            />
        );

        expect(screen.getByText("Application Environments")).toBeInTheDocument();
    });

    it("should show empty state when no deployments", () => {
        render(<DeploymentsSection deployments={[]} defaultExpanded />);
        expect(screen.getByText(/No deployments/i)).toBeInTheDocument();
    });
});

// ============================================================================
// DependenciesSection Tests
// ============================================================================

describe("DependenciesSection", () => {
    it("should render section title with count", () => {
        render(
            <DependenciesSection
                provides={mockDependencies.provides}
                consumes={mockDependencies.consumes}
                imports={mockDependencies.imports}
                requiredBy={mockDependencies.requiredBy}
            />
        );
        expect(screen.getByText(/Dependencies/)).toBeInTheDocument();
    });

    it("should render provides subsection", () => {
        render(
            <DependenciesSection
                provides={mockDependencies.provides}
                consumes={[]}
                imports={[]}
                requiredBy={[]}
                defaultExpanded
            />
        );

        expect(screen.getByText("Provides")).toBeInTheDocument();
        expect(screen.getByText("Authentication API")).toBeInTheDocument();
    });

    it("should render consumes subsection", () => {
        render(
            <DependenciesSection
                provides={[]}
                consumes={mockDependencies.consumes}
                imports={[]}
                requiredBy={[]}
                defaultExpanded
            />
        );

        expect(screen.getByText("Consumes")).toBeInTheDocument();
        expect(screen.getByText("database-service")).toBeInTheDocument();
    });

    it("should render imports subsection", () => {
        render(
            <DependenciesSection
                provides={[]}
                consumes={[]}
                imports={mockDependencies.imports}
                requiredBy={[]}
                defaultExpanded
            />
        );

        expect(screen.getByText("Imports")).toBeInTheDocument();
        expect(screen.getByText("logging-library")).toBeInTheDocument();
    });

    it("should render required by subsection", () => {
        render(
            <DependenciesSection
                provides={[]}
                consumes={[]}
                imports={[]}
                requiredBy={mockDependencies.requiredBy}
                defaultExpanded
            />
        );

        expect(screen.getByText("Required by")).toBeInTheDocument();
        expect(screen.getByText("api-gateway")).toBeInTheDocument();
    });

    it("should show total dependency count", () => {
        render(
            <DependenciesSection
                provides={mockDependencies.provides}
                consumes={mockDependencies.consumes}
                imports={mockDependencies.imports}
                requiredBy={mockDependencies.requiredBy}
                defaultExpanded
            />
        );

        // The total count is displayed as a badge
        expect(screen.getByText("Total dependencies:")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
    });
});
