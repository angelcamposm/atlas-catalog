import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceAccountList } from "@/components/security/ServiceAccountList";
import type { ServiceAccount } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineComputerDesktop: () => <span data-testid="icon-computer" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
    HiOutlineEye: () => <span data-testid="icon-view" />,
}));

const createMockAccount = (
    overrides: Partial<ServiceAccount> = {},
): ServiceAccount => ({
    id: 1,
    name: "deploy-bot",
    namespace: "production",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("ServiceAccountList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of service accounts", () => {
            const accounts = [
                createMockAccount({ id: 1, name: "deploy-bot" }),
                createMockAccount({ id: 2, name: "ci-runner" }),
            ];
            render(<ServiceAccountList accounts={accounts} />);
            expect(screen.getByText("deploy-bot")).toBeInTheDocument();
            expect(screen.getByText("ci-runner")).toBeInTheDocument();
        });

        it("should display the namespace of each account", () => {
            const accounts = [createMockAccount({ namespace: "staging" })];
            render(<ServiceAccountList accounts={accounts} />);
            expect(screen.getByText("staging")).toBeInTheDocument();
        });

        it("should show a dash when namespace is null", () => {
            const accounts = [createMockAccount({ namespace: null })];
            render(<ServiceAccountList accounts={accounts} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display the account ID", () => {
            const accounts = [createMockAccount({ id: 99 })];
            render(<ServiceAccountList accounts={accounts} />);
            expect(screen.getByText("99")).toBeInTheDocument();
        });

        it("should show empty state when no accounts exist", () => {
            render(<ServiceAccountList accounts={[]} />);
            expect(
                screen.getByText("No hay service accounts registradas"),
            ).toBeInTheDocument();
        });

        it("should render action buttons for each account", () => {
            const accounts = [
                createMockAccount({ id: 1 }),
                createMockAccount({ id: 2, name: "ci-runner" }),
            ];
            render(<ServiceAccountList accounts={accounts} />);
            expect(screen.getAllByTestId("icon-view")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-edit")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
        });
    });

    describe("Callbacks", () => {
        it("should call onView with the account id when view button is clicked", () => {
            const onView = jest.fn();
            const account = createMockAccount({ id: 5 });
            render(<ServiceAccountList accounts={[account]} onView={onView} />);
            fireEvent.click(screen.getByTestId("icon-view").closest("button")!);
            expect(onView).toHaveBeenCalledWith(5);
        });

        it("should call onEdit with the account when edit button is clicked", () => {
            const onEdit = jest.fn();
            const account = createMockAccount({ id: 7, name: "test-bot" });
            render(<ServiceAccountList accounts={[account]} onEdit={onEdit} />);
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(account);
        });

        it("should call onDelete with the account id when delete button is clicked", () => {
            const onDelete = jest.fn();
            const account = createMockAccount({ id: 9 });
            render(<ServiceAccountList accounts={[account]} onDelete={onDelete} />);
            fireEvent.click(screen.getByTestId("icon-trash").closest("button")!);
            expect(onDelete).toHaveBeenCalledWith(9);
        });

        it("should not throw when callbacks are not provided", () => {
            const accounts = [createMockAccount()];
            expect(() => {
                render(<ServiceAccountList accounts={accounts} />);
                fireEvent.click(screen.getByTestId("icon-view").closest("button")!);
                fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
                fireEvent.click(screen.getByTestId("icon-trash").closest("button")!);
            }).not.toThrow();
        });
    });

    describe("Empty state icon", () => {
        it("should render computer icon in empty state", () => {
            render(<ServiceAccountList accounts={[]} />);
            expect(screen.getByTestId("icon-computer")).toBeInTheDocument();
        });
    });
});
