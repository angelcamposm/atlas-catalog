/**
 * API endpoints for managing Infrastructure resources
 * Includes: Clusters, Cluster Types, Nodes, and Cluster Service Accounts
 */

import { apiClient } from "../api-client";
import {
    clusterTypeResponseSchema,
    paginatedClusterTypeResponseSchema,
    clusterResponseSchema,
    paginatedClusterResponseSchema,
    nodeResponseSchema,
    paginatedNodeResponseSchema,
    clusterServiceAccountResponseSchema,
    paginatedClusterServiceAccountResponseSchema,
} from "@/types/api";
import type {
    ClusterTypeResponse,
    PaginatedClusterTypeResponse,
    CreateClusterTypeRequest,
    UpdateClusterTypeRequest,
    ClusterResponse,
    PaginatedClusterResponse,
    CreateClusterRequest,
    UpdateClusterRequest,
    NodeResponse,
    PaginatedNodeResponse,
    CreateNodeRequest,
    UpdateNodeRequest,
    ClusterServiceAccountResponse,
    PaginatedClusterServiceAccountResponse,
    CreateClusterServiceAccountRequest,
    UpdateClusterServiceAccountRequest,
} from "@/types/api";

// Cluster Types ------------------------------------------------------------

export const clusterTypesApi = {
    /**
     * Get all cluster types with pagination
     */
    getAll: async (page = 1): Promise<PaginatedClusterTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters/types${apiClient.buildQuery({ page })}`
        );
        return paginatedClusterTypeResponseSchema.parse(response);
    },

    /**
     * Get a single cluster type by ID
     */
    getById: async (id: number): Promise<ClusterTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters/types/${id}`
        );
        return clusterTypeResponseSchema.parse(response);
    },

    /**
     * Create a new cluster type
     */
    create: async (
        data: CreateClusterTypeRequest
    ): Promise<ClusterTypeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/infrastructure/clusters/types",
            data
        );
        return clusterTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing cluster type
     */
    update: async (
        id: number,
        data: UpdateClusterTypeRequest
    ): Promise<ClusterTypeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/infrastructure/clusters/types/${id}`,
            data
        );
        return clusterTypeResponseSchema.parse(response);
    },

    /**
     * Delete a cluster type
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/infrastructure/clusters/types/${id}`),
};

// Clusters -----------------------------------------------------------------

export const clustersApi = {
    /**
     * Get all clusters with pagination
     */
    getAll: async (page = 1): Promise<PaginatedClusterResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters${apiClient.buildQuery({ page })}`
        );
        return paginatedClusterResponseSchema.parse(response);
    },

    /**
     * Get a single cluster by ID
     */
    getById: async (id: number): Promise<ClusterResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters/${id}`
        );
        return clusterResponseSchema.parse(response);
    },

    /**
     * Create a new cluster
     */
    create: async (data: CreateClusterRequest): Promise<ClusterResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/infrastructure/clusters",
            data
        );
        return clusterResponseSchema.parse(response);
    },

    /**
     * Update an existing cluster
     */
    update: async (
        id: number,
        data: UpdateClusterRequest
    ): Promise<ClusterResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/infrastructure/clusters/${id}`,
            data
        );
        return clusterResponseSchema.parse(response);
    },

    /**
     * Delete a cluster
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/infrastructure/clusters/${id}`),

    /**
     * Get nodes for a specific cluster
     */
    getNodes: async (
        clusterId: number,
        page = 1
    ): Promise<PaginatedNodeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters/${clusterId}/nodes${apiClient.buildQuery(
                { page }
            )}`
        );
        return paginatedNodeResponseSchema.parse(response);
    },

    /**
     * Get service accounts for a specific cluster
     */
    getServiceAccounts: async (
        clusterId: number,
        page = 1
    ): Promise<PaginatedClusterServiceAccountResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/clusters/${clusterId}/service-accounts${apiClient.buildQuery(
                { page }
            )}`
        );
        return paginatedClusterServiceAccountResponseSchema.parse(response);
    },
};

// Nodes --------------------------------------------------------------------

export const nodesApi = {
    /**
     * Get all nodes with pagination
     */
    getAll: async (page = 1): Promise<PaginatedNodeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/nodes${apiClient.buildQuery({ page })}`
        );
        return paginatedNodeResponseSchema.parse(response);
    },

    /**
     * Get a single node by ID
     */
    getById: async (id: number): Promise<NodeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure/nodes/${id}`
        );
        return nodeResponseSchema.parse(response);
    },

    /**
     * Create a new node
     */
    create: async (data: CreateNodeRequest): Promise<NodeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/infrastructure/nodes",
            data
        );
        return nodeResponseSchema.parse(response);
    },

    /**
     * Update an existing node
     */
    update: async (
        id: number,
        data: UpdateNodeRequest
    ): Promise<NodeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/infrastructure/nodes/${id}`,
            data
        );
        return nodeResponseSchema.parse(response);
    },

    /**
     * Delete a node
     */
    delete: (id: number) => apiClient.delete(`/v1/infrastructure/nodes/${id}`),
};

// Cluster Service Accounts -------------------------------------------------
// TODO: Backend has /v1/security/service-accounts.
// These calls will fail until the endpoint is implemented.

export const clusterServiceAccountsApi = {
    /**
     * Get all cluster service accounts with pagination
     * @deprecated Backend endpoint not yet implemented
     */
    getAll: async (
        page = 1
    ): Promise<PaginatedClusterServiceAccountResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/security/service-accounts${apiClient.buildQuery({ page })}`
        );
        return paginatedClusterServiceAccountResponseSchema.parse(response);
    },

    /**
     * Get a single cluster service account by ID
     */
    getById: async (id: number): Promise<ClusterServiceAccountResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/security/service-accounts/${id}`
        );
        return clusterServiceAccountResponseSchema.parse(response);
    },

    /**
     * Create a new cluster service account
     */
    create: async (
        data: CreateClusterServiceAccountRequest
    ): Promise<ClusterServiceAccountResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/security/service-accounts",
            data
        );
        return clusterServiceAccountResponseSchema.parse(response);
    },

    /**
     * Update an existing cluster service account
     */
    update: async (
        id: number,
        data: UpdateClusterServiceAccountRequest
    ): Promise<ClusterServiceAccountResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/security/service-accounts/${id}`,
            data
        );
        return clusterServiceAccountResponseSchema.parse(response);
    },

    /**
     * Delete a cluster service account
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/security/service-accounts/${id}`),
};

// Consolidated Infrastructure API ------------------------------------------

export const infrastructureApi = {
    clusterTypes: clusterTypesApi,
    clusters: clustersApi,
    nodes: nodesApi,
    clusterServiceAccounts: clusterServiceAccountsApi,
};
