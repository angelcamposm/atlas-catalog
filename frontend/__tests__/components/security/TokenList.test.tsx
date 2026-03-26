import { render, screen, fireEvent } from "@testing-library/react";
import { TokenList } from "@/components/security/TokenList";
import type { ServiceAccountToken } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineKey: () => <span data-testid="icon-key" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
    HiOutlinePlus: () => <span data-testid="icon-plus" />,
}));

const createMockToken = (
    overrides: Partial<ServiceAccountToken> = {},
): ServiceAccountToken => ({
    id: 1,
    service_account_id: 10,
    token: "tok_abc123xyz",
    expires_at: "2025-12-31T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("TokenList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of tokens", () => {
            const tokens = [
                createMockToken({ id: 1, token: "tok_abc123" }),
                createMockToken({ id: 2, token: "tok_xyz999" }),
            ];
            render(<TokenList tokens={tokens} />);
            expect(screen.getByText("tok_abc123")).toBeInTheDocument();
            expect(screen.getByText("tok_xyz999")).toBeInTheDocument();
        });

        it("should display the expiration date of each token", () => {
            const tokens = [
                createMockToken({ expires_at: "2025-06-30T00:00:00Z" }),
            ];
            render(<TokenList tokens={tokens} />);
            // Just test that the date string appears in some form
            expect(screen.getByText(/2025/)).toBeInTheDocument();
        });

        it("should display the token ID", () => {
            const tokens = [createMockToken({ id: 77 })];
            render(<TokenList tokens={tokens} />);
            expect(screen.getByText("77")).toBeInTheDocument();
        });

        it("should show empty state when no tokens exist", () => {
            render(<TokenList tokens={[]} />);
            expect(
                screen.getByText("No hay tokens generados"),
            ).toBeInTheDocument();
        });

        it("should render a generate token button", () => {
            render(<TokenList tokens={[]} />);
            expect(
                screen.getByRole("button", { name: /generar token/i }),
            ).toBeInTheDocument();
        });

        it("should render delete button for each token", () => {
            const tokens = [
                createMockToken({ id: 1 }),
                createMockToken({ id: 2, token: "tok_other" }),
            ];
            render(<TokenList tokens={tokens} />);
            expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
        });
    });

    describe("Callbacks", () => {
        it("should call onGenerate when generate token button is clicked", () => {
            const onGenerate = jest.fn();
            render(<TokenList tokens={[]} onGenerate={onGenerate} />);
            fireEvent.click(
                screen.getByRole("button", { name: /generar token/i }),
            );
            expect(onGenerate).toHaveBeenCalledTimes(1);
        });

        it("should call onDelete with the token id when delete button is clicked", () => {
            const onDelete = jest.fn();
            const token = createMockToken({ id: 5 });
            render(<TokenList tokens={[token]} onDelete={onDelete} />);
            fireEvent.click(
                screen.getByTestId("icon-trash").closest("button")!,
            );
            expect(onDelete).toHaveBeenCalledWith(5);
        });

        it("should not throw when callbacks are not provided", () => {
            const tokens = [createMockToken()];
            expect(() => {
                render(<TokenList tokens={tokens} />);
                fireEvent.click(
                    screen.getByTestId("icon-trash").closest("button")!,
                );
            }).not.toThrow();
        });
    });

    describe("Empty state icon", () => {
        it("should render key icon in empty state", () => {
            render(<TokenList tokens={[]} />);
            expect(screen.getByTestId("icon-key")).toBeInTheDocument();
        });
    });
});
