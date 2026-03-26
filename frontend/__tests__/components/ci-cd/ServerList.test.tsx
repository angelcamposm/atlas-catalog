import { render, screen, fireEvent } from "@testing-library/react";
import { ServerList } from "@/components/ci-cd/ServerList";
import type { CiServer } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineServer: () => <span data-testid="icon-server" />,
    HiOutlineEye: () => <span data-testid="icon-eye" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
}));

const createMockServer = (overrides: Partial<CiServer> = {}): CiServer => ({
    id: 1,
    name: "Jenkins Production",
    driver: "jenkins",
    url: "https://jenkins.example.com",
    is_enabled: true,
    last_synced_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("ServerList", () => {
    describe("Rendering", () => {
        it("should render a list of servers", () => {
            const servers = [
                createMockServer({ id: 1, name: "Jenkins Production" }),
                createMockServer({ id: 2, name: "GitHub Actions" }),
            ];
            render(<ServerList servers={servers} />);
            expect(screen.getByText("Jenkins Production")).toBeInTheDocument();
            expect(screen.getByText("GitHub Actions")).toBeInTheDocument();
        });

        it("should display server driver", () => {
            render(<ServerList servers={[createMockServer({ driver: "jenkins" })]} />);
            expect(screen.getByText("jenkins")).toBeInTheDocument();
        });

        it("should show dash when driver is null", () => {
            render(<ServerList servers={[createMockServer({ driver: null })]} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });

        it("should display server url", () => {
            render(
                <ServerList
                    servers={[
                        createMockServer({ url: "https://jenkins.example.com" }),
                    ]}
                />,
            );
            expect(
                screen.getByText("https://jenkins.example.com"),
            ).toBeInTheDocument();
        });

        it("should show enabled status", () => {
            render(<ServerList servers={[createMockServer({ is_enabled: true })]} />);
            expect(screen.getByText("Enabled")).toBeInTheDocument();
        });

        it("should show disabled status", () => {
            render(
                <ServerList
                    servers={[createMockServer({ is_enabled: false })]}
                />,
            );
            expect(screen.getByText("Disabled")).toBeInTheDocument();
        });

        it("should render empty state when no servers", () => {
            render(<ServerList servers={[]} />);
            expect(screen.getByText(/no ci servers/i)).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should call onView when view button is clicked", () => {
            const onView = jest.fn();
            render(<ServerList servers={[createMockServer({ id: 1 })]} onView={onView} />);
            fireEvent.click(screen.getByTestId("icon-eye").closest("button")!);
            expect(onView).toHaveBeenCalledWith(1);
        });

        it("should call onEdit when edit button is clicked", () => {
            const onEdit = jest.fn();
            render(<ServerList servers={[createMockServer({ id: 1 })]} onEdit={onEdit} />);
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(1);
        });

        it("should call onDelete when delete button is clicked", () => {
            const onDelete = jest.fn();
            render(<ServerList servers={[createMockServer({ id: 1 })]} onDelete={onDelete} />);
            fireEvent.click(screen.getByTestId("icon-trash").closest("button")!);
            expect(onDelete).toHaveBeenCalledWith(1);
        });

        it("should not render action buttons when handlers not provided", () => {
            render(<ServerList servers={[createMockServer()]} />);
            expect(screen.queryByTestId("icon-edit")).not.toBeInTheDocument();
            expect(screen.queryByTestId("icon-trash")).not.toBeInTheDocument();
        });
    });
});
