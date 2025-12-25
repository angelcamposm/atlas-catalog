/**
 * API endpoints for managing Groups and related resources
 * Includes: Groups, Group Types, Group Member Roles
 */

import { apiClient } from "../api-client";
import {
    groupResponseSchema,
    paginatedGroupResponseSchema,
    groupTypeResponseSchema,
    paginatedGroupTypeResponseSchema,
    groupMemberRoleResponseSchema,
    paginatedGroupMemberRoleResponseSchema,
} from "@/types/api";
import type {
    GroupResponse,
    PaginatedGroupResponse,
    CreateGroupRequest,
    UpdateGroupRequest,
    GroupTypeResponse,
    PaginatedGroupTypeResponse,
    CreateGroupTypeRequest,
    UpdateGroupTypeRequest,
    GroupMemberRoleResponse,
    PaginatedGroupMemberRoleResponse,
    CreateGroupMemberRoleRequest,
    UpdateGroupMemberRoleRequest,
} from "@/types/api";

// Groups -------------------------------------------------------------------

export const groupsApi = {
    /**
     * Get all groups with pagination
     */
    getAll: async (page = 1): Promise<PaginatedGroupResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups${apiClient.buildQuery({ page })}`
        );
        return paginatedGroupResponseSchema.parse(response);
    },

    /**
     * Get a single group by ID
     */
    getById: async (id: number): Promise<GroupResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/${id}`
        );
        return groupResponseSchema.parse(response);
    },

    /**
     * Create a new group
     */
    create: async (data: CreateGroupRequest): Promise<GroupResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/organization/groups",
            data
        );
        return groupResponseSchema.parse(response);
    },

    /**
     * Update an existing group
     */
    update: async (
        id: number,
        data: UpdateGroupRequest
    ): Promise<GroupResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/organization/groups/${id}`,
            data
        );
        return groupResponseSchema.parse(response);
    },

    /**
     * Delete a group
     */
    delete: (id: number) => apiClient.delete(`/v1/organization/groups/${id}`),

    /**
     * Get members of a group
     */
    getMembers: async (id: number) => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/${id}/members`
        );
        // Support either { data: [...] } or direct array response
        // Return as an array of users
        return (response as any).data
            ? (response as any).data
            : (response as any);
    },
};

// Group Types --------------------------------------------------------------

export const groupTypesApi = {
    /**
     * Get all group types with pagination
     */
    getAll: async (page = 1): Promise<PaginatedGroupTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/types${apiClient.buildQuery({ page })}`
        );
        return paginatedGroupTypeResponseSchema.parse(response);
    },

    /**
     * Get a single group type by ID
     */
    getById: async (id: number): Promise<GroupTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/types/${id}`
        );
        return groupTypeResponseSchema.parse(response);
    },

    /**
     * Create a new group type
     */
    create: async (
        data: CreateGroupTypeRequest
    ): Promise<GroupTypeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/organization/groups/types",
            data
        );
        return groupTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing group type
     */
    update: async (
        id: number,
        data: UpdateGroupTypeRequest
    ): Promise<GroupTypeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/organization/groups/types/${id}`,
            data
        );
        return groupTypeResponseSchema.parse(response);
    },

    /**
     * Delete a group type
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/organization/groups/types/${id}`),
};

// Group Member Roles -------------------------------------------------------

export const groupMemberRolesApi = {
    /**
     * Get all group member roles with pagination
     */
    getAll: async (page = 1): Promise<PaginatedGroupMemberRoleResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/member-roles${apiClient.buildQuery({
                page,
            })}`
        );
        return paginatedGroupMemberRoleResponseSchema.parse(response);
    },

    /**
     * Get a single group member role by ID
     */
    getById: async (id: number): Promise<GroupMemberRoleResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/groups/member-roles/${id}`
        );
        return groupMemberRoleResponseSchema.parse(response);
    },

    /**
     * Create a new group member role
     */
    create: async (
        data: CreateGroupMemberRoleRequest
    ): Promise<GroupMemberRoleResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/organization/groups/member-roles",
            data
        );
        return groupMemberRoleResponseSchema.parse(response);
    },

    /**
     * Update an existing group member role
     */
    update: async (
        id: number,
        data: UpdateGroupMemberRoleRequest
    ): Promise<GroupMemberRoleResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/organization/groups/member-roles/${id}`,
            data
        );
        return groupMemberRoleResponseSchema.parse(response);
    },

    /**
     * Delete a group member role
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/organization/groups/member-roles/${id}`),
};

// Consolidated Groups API --------------------------------------------------

export const groupsApiComplete = {
    groups: groupsApi,
    types: groupTypesApi,
    memberRoles: groupMemberRolesApi,
};
