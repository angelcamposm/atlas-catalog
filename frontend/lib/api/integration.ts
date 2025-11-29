/**
 * API endpoints for managing Integration resources
 * Includes: Links and Link Types
 */

import { apiClient } from "../api-client";
import {
    linkTypeResponseSchema,
    paginatedLinkTypeResponseSchema,
    linkResponseSchema,
    paginatedLinkResponseSchema,
} from "@/types/api";
import type {
    LinkTypeResponse,
    PaginatedLinkTypeResponse,
    CreateLinkTypeRequest,
    UpdateLinkTypeRequest,
    LinkResponse,
    PaginatedLinkResponse,
    CreateLinkRequest,
    UpdateLinkRequest,
} from "@/types/api";

// Link Types ---------------------------------------------------------------

export const linkTypesApi = {
    /**
     * Get all link types (categories) with pagination
     */
    getAll: async (page = 1): Promise<PaginatedLinkTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/links/categories${apiClient.buildQuery({ page })}`
        );
        return paginatedLinkTypeResponseSchema.parse(response);
    },

    /**
     * Get a single link type (category) by ID
     */
    getById: async (id: number): Promise<LinkTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/links/categories/${id}`
        );
        return linkTypeResponseSchema.parse(response);
    },

    /**
     * Create a new link type (category)
     */
    create: async (data: CreateLinkTypeRequest): Promise<LinkTypeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/links/categories",
            data
        );
        return linkTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing link type (category)
     */
    update: async (
        id: number,
        data: UpdateLinkTypeRequest
    ): Promise<LinkTypeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/links/categories/${id}`,
            data
        );
        return linkTypeResponseSchema.parse(response);
    },

    /**
     * Delete a link type (category)
     */
    delete: (id: number) => apiClient.delete(`/v1/links/categories/${id}`),
};

// Links --------------------------------------------------------------------

export const linksApi = {
    /**
     * Get all links with pagination
     */
    getAll: async (page = 1): Promise<PaginatedLinkResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/links${apiClient.buildQuery({ page })}`
        );
        return paginatedLinkResponseSchema.parse(response);
    },

    /**
     * Get a single link by ID
     */
    getById: async (id: number): Promise<LinkResponse> => {
        const response = await apiClient.get<unknown>(`/v1/links/${id}`);
        return linkResponseSchema.parse(response);
    },

    /**
     * Create a new link
     */
    create: async (data: CreateLinkRequest): Promise<LinkResponse> => {
        const response = await apiClient.post<unknown>("/v1/links", data);
        return linkResponseSchema.parse(response);
    },

    /**
     * Update an existing link
     */
    update: async (
        id: number,
        data: UpdateLinkRequest
    ): Promise<LinkResponse> => {
        const response = await apiClient.put<unknown>(`/v1/links/${id}`, data);
        return linkResponseSchema.parse(response);
    },

    /**
     * Delete a link
     */
    delete: (id: number) => apiClient.delete(`/v1/links/${id}`),
};

// Consolidated Integration API ---------------------------------------------

export const integrationApi = {
    linkTypes: linkTypesApi,
    links: linksApi,
};
