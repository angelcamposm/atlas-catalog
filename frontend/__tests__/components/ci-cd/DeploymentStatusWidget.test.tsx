import { render, screen } from "@testing-library/react";
import { DeploymentStatusWidget } from "@/components/ci-cd/DeploymentStatusWidget";
import type { CiDeployment } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineRocketLaunch: () => <span data-testid="icon-rocket" />,
    HiOutlineCheckCircle: () => <span data-testid="icon-check" />,
    HiOutlineXCircle: () => <span data-testid="icon-x" />,
    HiOutlineClock: () => <span data-testid="icon-clock" />,
}));

const createMockDeployment = (
    overrides: Partial<CiDeployment> = {},
): CiDeployment => ({
    id: 1,
    workflow_run_id: 10,
    component_id: 5,
    environment_id: 1,
    version: "1.0.0",
    commit_hash: "abc123",
    docker_image_digest: "sha256:abc",
    status: "success",
    started_at: "2024-01-15T10:00:00Z",
    ended_at: "2024-01-15T10:02:00Z",
    duration_milliseconds: 120000,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:02:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("DeploymentStatusWidget", () => {
    describe("Rendering", () => {
        it("should render widget title", () => {
            render(<DeploymentStatusWidget deployments={[]} />);
            expect(screen.getByText("Recent Deployments")).toBeInTheDocument();
        });

        it("should render a list of deployments", () => {
            const deployments = [
                createMockDeployment({ id: 1, version: "1.0.0" }),
                createMockDeployment({ id: 2, version: "2.0.0" }),
            ];
            render(<DeploymentStatusWidget deployments={deployments} />);
            expect(screen.getByText("1.0.0")).toBeInTheDocument();
            expect(screen.getByText("2.0.0")).toBeInTheDocument();
        });

        it("should show empty state when no deployments", () => {
            render(<DeploymentStatusWidget deployments={[]} />);
            expect(
                screen.getByText(/no recent deployments/i),
            ).toBeInTheDocument();
        });

        it("should display deployment status", () => {
            const deployments = [createMockDeployment({ status: "success" })];
            render(<DeploymentStatusWidget deployments={deployments} />);
            expect(screen.getByText("success")).toBeInTheDocument();
        });

        it("should display dash when version is null", () => {
            const deployments = [createMockDeployment({ version: null })];
            render(<DeploymentStatusWidget deployments={deployments} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display dash when status is null", () => {
            const deployments = [createMockDeployment({ status: null, version: "1.0.0" })];
            render(<DeploymentStatusWidget deployments={deployments} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });
    });
});
