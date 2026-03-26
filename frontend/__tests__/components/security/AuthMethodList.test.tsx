import { render, screen, fireEvent } from "@testing-library/react";
import { AuthMethodList } from "@/components/security/AuthMethodList";
import type { AuthenticationMethod } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineShieldCheck: () => <span data-testid="icon-shield" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
}));

const createMockMethod = (
    overrides: Partial<AuthenticationMethod> = {},
): AuthenticationMethod => ({
    id: 1,
    name: "OAuth2",
    description: "OAuth 2.0 protocol",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("AuthMethodList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of authentication methods", () => {
            const methods = [
                createMockMethod({ id: 1, name: "OAuth2" }),
                createMockMethod({ id: 2, name: "SAML" }),
            ];
            render(<AuthMethodList methods={methods} />);
            expect(screen.getByText("OAuth2")).toBeInTheDocument();
            expect(screen.getByText("SAML")).toBeInTheDocument();
        });

        it("should display the description of each method", () => {
            const methods = [createMockMethod({ description: "OAuth 2.0 protocol" })];
            render(<AuthMethodList methods={methods} />);
            expect(screen.getByText("OAuth 2.0 protocol")).toBeInTheDocument();
        });

        it("should show a dash when description is null", () => {
            const methods = [createMockMethod({ description: null })];
            render(<AuthMethodList methods={methods} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display the method ID", () => {
            const methods = [createMockMethod({ id: 42 })];
            render(<AuthMethodList methods={methods} />);
            expect(screen.getByText("42")).toBeInTheDocument();
        });

        it("should show empty state when no methods exist", () => {
            render(<AuthMethodList methods={[]} />);
            expect(
                screen.getByText("No hay métodos de autenticación registrados"),
            ).toBeInTheDocument();
        });

        it("should render edit and delete buttons for each method", () => {
            const methods = [
                createMockMethod({ id: 1 }),
                createMockMethod({ id: 2, name: "SAML" }),
            ];
            render(<AuthMethodList methods={methods} />);
            expect(screen.getAllByTestId("icon-edit")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
        });
    });

    describe("Callbacks", () => {
        it("should call onEdit with the method when edit button is clicked", () => {
            const onEdit = jest.fn();
            const method = createMockMethod({ id: 7, name: "Kerberos" });
            render(<AuthMethodList methods={[method]} onEdit={onEdit} />);
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(method);
        });

        it("should call onDelete with the method id when delete button is clicked", () => {
            const onDelete = jest.fn();
            const method = createMockMethod({ id: 9 });
            render(<AuthMethodList methods={[method]} onDelete={onDelete} />);
            fireEvent.click(screen.getByTestId("icon-trash").closest("button")!);
            expect(onDelete).toHaveBeenCalledWith(9);
        });

        it("should not throw when callbacks are not provided", () => {
            const methods = [createMockMethod()];
            expect(() => {
                render(<AuthMethodList methods={methods} />);
                fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
                fireEvent.click(screen.getByTestId("icon-trash").closest("button")!);
            }).not.toThrow();
        });
    });

    describe("Empty state icon", () => {
        it("should render shield icon in empty state", () => {
            render(<AuthMethodList methods={[]} />);
            expect(screen.getByTestId("icon-shield")).toBeInTheDocument();
        });
    });
});
