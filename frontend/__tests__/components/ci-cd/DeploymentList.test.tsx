import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeploymentList } from "@/components/ci-cd/DeploymentList";
import type { CiDeployment } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineEye: () => <span data-testid="icon-eye">eye</span>,
    HiOutlineCheckCircle: () => <span data-testid="icon-check">check</span>,
    HiOutlineXCircle: () => <span data-testid="icon-x">x</span>,
    HiOutlinePlay: () => <span data-testid="icon-play">play</span>,
    HiOutlineClock: () => <span data-testid="icon-clock">clock</span>,
}));

function createMockDeployment(
    overrides: Partial<CiDeployment> = {}
): CiDeployment {
    return {
        id: 1,
        workflow_run_id: 10,
        component_id: 5,
        environment_id: 2,
        version: "v1.0.0",
        commit_hash: "abc1234",
        docker_image_digest: "sha256:abc",
        status: "success",
        started_at: "2024-04-01",
        ended_at: "2024-04-01",
        duration_milliseconds: 3000,
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

describe("DeploymentList", () => {
    describe("Rendering", () => {
        it("should render a list of deployments", () => {
            const deployments = [
                createMockDeployment({ id: 1, version: "v1.0.0" }),
                createMockDeployment({ id: 2, version: "v2.0.0" }),
            ];
            render(<DeploymentList deployments={deployments} />);

            expect(screen.getByText("v1.0.0")).toBeInTheDocument();
            expect(screen.getByText("v2.0.0")).toBeInTheDocument();
        });

        it("should render deployment status", () => {
            render(
                <DeploymentList
                    deployments={[createMockDeployment({ status: "success" })]}
                />
            );

            expect(screen.getByText("success")).toBeInTheDocument();
        });

        it("should show dash for null version", () => {
            render(
                <DeploymentList
                    deployments={[createMockDeployment({ version: null })]}
                />
            );

            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should render empty state when no deployments", () => {
            render(<DeploymentList deployments={[]} />);

            expect(
                screen.getByText("No deployments found")
            ).toBeInTheDocument();
        });

        it("should show started_at date", () => {
            render(
                <DeploymentList
                    deployments={[
                        createMockDeployment({ started_at: "2024-06-05" }),
                    ]}
                />
            );

            expect(screen.getByText(/2024-06-05/)).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should call onView when view button clicked", () => {
            const onView = jest.fn();
            const deployments = [createMockDeployment({ id: 99 })];
            render(<DeploymentList deployments={deployments} onView={onView} />);

            const viewBtn = screen.getByRole("button", { name: /view/i });
            fireEvent.click(viewBtn);

            expect(onView).toHaveBeenCalledWith(99);
        });

        it("should not render action buttons when no handlers provided", () => {
            const deployments = [createMockDeployment()];
            render(<DeploymentList deployments={deployments} />);

            expect(
                screen.queryByRole("button", { name: /view/i })
            ).not.toBeInTheDocument();
        });
    });
});
