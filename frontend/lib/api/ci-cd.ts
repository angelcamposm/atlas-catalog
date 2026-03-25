/**
 * API endpoints for CI/CD Workflow management
 * Includes: Workflow Runs, Workflow Commits, Workflow Jobs
 */

import { apiClient } from "../api-client";
import {
    workflowRunSchema,
    workflowCommitSchema,
    workflowJobSchema,
    paginationMetaSchema,
    paginationLinksSchema,
} from "@/types/api";
import type {
    WorkflowRun,
    WorkflowCommit,
    WorkflowJob,
    PaginatedResponse,
    CreateWorkflowRunRequest,
    UpdateWorkflowRunRequest,
    CreateWorkflowCommitRequest,
    UpdateWorkflowCommitRequest,
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
            `/v1/ci-cd/workflows/runs${apiClient.buildQuery({ page })}`
        );
        return paginatedWorkflowRunSchema.parse(response);
    },

    /**
     * Get a single workflow run by ID
     */
    getRunById: async (id: number): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/runs/${id}`
        );
        return workflowRunResponseSchema.parse(response);
    },

    /**
     * Create a new workflow run
     */
    createRun: async (
        data: CreateWorkflowRunRequest
    ): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.post<unknown>(
            "/v1/ci-cd/workflows/runs",
            data
        );
        return workflowRunResponseSchema.parse(response);
    },

    /**
     * Update an existing workflow run
     */
    updateRun: async (
        id: number,
        data: UpdateWorkflowRunRequest
    ): Promise<{ data: WorkflowRun }> => {
        const response = await apiClient.put<unknown>(
            `/v1/ci-cd/workflows/runs/${id}`,
            data
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
        page = 1
    ): Promise<PaginatedResponse<WorkflowCommit>> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/commits${apiClient.buildQuery({ page })}`
        );
        return paginatedWorkflowCommitSchema.parse(response);
    },

    /**
     * Get a single workflow commit by ID
     */
    getCommitById: async (id: number): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.get<unknown>(
            `/v1/ci-cd/workflows/commits/${id}`
        );
        return workflowCommitResponseSchema.parse(response);
    },

    /**
     * Create a new workflow commit
     */
    createCommit: async (
        data: CreateWorkflowCommitRequest
    ): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.post<unknown>(
            "/v1/ci-cd/workflows/commits",
            data
        );
        return workflowCommitResponseSchema.parse(response);
    },

    /**
     * Update an existing workflow commit
     */
    updateCommit: async (
        id: number,
        data: UpdateWorkflowCommitRequest
    ): Promise<{ data: WorkflowCommit }> => {
        const response = await apiClient.put<unknown>(
            `/v1/ci-cd/workflows/commits/${id}`,
            data
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
            `/v1/ci-cd/workflows/${workflowRunId}/jobs`
        );
        const schema = z.object({ data: z.array(workflowJobSchema) });
        if (schema.safeParse(response).success) {
            return schema.parse(response).data;
        }
        return z.array(workflowJobSchema).parse(response);
    },
};
