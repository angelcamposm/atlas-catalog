/**
 * API endpoints for managing Architecture domain
 */

import { apiClient } from "../api-client";
import {
    apiResponseSchema,
    paginatedApiResponseSchema,
    businessCapabilityResponseSchema,
    paginatedBusinessCapabilityResponseSchema,
    businessCapabilitySystemResponseSchema,
    paginatedBusinessCapabilitySystemResponseSchema,
    systemResponseSchema,
    paginatedSystemResponseSchema,
    paginatedComponentResponseSchema,
    entityAttributeResponseSchema,
    paginatedEntityAttributeResponseSchema,
    entityResponseSchema,
    paginatedEntityResponseSchema,
} from "@/types/api";
import type {
    PaginatedApiResponse,
    ApiResponse,
    BusinessCapabilityResponse,
    PaginatedBusinessCapabilityResponse,
    CreateBusinessCapabilityRequest,
    UpdateBusinessCapabilityRequest,
    CreateEntityRequest,
    UpdateEntityRequest,
    CreateSystemRequest,
    UpdateSystemRequest,
    SystemResponse,
    PaginatedSystemResponse,
    PaginatedComponentResponse,
    BusinessCapabilitySystemResponse,
    PaginatedBusinessCapabilitySystemResponse,
    CreateBusinessCapabilitySystemRequest,
    UpdateBusinessCapabilitySystemRequest,
    EntityAttributeResponse,
    PaginatedEntityAttributeResponse,
    CreateEntityAttributeRequest,
    UpdateEntityAttributeRequest,
    EntityResponse,
    PaginatedEntityResponse,
} from "@/types/api";

