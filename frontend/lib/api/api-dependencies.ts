/**
 * API Dependencies Module
 *
 * This module handles the relationships between APIs and Components.
 * Currently, some endpoints may not exist in the backend, but the structure
 * is prepared for when they become available.
 *
 * TODO: Backend endpoints to implement:
 * - GET /v1/apis/{id}/consumers - Components that consume this API
 * - GET /v1/apis/{id}/providers - Components that provide this API
 * - GET /v1/apis/{id}/dependencies - All related components with relationship type
 * - GET /v1/components/{id}/apis - APIs related to a component
 *
 * Database Schema Reference (component_apis table):
 * - id: Primary key
 * - component_id: Foreign key to components table
 * - api_id: Foreign key to apis table
 * - relationship: String ('uses', 'provides', 'consumes', etc.)
 */

// TODO: Uncomment when backend endpoints are implemented
// import { apiClient } from "../api-client";
import { z } from "zod";
import type { Component, Api } from "@/types/api";

// ============================================================================
// Types for API Dependencies
// ============================================================================

/**
 * Relationship types between Components and APIs
 * Based on backend migration: relationship VARCHAR(50) DEFAULT 'uses'
 */
export type ApiRelationshipType =
    | "uses" // Component uses this API
    | "provides" // Component provides/exposes this API
    | "consumes" // Component consumes this API (similar to uses)
    | "implements" // Component implements this API specification
    | "depends_on" // Component depends on this API
    | "owns"; // Component owns/manages this API

/**
 * Represents a component's relationship with an API
 */
export interface ApiDependency {
    id: number;
    component_id: number;
    api_id: number;
    relationship: ApiRelationshipType;
    component?: Component;
    api?: Api;
}

/**
 * Simplified component info for dependency display
 */
export interface DependencyComponent {
    id: number;
    name: string;
    display_name?: string | null;
    slug?: string;
    description?: string | null;
    lifecycle_id?: number | null;
    type_id?: number | null;
    owner_id?: number | null;
}

/**
 * Consumer/Provider info with relationship context
 */
export interface ApiRelation {
    id: number;
    component: DependencyComponent;
    relationship: ApiRelationshipType;
    created_at?: string;
    updated_at?: string;
}

/**
 * Full dependency information for an API
 */
export interface ApiDependencies {
    api_id: number;
    consumers: ApiRelation[]; // Components that consume/use this API
    providers: ApiRelation[]; // Components that provide/expose this API
    total_consumers: number;
    total_providers: number;
}

// ============================================================================
// Zod Schemas for Runtime Validation
// ============================================================================

export const apiRelationshipTypeSchema = z.enum([
    "uses",
    "provides",
    "consumes",
    "implements",
    "depends_on",
    "owns",
]);

export const dependencyComponentSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    display_name: z.string().nullable().optional(),
    slug: z.string().optional(),
    description: z.string().nullable().optional(),
    lifecycle_id: z.number().nullable().optional(),
    type_id: z.number().nullable().optional(),
    owner_id: z.number().nullable().optional(),
});

