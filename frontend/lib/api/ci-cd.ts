/**
 * API endpoints for CI/CD domain management
 * Includes: CI Servers, Workflow Runs, Workflow Commits, Workflow Jobs, Releases, Deployments
 */

import { apiClient } from "../api-client";
import {
    workflowRunSchema,
    workflowCommitSchema,
    workflowJobSchema,
    paginationMetaSchema,
    paginationLinksSchema,
    ciServerSchema,
    ciReleaseSchema,
    ciDeploymentSchema,
} from "@/types/api";
import type {
    WorkflowRun,
    WorkflowCommit,
    WorkflowJob,
    PaginatedResponse,
    CiServer,
    CiRelease,
    CiDeployment,
    CreateWorkflowRunRequest,
    UpdateWorkflowRunRequest,
    CreateWorkflowCommitRequest,
    UpdateWorkflowCommitRequest,
    CreateCiServerRequest,
    UpdateCiServerRequest,
    CreateCiReleaseRequest,
    UpdateCiReleaseRequest,
    UpdateCiDeploymentRequest,
} from "@/types/api";
import { z } from "zod";

const paginatedWorkflowRunSchema = z.object({
    data: z.array(workflowRunSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});

const workflowRunResponseSchema = z.object({
    data: workflowRunSchema,
});

const paginatedWorkflowCommitSchema = z.object({
    data: z.array(workflowCommitSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});

const workflowCommitResponseSchema = z.object({
    data: workflowCommitSchema,
});

// Workflow Runs ------------------------------------------------------------

export const workflowsApi = {
    // Runs

    /**
     * Get all workflow runs with pagination
     */
    getRuns: async (page = 1): Promise<PaginatedResponse<WorkflowRun>> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/runs${apiClient.buildQuery({ page })}`,
        );
        return paginatedWorkflowRunSchema.parse(response);
    },

    /**
     * Get a single workflow run by ID
     */
    getRunById: async (id: number): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/runs/${id}`,
        );
        return workflowRunResponseSchema.parse(response);
    },

    /**
     * Create a new workflow run
     */
    createRun: async (
        data: CreateWorkflowRunRequest,
    ): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.post<unknown>(
            "/v1/ci-cd/workflows/runs",
            data,
        );
        return workflowRunResponseSchema.parse(response);
    },

    /**
     * Update an existing workflow run
     */
    updateRun: async (
        id: number,
        data: UpdateWorkflowRunRequest,
    ): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.put<unknown>(
            `/v1/ci-cd/workflows/runs/${id}`,
            data,
        );
        return workflowRunResponseSchema.parse(response);
    },

    /**
     * Delete a workflow run
     */
    deleteRun: (id: number) =>
        apiClient.delete(`/v1/ci-cd/workflows/runs/${id}`),

    // Commits

    /**
     * Get all workflow commits with pagination
     */
    getCommits: async (
        page = 1,
    ): Promise<PaginatedResponse<WorkflowCommit>> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/commits${apiClient.buildQuery({ page })}`,
        );
        return paginatedWorkflowCommitSchema.parse(response);
    },

    /**
     * Get a single workflow commit by ID
     */
    getCommitById: async (id: number): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/commits/${id}`,
        );
        return workflowCommitResponseSchema.parse(response);
    },

    /**
     * Create a new workflow commit
     */
    createCommit: async (
        data: CreateWorkflowCommitRequest,
    ): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.post<unknown>(
            "/v1/ci-cd/workflows/commits",
            data,
        );
        return workflowCommitResponseSchema.parse(response);
    },

    /**
     * Update an existing workflow commit
     */
    updateCommit: async (
        id: number,
        data: UpdateWorkflowCommitRequest,
    ): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.put<unknown>(
            `/v1/ci-cd/workflows/commits/${id}`,
            data,
        );
        return workflowCommitResponseSchema.parse(response);
    },

    /**
     * Delete a workflow commit
     */
    deleteCommit: (id: number) =>
        apiClient.delete(`/v1/ci-cd/workflows/commits/${id}`),

    // Jobs

    /**
     * Get all jobs for a specific workflow run
     */
    getJobs: async (workflowRunId: number): Promise<WorkflowJob[]> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/${workflowRunId}/jobs`,
        );
        const schema = z.object({ data: z.array(workflowJobSchema) });
        if (schema.safeParse(response).success) {
            return schema.parse(response).data;
        }
        return z.array(workflowJobSchema).parse(response);
    },
};

const BASE = "/v1/ci-cd";

const paginatedCiServerSchema = z.object({
    data: z.array(ciServerSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});
const ciServerResponseSchema = z.object({ data: ciServerSchema });

const paginatedCiReleaseSchema = z.object({
    data: z.array(ciReleaseSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});
const ciReleaseResponseSchema = z.object({ data: ciReleaseSchema });

const paginatedCiDeploymentSchema = z.object({
    data: z.array(ciDeploymentSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});
const ciDeploymentResponseSchema = z.object({ data: ciDeploymentSchema });

/**
 * CI Servers API — manage CI server connections (Jenkins, GitHub Actions, etc.)
 */
export const ciServersApi = {
    /**
     * Get paginated list of CI servers
     */
    getAll: async (page = 1): Promise<PaginatedResponse<CiServer>> => {
        const response = await apiClient.get<unknown>(
            `${BASE}/servers${apiClient.buildQuery({ page })}`,
        );
        return paginatedCiServerSchema.parse(response);
    },

    /**
     * Get a single CI server by ID
     */
    getById: async (id: number): Promise<{ data: CiServer }> => {
        const response = await apiClient.get<unknown>(`${BASE}/servers/${id}`);
        return ciServerResponseSchema.parse(response);
    },

    /**
     * Create a new CI server
     */
    create: async (data: CreateCiServerRequest): Promise<{ data: CiServer }> => {
        const response = await apiClient.post<unknown>(`${BASE}/servers`, data);
        return ciServerResponseSchema.parse(response);
    },

    /**
     * Update an existing CI server
     */
    update: async (id: number, data: UpdateCiServerRequest): Promise<{ data: CiServer }> => {
        const response = await apiClient.put<unknown>(`${BASE}/servers/${id}`, data);
        return ciServerResponseSchema.parse(response);
    },

    /**
     * Delete a CI server
     */
    delete: (id: number) => apiClient.delete(`${BASE}/servers/${id}`),
};

/**
 * CI/CD Releases API — manage software releases
 */
export const releasesApi = {
    /**
     * Get paginated list of releases
     */
    getAll: async (page = 1): Promise<PaginatedResponse<CiRelease>> => {
        const response = await apiClient.get<unknown>(
            `${BASE}/releases${apiClient.buildQuery({ page })}`,
        );
        return paginatedCiReleaseSchema.parse(response);
    },

    /**
     * Get a single release by ID
     */
    getById: async (id: number): Promise<{ data: CiRelease }> => {
        const response = await apiClient.get<unknown>(`${BASE}/releases/${id}`);
        return ciReleaseResponseSchema.parse(response);
    },

    /**
     * Create a new release
     */
    create: async (data: CreateCiReleaseRequest): Promise<{ data: CiRelease }> => {
        const response = await apiClient.post<unknown>(`${BASE}/releases`, data);
        return ciReleaseResponseSchema.parse(response);
    },

    /**
     * Update an existing release
     */
    update: async (id: number, data: UpdateCiReleaseRequest): Promise<{ data: CiRelease }> => {
        const response = await apiClient.put<unknown>(`${BASE}/releases/${id}`, data);
        return ciReleaseResponseSchema.parse(response);
    },

    /**
     * Delete a release
     */
    delete: (id: number) => apiClient.delete(`${BASE}/releases/${id}`),
};

/**
 * CI/CD Deployments API — read and update deployment statuses
 * Note: deployments are created via webhooks, not via the frontend
 */
export const deploymentsApi = {
    /**
     * Get paginated list of deployments
     */
    getAll: async (page = 1): Promise<PaginatedResponse<CiDeployment>> => {
        const response = await apiClient.get<unknown>(
            `${BASE}/deployments${apiClient.buildQuery({ page })}`,
        );
        return paginatedCiDeploymentSchema.parse(response);
    },

    /**
     * Get a single deployment by ID
     */
    getById: async (id: number): Promise<{ data: CiDeployment }> => {
        const response = await apiClient.get<unknown>(`${BASE}/deployments/${id}`);
        return ciDeploymentResponseSchema.parse(response);
    },

    /**
     * Update deployment status
     */
    update: async (id: number, data: UpdateCiDeploymentRequest): Promise<{ data: CiDeployment }> => {
        const response = await apiClient.put<unknown>(`${BASE}/deployments/${id}`, data);
        return ciDeploymentResponseSchema.parse(response);
    },
};

/**
 * Consolidated CI/CD API object
 */
export const ciCdApi = {
    servers: ciServersApi,
    workflows: workflowsApi,
    releases: releasesApi,
    deployments: deploymentsApi,
};
