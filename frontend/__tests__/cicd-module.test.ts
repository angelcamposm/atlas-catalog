/**
 * Tests for CI/CD Workflows API module
 */

import { workflowsApi } from "@/lib/api";

// Mock the api-client
jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        buildQuery: jest.fn((params: Record<string, unknown>) => {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, String(value));
                }
            });
            const queryString = query.toString();
            return queryString ? `?${queryString}` : "";
        }),
    },
    ApiError: class ApiError extends Error {
        constructor(
            message: string,
            public status: number,
        ) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const createWorkflowRunMock = (overrides = {}) => ({
    id: 1,
    name: "Build & Deploy",
    status: "success",
    started_at: "2024-01-01T10:00:00Z",
    finished_at: "2024-01-01T10:05:00Z",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:05:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const createWorkflowCommitMock = (overrides = {}) => ({
    id: 1,
    sha: "abc123def456",
    message: "feat: add new feature",
    author: "developer",
    committed_at: "2024-01-01T09:00:00Z",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-01T09:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const createWorkflowJobMock = (overrides = {}) => ({
    id: 1,
    workflow_run_id: 1,
    name: "test",
    status: "success",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:02:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const createPaginatedResponse = <T>(data: T[], page = 1) => ({
    data,
    meta: {
        current_page: page,
        last_page: 1,
        per_page: 15,
        from: 1,
        to: data.length,
        total: data.length,
        path: "/api/v1/ci-cd/workflows",
    },
    links: {
        first: "/api/v1/ci-cd/workflows?page=1",
        last: "/api/v1/ci-cd/workflows?page=1",
        prev: null,
        next: null,
    },
});

describe("workflowsApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Structure", () => {
        it("exports workflowsApi with all run methods", () => {
            expect(workflowsApi.getRuns).toBeDefined();
            expect(workflowsApi.getRunById).toBeDefined();
            expect(workflowsApi.createRun).toBeDefined();
            expect(workflowsApi.updateRun).toBeDefined();
            expect(workflowsApi.deleteRun).toBeDefined();
        });

        it("exports workflowsApi with all commit methods", () => {
            expect(workflowsApi.getCommits).toBeDefined();
            expect(workflowsApi.getCommitById).toBeDefined();
            expect(workflowsApi.createCommit).toBeDefined();
            expect(workflowsApi.updateCommit).toBeDefined();
            expect(workflowsApi.deleteCommit).toBeDefined();
        });

        it("exports workflowsApi with jobs method", () => {
            expect(workflowsApi.getJobs).toBeDefined();
        });

        it("all methods are functions", () => {
            expect(typeof workflowsApi.getRuns).toBe("function");
            expect(typeof workflowsApi.getRunById).toBe("function");
            expect(typeof workflowsApi.createRun).toBe("function");
            expect(typeof workflowsApi.updateRun).toBe("function");
            expect(typeof workflowsApi.deleteRun).toBe("function");
            expect(typeof workflowsApi.getCommits).toBe("function");
            expect(typeof workflowsApi.getCommitById).toBe("function");
            expect(typeof workflowsApi.createCommit).toBe("function");
            expect(typeof workflowsApi.updateCommit).toBe("function");
            expect(typeof workflowsApi.deleteCommit).toBe("function");
            expect(typeof workflowsApi.getJobs).toBe("function");
        });
    });

    describe("Workflow Runs", () => {
        describe("getRuns", () => {
            it("calls GET /v1/ci-cd/workflows/runs with page param", async () => {
                const mockRuns = [createWorkflowRunMock()];
                mockedApiClient.get.mockResolvedValueOnce(
                    createPaginatedResponse(mockRuns),
                );
                mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

                const result = await workflowsApi.getRuns(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/runs?page=1",
                );
                expect(result.data).toHaveLength(1);
            });

            it("uses default page 1 when no argument provided", async () => {
                mockedApiClient.get.mockResolvedValueOnce(
                    createPaginatedResponse([createWorkflowRunMock()]),
                );
                mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

                await workflowsApi.getRuns();

                expect(mockedApiClient.buildQuery).toHaveBeenCalledWith({
                    page: 1,
                });
            });
        });

        describe("getRunById", () => {
            it("calls GET /v1/ci-cd/workflows/runs/:id", async () => {
                const mockRun = createWorkflowRunMock();
                mockedApiClient.get.mockResolvedValueOnce({ data: mockRun });

                const result = await workflowsApi.getRunById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/runs/1",
                );
                expect(result.data.id).toBe(1);
                expect(result.data.name).toBe("Build & Deploy");
            });
        });

        describe("createRun", () => {
            it("calls POST /v1/ci-cd/workflows/runs with data", async () => {
                const createData = { name: "New Run", status: "pending" };
                const mockRun = createWorkflowRunMock({
                    name: "New Run",
                    status: "pending",
                });
                mockedApiClient.post.mockResolvedValueOnce({ data: mockRun });

                const result = await workflowsApi.createRun(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/runs",
                    createData,
                );
                expect(result.data.name).toBe("New Run");
            });
        });

        describe("updateRun", () => {
            it("calls PUT /v1/ci-cd/workflows/runs/:id with data", async () => {
                const updateData = { status: "failed" };
                const mockRun = createWorkflowRunMock({ status: "failed" });
                mockedApiClient.put.mockResolvedValueOnce({ data: mockRun });

                const result = await workflowsApi.updateRun(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/runs/1",
                    updateData,
                );
                expect(result.data.status).toBe("failed");
            });
        });

        describe("deleteRun", () => {
            it("calls DELETE /v1/ci-cd/workflows/runs/:id", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await workflowsApi.deleteRun(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/runs/1",
                );
            });
        });
    });

    describe("Workflow Commits", () => {
        describe("getCommits", () => {
            it("calls GET /v1/ci-cd/workflows/commits with page param", async () => {
                const mockCommits = [createWorkflowCommitMock()];
                mockedApiClient.get.mockResolvedValueOnce(
                    createPaginatedResponse(mockCommits),
                );
                mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

                const result = await workflowsApi.getCommits(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/commits?page=1",
                );
                expect(result.data).toHaveLength(1);
                expect(result.data[0].sha).toBe("abc123def456");
            });

            it("uses default page 1 when no argument provided", async () => {
                mockedApiClient.get.mockResolvedValueOnce(
                    createPaginatedResponse([createWorkflowCommitMock()]),
                );
                mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

                await workflowsApi.getCommits();

                expect(mockedApiClient.buildQuery).toHaveBeenCalledWith({
                    page: 1,
                });
            });
        });

        describe("getCommitById", () => {
            it("calls GET /v1/ci-cd/workflows/commits/:id", async () => {
                const mockCommit = createWorkflowCommitMock();
                mockedApiClient.get.mockResolvedValueOnce({ data: mockCommit });

                const result = await workflowsApi.getCommitById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/commits/1",
                );
                expect(result.data.sha).toBe("abc123def456");
            });
        });

        describe("createCommit", () => {
            it("calls POST /v1/ci-cd/workflows/commits with data", async () => {
                const createData = {
                    sha: "newsha789",
                    message: "fix: bug fix",
                };
                const mockCommit = createWorkflowCommitMock({
                    sha: "newsha789",
                });
                mockedApiClient.post.mockResolvedValueOnce({
                    data: mockCommit,
                });

                const result = await workflowsApi.createCommit(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/commits",
                    createData,
                );
                expect(result.data.sha).toBe("newsha789");
            });
        });

        describe("updateCommit", () => {
            it("calls PUT /v1/ci-cd/workflows/commits/:id with data", async () => {
                const updateData = { message: "updated message" };
                const mockCommit = createWorkflowCommitMock({
                    message: "updated message",
                });
                mockedApiClient.put.mockResolvedValueOnce({ data: mockCommit });

                const result = await workflowsApi.updateCommit(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/commits/1",
                    updateData,
                );
                expect(result.data.message).toBe("updated message");
            });
        });

        describe("deleteCommit", () => {
            it("calls DELETE /v1/ci-cd/workflows/commits/:id", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await workflowsApi.deleteCommit(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/commits/1",
                );
            });
        });
    });

    describe("Workflow Jobs", () => {
        describe("getJobs", () => {
            it("calls GET /v1/ci-cd/workflows/:id/jobs", async () => {
                const mockJobs = [
                    createWorkflowJobMock({ name: "test" }),
                    createWorkflowJobMock({ id: 2, name: "build" }),
                ];
                mockedApiClient.get.mockResolvedValueOnce({ data: mockJobs });

                const result = await workflowsApi.getJobs(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/ci-cd/workflows/1/jobs",
                );
                expect(result).toHaveLength(2);
                expect(result[0].name).toBe("test");
            });

            it("handles direct array response format", async () => {
                const mockJobs = [createWorkflowJobMock()];
                mockedApiClient.get.mockResolvedValueOnce(mockJobs);

                const result = await workflowsApi.getJobs(1);

                expect(result).toHaveLength(1);
            });
        });
    });
});
