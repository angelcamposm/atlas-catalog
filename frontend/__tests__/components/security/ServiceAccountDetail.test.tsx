import { render, screen } from "@testing-library/react";
import { ServiceAccountDetail } from "@/components/security/ServiceAccountDetail";
import type { ServiceAccount } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineComputerDesktop: () => <span data-testid="icon-computer" />,
    HiOutlineGlobeAlt: () => <span data-testid="icon-globe" />,
    HiOutlineHashtag: () => <span data-testid="icon-hash" />,
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

describe("ServiceAccountDetail", () => {
    describe("Rendering", () => {
        it("should render the account name", () => {
            render(
                <ServiceAccountDetail
                    account={createMockAccount({ name: "ci-runner" })}
                />,
            );
            expect(screen.getByText("ci-runner")).toBeInTheDocument();
        });

        it("should display the namespace", () => {
            render(
                <ServiceAccountDetail
                    account={createMockAccount({ namespace: "staging" })}
                />,
            );
            expect(screen.getByText("staging")).toBeInTheDocument();
        });

        it("should show 'Sin namespace' when namespace is null", () => {
            render(
                <ServiceAccountDetail
                    account={createMockAccount({ namespace: null })}
                />,
            );
            expect(screen.getByText("Sin namespace")).toBeInTheDocument();
        });

        it("should display the account ID", () => {
            render(
                <ServiceAccountDetail
                    account={createMockAccount({ id: 42 })}
                />,
            );
            expect(screen.getByText("42")).toBeInTheDocument();
        });

        it("should render the computer desktop icon", () => {
            render(<ServiceAccountDetail account={createMockAccount()} />);
            expect(screen.getByTestId("icon-computer")).toBeInTheDocument();
        });

        it("should display the tokens count badge when provided", () => {
            render(
                <ServiceAccountDetail
                    account={createMockAccount()}
                    tokensCount={5}
                />,
            );
            expect(screen.getByText("5")).toBeInTheDocument();
        });

        it("should not display tokens count when not provided", () => {
            render(<ServiceAccountDetail account={createMockAccount()} />);
            // Without tokensCount prop, the "5" shouldn't appear
            expect(screen.queryByText("5")).not.toBeInTheDocument();
        });

        it("should display the creation date label", () => {
            render(<ServiceAccountDetail account={createMockAccount()} />);
            expect(screen.getByText(/creada/i)).toBeInTheDocument();
        });
    });
});
