import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CiCdWidget } from "@/components/dashboard/widgets/CiCdWidget";

jest.mock("@/lib/api", () => ({
    workflowsApi: {
        getRuns: jest.fn(),
    },
    deploymentsApi: {
        getAll: jest.fn(),
    },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineArrowPath: () => <span data-testid="icon-cicd">cicd</span>,
}));

const { workflowsApi, deploymentsApi } = jest.requireMock("@/lib/api");

const createMockRun = (overrides = {}) => ({
    id: 1,
    name: "CI Run",
    status: "success",
    conclusion: "success",
    run_number: 1,
    workflow_id: null,
    ci_server_id: null,
    branch: null,
    commit_sha: null,
    started_at: "2024-01-01T00:00:00Z",
    finished_at: "2024-01-01T00:05:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:05:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

const createMockDeployment = (overrides = {}) => ({
    id: 1,
    workflow_run_id: null,
    component_id: null,
    environment_id: null,
    version: "1.0.0",
    commit_hash: null,
    docker_image_digest: null,
    status: "success",
    started_at: "2024-01-01T00:00:00Z",
    ended_at: "2024-01-01T00:05:00Z",
    duration_milliseconds: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:05:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("CiCdWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Loading state", () => {
        it("renders loading skeleton initially", () => {
            workflowsApi.getRuns.mockReturnValue(new Promise(() => {}));
            deploymentsApi.getAll.mockReturnValue(new Promise(() => {}));
            render(<CiCdWidget />);
            expect(
                document.querySelector(".animate-pulse") ||
                    screen.queryByTestId("skeleton")
            ).toBeTruthy();
        });
    });

    describe("Loaded state", () => {
        it("shows CI/CD title", async () => {
            workflowsApi.getRuns.mockResolvedValue({
                data: [createMockRun()],
                meta: { total: 1, current_page: 1, last_page: 1, per_page: 100, from: 1, to: 1 },
            });
            deploymentsApi.getAll.mockResolvedValue({
                data: [],
                meta: { total: 0, current_page: 1, last_page: 1, per_page: 100, from: 0, to: 0 },
            });
            render(<CiCdWidget />);
            await waitFor(() => {
                expect(screen.getByText("CI/CD")).toBeInTheDocument();
            });
        });

        it("shows run count", async () => {
            workflowsApi.getRuns.mockResolvedValue({
                data: [createMockRun({ id: 1 }), createMockRun({ id: 2 })],
                meta: { total: 2, current_page: 1, last_page: 1, per_page: 100, from: 1, to: 2 },
            });
            deploymentsApi.getAll.mockResolvedValue({
                data: [],
                meta: { total: 0, current_page: 1, last_page: 1, per_page: 100, from: 0, to: 0 },
            });
            render(<CiCdWidget />);
            await waitFor(() => {
                expect(screen.getByText("2")).toBeInTheDocument();
            });
        });

        it("handles empty runs", async () => {
            workflowsApi.getRuns.mockResolvedValue({
                data: [],
                meta: { total: 0, current_page: 1, last_page: 1, per_page: 100, from: 0, to: 0 },
            });
            deploymentsApi.getAll.mockResolvedValue({
                data: [],
                meta: { total: 0, current_page: 1, last_page: 1, per_page: 100, from: 0, to: 0 },
            });
            render(<CiCdWidget />);
            await waitFor(() => {
                expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
            });
        });
    });
});
