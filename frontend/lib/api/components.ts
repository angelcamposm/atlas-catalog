/**
 * Components API Module
 *
 * This module handles API calls for the Components section.
 * Components represent software services, applications, or microservices
 * in the catalog.
 */

import { apiClient } from "../api-client";
import { buildQueryString } from "./_shared";
import type { Component, ComponentType, PaginatedResponse } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ComponentsQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    type_id?: number;
    lifecycle_id?: number;
    domain_id?: number;
    owner_id?: number;
    platform_id?: number;
    tier_id?: number;
    status_id?: number;
    operational_status_id?: number;
    criticality_id?: number;
    is_stateless?: boolean;
    has_zero_downtime_deployments?: boolean;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

export interface CreateComponentData {
    name: string;
    display_name?: string;
    slug: string;
    description?: string;
    type_id?: number;
    lifecycle_id?: number;
    domain_id?: number;
    owner_id?: number;
    platform_id?: number;
    tier_id?: number;
    status_id?: number;
    operational_status_id?: number;
    criticality_id?: number;
    is_stateless?: boolean;
    has_zero_downtime_deployments?: boolean;
    tags?: Record<string, unknown>;
}

export interface UpdateComponentData extends Partial<CreateComponentData> {}

export interface ComponentWithRelations extends Component {
    type?: ComponentType | null;
    lifecycle?: { id: number; name: string } | null;
    domain?: { id: number; name: string } | null;
    owner?: { id: number; name: string } | null;
    platform?: { id: number; name: string } | null;
    tier?: { id: number; name: string } | null;
    status?: { id: number; name: string } | null;
    operational_status?: { id: number; name: string } | null;
    criticality?: { id: number; name: string } | null;
    apis?: { id: number; name: string; relationship?: string }[];
}

/**
 * Resource associated with a component (documentation, links, etc.)
 */
