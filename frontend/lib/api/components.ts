/**
 * Components API Module
 *
 * This module handles API calls for the Components section.
 * Components represent software services, applications, or microservices
 * in the catalog.
 */

import { apiClient } from "../api-client";
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
    has_zero_downtime_deployment?: boolean;
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
    has_zero_downtime_deployment?: boolean;
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

// ============================================================================
// API Client
// ============================================================================

export const componentsApi = {
    /**
     * Get all components with optional filters and pagination
     */
    async getAll(
        params: ComponentsQueryParams = {}
    ): Promise<PaginatedResponse<Component>> {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.set("page", params.page.toString());
        if (params.per_page)
            searchParams.set("per_page", params.per_page.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.type_id)
            searchParams.set("type_id", params.type_id.toString());
        if (params.lifecycle_id)
            searchParams.set("lifecycle_id", params.lifecycle_id.toString());
        if (params.domain_id)
            searchParams.set("domain_id", params.domain_id.toString());
        if (params.owner_id)
            searchParams.set("owner_id", params.owner_id.toString());
        if (params.platform_id)
            searchParams.set("platform_id", params.platform_id.toString());
        if (params.tier_id)
            searchParams.set("tier_id", params.tier_id.toString());
        if (params.status_id)
            searchParams.set("status_id", params.status_id.toString());
        if (params.operational_status_id)
            searchParams.set(
                "operational_status_id",
                params.operational_status_id.toString()
            );
        if (params.criticality_id)
            searchParams.set(
                "criticality_id",
                params.criticality_id.toString()
            );
        if (params.is_stateless !== undefined)
            searchParams.set("is_stateless", params.is_stateless.toString());
        if (params.has_zero_downtime_deployment !== undefined)
            searchParams.set(
                "has_zero_downtime_deployment",
                params.has_zero_downtime_deployment.toString()
            );
        if (params.sort_by) searchParams.set("sort_by", params.sort_by);
        if (params.sort_order)
            searchParams.set("sort_order", params.sort_order);

        const queryString = searchParams.toString();
        const url = queryString
            ? `/v1/catalog/components?${queryString}`
            : "/v1/catalog/components";

        return apiClient.get<PaginatedResponse<Component>>(url);
    },

    /**
     * Get a single component by ID
     */
    async getById(id: number): Promise<{ data: ComponentWithRelations }> {
        return apiClient.get<{ data: ComponentWithRelations }>(
            `/v1/catalog/components/${id}`
        );
    },

    /**
     * Get a single component by slug
     * The backend uses slug-based route model binding
     */
    async getBySlug(slug: string): Promise<{ data: ComponentWithRelations }> {
        return apiClient.get<{ data: ComponentWithRelations }>(
            `/v1/catalog/components/${slug}`
        );
    },

    /**
     * Create a new component
     */
    async create(data: CreateComponentData): Promise<{ data: Component }> {
        return apiClient.post<{ data: Component }>(
            "/v1/catalog/components",
            data
        );
    },

    /**
     * Update an existing component
     */
    async update(
        id: number,
        data: UpdateComponentData
    ): Promise<{ data: Component }> {
        return apiClient.put<{ data: Component }>(
            `/v1/catalog/components/${id}`,
            data
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
        componentId: number
    ): Promise<{ data: { id: number; name: string; relationship: string }[] }> {
        console.warn(
            "getApis: Backend endpoint not implemented, returning empty"
        );
        return Promise.resolve({ data: [] });
        // return apiClient.get(`/v1/catalog/components/${componentId}/apis`);
    },

    /**
     * Associate an API with a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/apis not implemented yet
     */
    async addApi(
        componentId: number,
        apiId: number,
        relationship: string = "uses"
    ): Promise<void> {
        console.warn("addApi: Backend endpoint not implemented");
        return Promise.resolve();
        // return apiClient.post(`/v1/catalog/components/${componentId}/apis`, {
        //     api_id: apiId,
        //     relationship,
        // });
    },

    /**
     * Remove an API association from a component
     * TODO: Backend endpoint /v1/catalog/components/{id}/apis/{apiId} not implemented yet
     */
    async removeApi(componentId: number, apiId: number): Promise<void> {
        console.warn("removeApi: Backend endpoint not implemented");
        return Promise.resolve();
        // return apiClient.delete(
        //     `/v1/catalog/components/${componentId}/apis/${apiId}`
        // );
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
            "/v1/catalog/components/types"
        );
    },

    /**
     * Get a single component type by ID
     */
    async getById(id: number): Promise<{ data: ComponentType }> {
        return apiClient.get<{ data: ComponentType }>(
            `/v1/catalog/components/types/${id}`
        );
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
    statusId: number | null | undefined
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
    criticalityId: number | null | undefined
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