export const apiRelationSchema = z.object({
    id: z.number().int(),
    component: dependencyComponentSchema,
    relationship: apiRelationshipTypeSchema,
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const apiDependenciesSchema = z.object({
    api_id: z.number().int(),
    consumers: z.array(apiRelationSchema),
    providers: z.array(apiRelationSchema),
    total_consumers: z.number().int(),
    total_providers: z.number().int(),
});

// ============================================================================
// API Client for Dependencies
// ============================================================================

export const apiDependenciesApi = {
    /**
     * Get all dependencies for an API
     * TODO: Implement backend endpoint GET /v1/apis/{id}/dependencies
     *
     * @param apiId - The API ID to fetch dependencies for
     * @returns Promise with consumers and providers
     */
    getDependencies: async (apiId: number): Promise<ApiDependencies> => {
        try {
            // TODO: When backend implements this endpoint, use:
            // const response = await apiClient.get<unknown>(`/v1/apis/${apiId}/dependencies`);
            // return apiDependenciesSchema.parse(response);

            // For now, return empty structure
            // This allows the UI to be ready when backend implements the endpoint
            console.info(
                `[API Dependencies] Endpoint not yet implemented for API ${apiId}`
            );
            return {
                api_id: apiId,
                consumers: [],
                providers: [],
                total_consumers: 0,
                total_providers: 0,
            };
        } catch (error) {
            console.warn(
                `[API Dependencies] Failed to fetch dependencies for API ${apiId}:`,
                error
            );
            // Return empty structure on error to prevent UI crashes
            return {
                api_id: apiId,
                consumers: [],
                providers: [],
                total_consumers: 0,
                total_providers: 0,
            };
        }
    },

    /**
     * Get components that consume this API
     * TODO: Implement backend endpoint GET /v1/apis/{id}/consumers
     *
     * @param apiId - The API ID
     * @returns Promise with array of consumer relations
     */
    getConsumers: async (apiId: number): Promise<ApiRelation[]> => {
        try {
            // TODO: When backend implements this endpoint, use:
            // const response = await apiClient.get<unknown>(`/v1/apis/${apiId}/consumers`);
            // return z.array(apiRelationSchema).parse(response.data);

            console.info(
                `[API Dependencies] Consumers endpoint not yet implemented for API ${apiId}`
            );
            return [];
        } catch (error) {
            console.warn(
                `[API Dependencies] Failed to fetch consumers for API ${apiId}:`,
                error
            );
            return [];
        }
    },

    /**
     * Get components that provide this API
     * TODO: Implement backend endpoint GET /v1/apis/{id}/providers
     *
     * @param apiId - The API ID
     * @returns Promise with array of provider relations
     */
    getProviders: async (apiId: number): Promise<ApiRelation[]> => {
        try {
            // TODO: When backend implements this endpoint, use:
            // const response = await apiClient.get<unknown>(`/v1/apis/${apiId}/providers`);
            // return z.array(apiRelationSchema).parse(response.data);

            console.info(
                `[API Dependencies] Providers endpoint not yet implemented for API ${apiId}`
            );
            return [];
        } catch (error) {
            console.warn(
                `[API Dependencies] Failed to fetch providers for API ${apiId}:`,
                error
            );
            return [];
        }
    },

    /**
     * Add a component-API relationship
     * TODO: Implement backend endpoint POST /v1/apis/{id}/components
     *
     * @param apiId - The API ID
     * @param componentId - The Component ID
     * @param relationship - The type of relationship
     */
    addRelationship: async (
        apiId: number,
        componentId: number,
        relationship: ApiRelationshipType = "uses"
    ): Promise<ApiDependency | null> => {
        // Store params for future use
        void apiId;
        void componentId;
        void relationship;
        
        try {
            // TODO: When backend implements this endpoint, use:
            // const response = await apiClient.post<unknown>(`/v1/apis/${apiId}/components`, {
            //     component_id: componentId,
            //     relationship,
            // });
            // return response as ApiDependency;

            console.info(
                `[API Dependencies] Add relationship endpoint not yet implemented`
            );
            return null;
        } catch (error) {
            console.error(
                `[API Dependencies] Failed to add relationship:`,
                error
            );
            throw error;
        }
    },

    /**
     * Remove a component-API relationship
     * TODO: Implement backend endpoint DELETE /v1/apis/{id}/components/{componentId}
     *
     * @param apiId - The API ID
     * @param componentId - The Component ID
     */
    removeRelationship: async (
        apiId: number,
        componentId: number
    ): Promise<boolean> => {
        // Store params for future use
        void apiId;
        void componentId;
        
        try {
            // TODO: When backend implements this endpoint, use:
            // await apiClient.delete(`/v1/apis/${apiId}/components/${componentId}`);
            // return true;

            console.info(
                `[API Dependencies] Remove relationship endpoint not yet implemented`
            );
            return false;
        } catch (error) {
            console.error(
                `[API Dependencies] Failed to remove relationship:`,
                error
            );
            throw error;
        }
    },

    /**
     * Get APIs related to a component
     * TODO: Implement backend endpoint GET /v1/components/{id}/apis
     *
     * @param componentId - The Component ID
     * @returns Promise with array of API relations
     */
    getComponentApis: async (
        componentId: number
    ): Promise<{ api: Api; relationship: ApiRelationshipType }[]> => {
        try {
            // TODO: When backend implements this endpoint, use:
            // const response = await apiClient.get<unknown>(`/v1/components/${componentId}/apis`);
            // return response.data;

            console.info(
                `[API Dependencies] Component APIs endpoint not yet implemented for component ${componentId}`
            );
            return [];
        } catch (error) {
            console.warn(
                `[API Dependencies] Failed to fetch APIs for component ${componentId}:`,
                error
            );
            return [];
        }
    },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a human-readable label for a relationship type
 */
export function getRelationshipLabel(
    relationship: ApiRelationshipType
): string {
    const labels: Record<ApiRelationshipType, string> = {
        uses: "Usa",
        provides: "Provee",
        consumes: "Consume",
        implements: "Implementa",
        depends_on: "Depende de",
        owns: "Gestiona",
    };
    return labels[relationship] || relationship;
}

/**
 * Get a color class for a relationship type badge
 */
export function getRelationshipColor(relationship: ApiRelationshipType): string {
    const colors: Record<ApiRelationshipType, string> = {
        uses: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        provides:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        consumes:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        implements:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        depends_on:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        owns: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return (
        colors[relationship] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
}

/**
 * Get an icon name for a relationship type
 */
export function getRelationshipIcon(relationship: ApiRelationshipType): string {
    const icons: Record<ApiRelationshipType, string> = {
        uses: "HiOutlineArrowPath",
        provides: "HiOutlineArrowUpTray",
        consumes: "HiOutlineArrowDownTray",
        implements: "HiOutlineCodeBracket",
        depends_on: "HiOutlineLink",
        owns: "HiOutlineKey",
    };
    return icons[relationship] || "HiOutlineLink";
}

export default apiDependenciesApi;
