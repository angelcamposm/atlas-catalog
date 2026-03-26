import { render, screen, fireEvent } from "@testing-library/react";
import { AuthMethodForm } from "@/components/security/AuthMethodForm";
import type { AuthenticationMethod, CreateAuthenticationMethodRequest } from "@/types/api";

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

describe("AuthMethodForm", () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering — create mode", () => {
        it("should render the name input empty in create mode", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            const input = screen.getByLabelText(/nombre/i) as HTMLInputElement;
            expect(input.value).toBe("");
        });

        it("should render the description textarea empty in create mode", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            const textarea = screen.getByLabelText(/descripción/i) as HTMLTextAreaElement;
            expect(textarea.value).toBe("");
        });

        it("should show 'Crear' submit button in create mode", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            expect(screen.getByRole("button", { name: /crear/i })).toBeInTheDocument();
        });
    });

    describe("Rendering — edit mode", () => {
        it("should pre-fill name when editing an existing method", () => {
            const method = createMockMethod({ name: "SAML 2.0" });
            render(<AuthMethodForm method={method} onSave={onSave} onCancel={onCancel} />);
            const input = screen.getByLabelText(/nombre/i) as HTMLInputElement;
            expect(input.value).toBe("SAML 2.0");
        });

        it("should pre-fill description when editing", () => {
            const method = createMockMethod({ description: "Security Assertion Markup Language" });
            render(
                <AuthMethodForm method={method} onSave={onSave} onCancel={onCancel} />,
            );
            const textarea = screen.getByLabelText(/descripción/i) as HTMLTextAreaElement;
            expect(textarea.value).toBe("Security Assertion Markup Language");
        });

        it("should show 'Actualizar' submit button in edit mode", () => {
            const method = createMockMethod();
            render(<AuthMethodForm method={method} onSave={onSave} onCancel={onCancel} />);
            expect(screen.getByRole("button", { name: /actualizar/i })).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onSave with form data when submitted", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            fireEvent.change(screen.getByLabelText(/nombre/i), {
                target: { value: "Kerberos" },
            });
            fireEvent.change(screen.getByLabelText(/descripción/i), {
                target: { value: "Network auth protocol" },
            });
            fireEvent.click(screen.getByRole("button", { name: /crear/i }));
            expect(onSave).toHaveBeenCalledWith({
                name: "Kerberos",
                description: "Network auth protocol",
            });
        });

        it("should call onCancel when cancel button is clicked", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
            expect(onCancel).toHaveBeenCalledTimes(1);
        });

        it("should not submit when name is empty", () => {
            render(<AuthMethodForm onSave={onSave} onCancel={onCancel} />);
            fireEvent.click(screen.getByRole("button", { name: /crear/i }));
            expect(onSave).not.toHaveBeenCalled();
        });
    });
});