export interface ComponentResource {
    id: number;
    name: string;
    type: string;
    url?: string;
    description?: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Release version for a component
 */
export interface ComponentRelease {
    id: number;
    version: string;
    release_date: string;
    description?: string;
    changelog?: string;
    is_latest?: boolean;
    environment?: string;
    status?: "deployed" | "rollback" | "pending" | "failed";
    created_at?: string;
}

/**
 * Audit log entry for a component
 */
export interface ComponentAuditEntry {
    id: number;
    action: string;
    actor: string;
    timestamp: string;
    details?: Record<string, unknown>;
    field?: string;
    old_value?: string;
    new_value?: string;
}

/**
 * Dependency of a component
 */
export interface ComponentDependency {
    id: number;
    name: string;
    type: "provides" | "consumes" | "imports" | "required_by";
    component_id?: number;
    api_id?: number;
    description?: string;
}

// ============================================================================
// API Client
// ============================================================================

export const componentsApi = {
    /**
     * Get all components with optional filters and pagination
     */
    async getAll(
        params: ComponentsQueryParams = {},
    ): Promise<PaginatedResponse<Component>> {
        const qs = buildQueryString(params);
        return apiClient.get<PaginatedResponse<Component>>(
            `/v1/catalog/components${qs}`,
        );
    },

    /**
     * Get a single component by ID
     * @param id Component ID
     * @param withRelations Optional array of relations to include (e.g., ['domain', 'platform', 'owner'])
     */
    async getById(
        id: number,
        withRelations?: string[],
    ): Promise<{ data: ComponentWithRelations }> {
        const qs = withRelations?.length
            ? buildQueryString({ with: withRelations })
            : "";
        return apiClient.get<{ data: ComponentWithRelations }>(
            `/v1/catalog/components/${id}${qs}`,
        );
    },

    /**
     * Get a single component by slug
     * The backend uses slug-based route model binding
     * @param slug Component slug
     * @param withRelations Optional array of relations to include (e.g., ['domain', 'platform', 'owner'])
     */
    async getBySlug(
        slug: string,
        withRelations?: string[],
    ): Promise<{ data: ComponentWithRelations }> {
        const qs = withRelations?.length
            ? buildQueryString({ with: withRelations })
            : "";
        return apiClient.get<{ data: ComponentWithRelations }>(
            `/v1/catalog/components/${slug}${qs}`,
        );
    },

    /**
     * Create a new component
     */
    async create(data: CreateComponentData): Promise<{ data: Component }> {
        return apiClient.post<{ data: Component }>(
            "/v1/catalog/components",
            data,
        );
    },

    /**
     * Update an existing component
     */
    async update(
        id: number,
        data: UpdateComponentData,
    ): Promise<{ data: Component }> {
        return apiClient.put<{ data: Component }>(
            `/v1/catalog/components/${id}`,
            data,
        );
    },

    /**
     * Delete a component
     */
    async delete(id: number): Promise<void> {
        return apiClient.delete(`/v1/catalog/components/${id}`);
    },

    /**
     * Get APIs related to a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/apis not implemented yet
     */
    async getApis(
        componentId: number,
    ): Promise<{ data: { id: number; name: string; relationship: string }[] }> {
        // TODO: Backend endpoint /v1/catalog/components/{id}/apis not implemented yet
        void componentId;
        return Promise.resolve({ data: [] });
    },

    /**
     * Associate an API with a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/apis not implemented yet
     */
    async addApi(
        componentId: number,
        apiId: number,
        relationship: string = "uses",
    ): Promise<void> {
        // TODO: Backend endpoint not implemented yet
        void componentId;
        void apiId;
        void relationship;
        return Promise.resolve();
    },

    /**
     * Remove an API association from a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/apis/{apiId} not implemented yet
     */
    async removeApi(componentId: number, apiId: number): Promise<void> {
        // TODO: Backend endpoint not implemented yet
        void componentId;
        void apiId;
        return Promise.resolve();
    },

    /**
     * Get resources related to a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/resources not implemented yet
     */
    async getResources(
        componentId: number,
    ): Promise<{ data: ComponentResource[] }> {
        // TODO: Backend endpoint not implemented
        void componentId;
        return Promise.resolve({ data: [] });
    },

    /**
     * Get releases for a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/releases not implemented yet
     */
    async getReleases(
        componentId: number,
    ): Promise<{ data: ComponentRelease[] }> {
        // TODO: Backend endpoint not implemented
        void componentId;
        return Promise.resolve({ data: [] });
    },

    /**
     * Get audit log for a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/audit not implemented yet
     */
    async getAuditLog(
        componentId: number,
    ): Promise<{ data: ComponentAuditEntry[] }> {
        // TODO: Backend endpoint not implemented
        void componentId;
        return Promise.resolve({ data: [] });
    },

    /**
     * Get dependencies for a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/dependencies not implemented yet
     */
    async getDependencies(
        componentId: number,
    ): Promise<{ data: ComponentDependency[] }> {
        // TODO: Backend endpoint not implemented
        void componentId;
        return Promise.resolve({ data: [] });
    },
};

// ============================================================================
// Component Types API
// ============================================================================

export const componentTypesApi = {
    /**
     * Get all component types
     */
    async getAll(): Promise<PaginatedResponse<ComponentType>> {
        return apiClient.get<PaginatedResponse<ComponentType>>(
            "/v1/catalog/components/types",
        );
    },

    /**
     * Get a single component type by ID
     */
    async getById(id: number): Promise<{ data: ComponentType }> {
        return apiClient.get<{ data: ComponentType }>(
            `/v1/catalog/components/types/${id}`,
        );
    },

    /**
     * Create a new component type
     */
    async create(
        data: Partial<ComponentType>,
    ): Promise<{ data: ComponentType }> {
        return apiClient.post<{ data: ComponentType }>(
            "/v1/catalog/components/types",
            data,
        );
    },

    /**
     * Update an existing component type
     */
    async update(
        id: number,
        data: Partial<ComponentType>,
    ): Promise<{ data: ComponentType }> {
        return apiClient.put<{ data: ComponentType }>(
            `/v1/catalog/components/types/${id}`,
            data,
        );
    },

    /**
     * Delete a component type
     */
    async delete(id: number): Promise<void> {
        return apiClient.delete(`/v1/catalog/components/types/${id}`);
    },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get display name for a component (falls back to name if display_name is empty)
 */
export function getComponentDisplayName(component: Component): string {
    return component.display_name || component.name;
}

/**
 * Get badge color based on operational status
 */
export function getOperationalStatusColor(
    statusId: number | null | undefined,
): string {
    if (!statusId)
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    // Common operational status mappings
    const statusColors: Record<number, string> = {
        1: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", // Active/Running
        2: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", // Maintenance
        3: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", // Down/Error
        4: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", // Deploying
        5: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", // Inactive
    };

    return statusColors[statusId] || statusColors[5];
}

/**
 * Get badge color based on criticality
 */
export function getCriticalityColor(
    criticalityId: number | null | undefined,
): string {
    if (!criticalityId)
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    const criticalityColors: Record<number, string> = {
        1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", // Critical
        2: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", // High
        3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", // Medium
        4: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", // Low
    };

    return criticalityColors[criticalityId] || criticalityColors[4];
}

/**
 * Get tier label
 */
export function getTierLabel(tierId: number | null | undefined): string {
    if (!tierId) return "Sin tier";

    const tierLabels: Record<number, string> = {
        1: "Tier 1 (Crítico)",
        2: "Tier 2 (Alto)",
        3: "Tier 3 (Medio)",
        4: "Tier 4 (Bajo)",
    };

    return tierLabels[tierId] || `Tier ${tierId}`;
}

export default componentsApi;