export const businessCapabilitiesApi = {
    /**
     * Get all Business Capabilities with pagination
     */
    getAll: async (page = 1): Promise<PaginatedBusinessCapabilityResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capabilities${apiClient.buildQuery({
                page,
            })}`,
        );
        return paginatedBusinessCapabilityResponseSchema.parse(response);
    },

    /**
     * Get a single Business Capability by ID
     */
    getById: async (id: number): Promise<BusinessCapabilityResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capabilities/${id}`,
        );
        return businessCapabilityResponseSchema.parse(response);
    },

    /**
     * Create a new Business Capability
     */
    create: async (
        data: CreateBusinessCapabilityRequest,
    ): Promise<BusinessCapabilityResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/business-capabilities",
            data,
        );
        return businessCapabilityResponseSchema.parse(response);
    },

    /**
     * Update an existing Business Capability
     */
    update: async (
        id: number,
        data: UpdateBusinessCapabilityRequest,
    ): Promise<BusinessCapabilityResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/business-capabilities/${id}`,
            data,
        );
        return businessCapabilityResponseSchema.parse(response);
    },

    /**
     * Delete a Business Capability
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/business-capabilities/${id}`);
    },

    /**
     * Get all Systems associated with a Business Capability
     */
    getCapabilitySystems: async (
        capabilityId: number,
    ): Promise<PaginatedBusinessCapabilitySystemResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capabilities/${capabilityId}/systems`,
        );
        return paginatedBusinessCapabilitySystemResponseSchema.parse(response);
    },
};

export const businessCapabilitySystemsApi = {
    /**
     * Get all Business Capability System relationships with pagination
     */
    getAll: async (
        page = 1,
    ): Promise<PaginatedBusinessCapabilitySystemResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capability-systems${apiClient.buildQuery({ page })}`,
        );
        return paginatedBusinessCapabilitySystemResponseSchema.parse(response);
    },

    /**
     * Get a single Business Capability System by ID
     */
    getById: async (id: number): Promise<BusinessCapabilitySystemResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capability-systems/${id}`,
        );
        return businessCapabilitySystemResponseSchema.parse(response);
    },

    /**
     * Create a new Business Capability System relationship
     */
    create: async (
        data: CreateBusinessCapabilitySystemRequest,
    ): Promise<BusinessCapabilitySystemResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/business-capability-systems",
            data,
        );
        return businessCapabilitySystemResponseSchema.parse(response);
    },

    /**
     * Update an existing Business Capability System relationship
     */
    update: async (
        id: number,
        data: UpdateBusinessCapabilitySystemRequest,
    ): Promise<BusinessCapabilitySystemResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/business-capability-systems/${id}`,
            data,
        );
        return businessCapabilitySystemResponseSchema.parse(response);
    },

    /**
     * Delete a Business Capability System relationship
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(
            `/v1/architecture/business-capability-systems/${id}`,
        );
    },
};

export const entitiesApi = {
    /**
     * Get all Entities with pagination
     */
    getAll: async (page = 1): Promise<PaginatedEntityResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities${apiClient.buildQuery({ page })}`,
        );
        return paginatedEntityResponseSchema.parse(response);
    },

    /**
     * Get a single Entity by ID
     */
    getById: async (id: number): Promise<EntityResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities/${id}`,
        );
        return entityResponseSchema.parse(response);
    },

    /**
     * Create a new Entity
     */
    create: async (data: CreateEntityRequest): Promise<EntityResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/entities",
            data,
        );
        return entityResponseSchema.parse(response);
    },

    /**
     * Update an existing Entity
     */
    update: async (
        id: number,
        data: UpdateEntityRequest,
    ): Promise<EntityResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/entities/${id}`,
            data,
        );
        return entityResponseSchema.parse(response);
    },

    /**
     * Delete an Entity
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/entities/${id}`);
    },

    /**
     * Get all Components associated with an Entity
     */
    getEntityComponents: async (
        entityId: number,
    ): Promise<PaginatedComponentResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities/${entityId}/components`,
        );
        return paginatedComponentResponseSchema.parse(response);
    },
};

export const entityAttributesApi = {
    /**
     * Get all Attributes of an Entity with pagination
     */
    getAll: async (
        entityId: number,
        page = 1,
    ): Promise<PaginatedEntityAttributeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities/${entityId}/attributes${apiClient.buildQuery({ page })}`,
        );
        return paginatedEntityAttributeResponseSchema.parse(response);
    },

    /**
     * Get a single Entity Attribute by ID
     */
    getById: async (id: number): Promise<EntityAttributeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entity-attributes/${id}`,
        );
        return entityAttributeResponseSchema.parse(response);
    },

    /**
     * Create a new Entity Attribute
     */
    create: async (
        entityId: number,
        data: CreateEntityAttributeRequest,
    ): Promise<EntityAttributeResponse> => {
        const response = await apiClient.post<unknown>(
            `/v1/architecture/entities/${entityId}/attributes`,
            data,
        );
        return entityAttributeResponseSchema.parse(response);
    },

    /**
     * Update an existing Entity Attribute
     */
    update: async (
        id: number,
        data: UpdateEntityAttributeRequest,
    ): Promise<EntityAttributeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/entity-attributes/${id}`,
            data,
        );
        return entityAttributeResponseSchema.parse(response);
    },

    /**
     * Delete an Entity Attribute
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/entity-attributes/${id}`);
    },
};

export const systemsApi = {
    /**
     * Get all Systems with pagination
     */
    getAll: async (page = 1): Promise<PaginatedSystemResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/systems${apiClient.buildQuery({ page })}`,
        );
        return paginatedSystemResponseSchema.parse(response);
    },

    /**
     * Get a single System by ID
     */
    getById: async (id: number): Promise<SystemResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/systems/${id}`,
        );
        return systemResponseSchema.parse(response);
    },

    /**
     * Create a new System
     */
    create: async (data: CreateSystemRequest): Promise<SystemResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/systems",
            data,
        );
        return systemResponseSchema.parse(response);
    },

    /**
     * Update an existing System
     */
    update: async (
        id: number,
        data: UpdateSystemRequest,
    ): Promise<SystemResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/systems/${id}`,
            data,
        );
        return systemResponseSchema.parse(response);
    },

    /**
     * Delete a System
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/systems/${id}`);
    },

    /**
     * Get all Components associated with a System
     */
    getSystemComponents: async (
        systemId: number,
    ): Promise<PaginatedComponentResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/systems/${systemId}/components`,
        );
        return paginatedComponentResponseSchema.parse(response);
    },
};
