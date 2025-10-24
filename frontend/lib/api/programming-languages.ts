/**
 * API endpoints for managing Programming Languages
 */

import { apiClient } from '../api-client';
import type {
  ProgrammingLanguage,
  ApiResponse,
  PaginatedResponse,
  CreateProgrammingLanguageRequest,
  UpdateProgrammingLanguageRequest,
} from '@/types/api';

export const programmingLanguagesApi = {
  /**
   * Get all Programming Languages with pagination
   */
  getAll: (page = 1) =>
    apiClient.get<PaginatedResponse<ProgrammingLanguage>>(
      `/programming-languages${apiClient.buildQuery({ page })}`
    ),

  /**
   * Get a single Programming Language by ID
   */
  getById: (id: number) =>
    apiClient.get<ApiResponse<ProgrammingLanguage>>(`/programming-languages/${id}`),

  /**
   * Create a new Programming Language
   */
  create: (data: CreateProgrammingLanguageRequest) =>
    apiClient.post<ApiResponse<ProgrammingLanguage>>('/programming-languages', data),

  /**
   * Update an existing Programming Language
   */
  update: (id: number, data: UpdateProgrammingLanguageRequest) =>
    apiClient.put<ApiResponse<ProgrammingLanguage>>(`/programming-languages/${id}`, data),

  /**
   * Delete a Programming Language
   */
  delete: (id: number) =>
    apiClient.delete(`/programming-languages/${id}`),
};
