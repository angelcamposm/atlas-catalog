import { render, screen, fireEvent } from "@testing-library/react";
import { EntityDetail } from "@/components/architecture/EntityDetail";
import type { Entity, EntityAttribute, Component } from "@/types/api";

jest.mock("@/lib/api/architecture", () => ({
    entityAttributesApi: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

const mockEntity: Entity = {
    id: 5,
    name: "Customer",
    description: "Represents a customer",
    is_enabled: true,
    domain_id: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
};

const mockAttributes: EntityAttribute[] = [
    {
        id: 1,
        entity_id: 5,
        name: "email",
        type: "string",
        is_required: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

const mockComponents: Component[] = [
    {
        id: 10,
        name: "CustomerService",
        display_name: "Customer Service",
        slug: "customer-service",
        description: null,
        has_zero_downtime_deployment: false,
        is_stateless: false,
        criticality_id: null,
        discovery_source: null,
        domain_id: null,
        lifecycle_id: null,
        operational_status_id: null,
        owner_id: null,
        platform_id: null,
        status_id: null,
        tags: null,
        tier_id: null,
        type_id: null,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

const mockOnAttributeChange = jest.fn();

describe("EntityDetail", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Tabs navigation", () => {
        it("should render all three tabs", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={mockAttributes}
                    components={mockComponents}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            expect(screen.getByText("Resumen")).toBeInTheDocument();
            expect(screen.getByText("Atributos")).toBeInTheDocument();
            expect(screen.getByText("Componentes")).toBeInTheDocument();
        });

        it("should show Resumen tab by default", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={[]}
                    components={[]}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            expect(screen.getByText("Información General")).toBeInTheDocument();
            expect(screen.getByText("Customer")).toBeInTheDocument();
        });

        it("should show Atributos tab when clicked", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={mockAttributes}
                    components={[]}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            fireEvent.click(screen.getByRole("button", { name: /atributos/i }));

            expect(screen.getByText("email")).toBeInTheDocument();
        });

        it("should show Componentes tab when clicked", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={[]}
                    components={mockComponents}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            fireEvent.click(
                screen.getByRole("button", { name: /componentes/i }),
            );

            expect(screen.getByText("Customer Service")).toBeInTheDocument();
        });
    });

    describe("Overview tab", () => {
        it("should display entity name, description and status", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={[]}
                    components={[]}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            expect(screen.getByText("Customer")).toBeInTheDocument();
            expect(
                screen.getByText("Represents a customer"),
            ).toBeInTheDocument();
            expect(screen.getByText("Activa")).toBeInTheDocument();
        });

        it("should show Inactiva badge when entity is disabled", () => {
            render(
                <EntityDetail
                    entity={{ ...mockEntity, is_enabled: false }}
                    attributes={[]}
                    components={[]}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            expect(screen.getByText("Inactiva")).toBeInTheDocument();
        });
    });

    describe("Components tab", () => {
        it("should show empty state when no components", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={[]}
                    components={[]}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            fireEvent.click(
                screen.getByRole("button", { name: /componentes/i }),
            );

            expect(
                screen.getByText(/no hay componentes asociados/i),
            ).toBeInTheDocument();
        });

        it("should render component link with locale", () => {
            render(
                <EntityDetail
                    entity={mockEntity}
                    attributes={[]}
                    components={mockComponents}
                    locale="es"
                    onAttributeChange={mockOnAttributeChange}
                />,
            );

            fireEvent.click(
                screen.getByRole("button", { name: /componentes/i }),
            );

            const link = screen.getByText("Ver detalle").closest("a");
            expect(link).toHaveAttribute(
                "href",
                "/es/catalog/customer-service",
            );
        });
    });
});
