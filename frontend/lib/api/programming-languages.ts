/**
 * API endpoints for managing Programming Languages
 */

import { apiClient } from "../api-client";
import {
    programmingLanguageResponseSchema,
    paginatedProgrammingLanguageResponseSchema,
} from "@/types/api";
import type {
    ProgrammingLanguageResponse,
    PaginatedProgrammingLanguageResponse,
    CreateProgrammingLanguageRequest,
    UpdateProgrammingLanguageRequest,
} from "@/types/api";

export const programmingLanguagesApi = {
    /**
     * Get all Programming Languages with pagination
     */
    getAll: async (page = 1): Promise<PaginatedProgrammingLanguageResponse> => {
        const response = await apiClient.get<unknown>(
            `/programming-languages${apiClient.buildQuery({ page })}`
        );
        return paginatedProgrammingLanguageResponseSchema.parse(response);
    },

    /**
     * Get a single Programming Language by ID
     */
    getById: async (id: number): Promise<ProgrammingLanguageResponse> => {
        const response = await apiClient.get<unknown>(
            `/programming-languages/${id}`
        );
        return programmingLanguageResponseSchema.parse(response);
    },

    /**
     * Create a new Programming Language
     */
    create: async (
        data: CreateProgrammingLanguageRequest
    ): Promise<ProgrammingLanguageResponse> => {
        const response = await apiClient.post<unknown>(
            "/programming-languages",
            data
        );
        return programmingLanguageResponseSchema.parse(response);
    },

    /**
     * Update an existing Programming Language
     */
    update: async (
        id: number,
        data: UpdateProgrammingLanguageRequest
    ): Promise<ProgrammingLanguageResponse> => {
        const response = await apiClient.put<unknown>(
            `/programming-languages/${id}`,
            data
        );
        return programmingLanguageResponseSchema.parse(response);
    },

    /**
     * Delete a Programming Language
     */
    delete: (id: number) => apiClient.delete(`/programming-languages/${id}`),
};
