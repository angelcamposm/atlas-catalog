/**
 * API Type Definitions for Atlas Catalog
 *
 * These types correspond to the Laravel API Resources
 */

import { z } from "zod";

// Common schemas -----------------------------------------------------------

const nullableString = () => z.string().trim().optional().nullable();
const nullableNumber = () => z.number().int().optional().nullable();

export const timestampsSchema = z.object({
    created_at: z.string(),
    updated_at: z.string(),
});
export type Timestamps = z.infer<typeof timestampsSchema>;

export const userReferenceSchema = z.object({
    created_by: z.number().int(),
    updated_by: z.number().int(),
});
export type UserReference = z.infer<typeof userReferenceSchema>;

// Models -------------------------------------------------------------------

export const apiSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        access_policy_id: nullableNumber(),
        authentication_method_id: nullableNumber(),
        protocol: nullableString(),
        document_specification: z
            .union([z.string(), z.record(z.string(), z.unknown())])
            .optional()
            .nullable(),
        status_id: nullableNumber(),
        type_id: nullableNumber(),
        url: nullableString(),
        version: nullableString(),
        api_type_id: nullableNumber(),
        lifecycle_id: nullableNumber(),
        api_status_id: nullableNumber(),
        programming_language_id: nullableNumber(),
        business_domain_category: nullableString(),
        discovery_source: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Api = z.infer<typeof apiSchema>;

export const apiTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ApiType = z.infer<typeof apiTypeSchema>;

export const apiStatusSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ApiStatus = z.infer<typeof apiStatusSchema>;

export const lifecycleSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        approval_required: z.boolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Lifecycle = z.infer<typeof lifecycleSchema>;

export const programmingLanguageSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ProgrammingLanguage = z.infer<typeof programmingLanguageSchema>;

// Pagination ---------------------------------------------------------------

export const paginationMetaSchema = z.object({
    current_page: z.number().int(),
    from: z.number().int().nullable(),
    last_page: z.number().int(),
    path: z.string(),
    per_page: z.number().int(),
    to: z.number().int().nullable(),
    total: z.number().int(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const paginationLinksSchema = z.object({
    first: z.string(),
    last: z.string(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
});
export type PaginationLinks = z.infer<typeof paginationLinksSchema>;

export const createResourceResponseSchema = <T extends z.ZodTypeAny>(
    schema: T
) =>
    z.object({
        data: schema,
    });

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
    schema: T
) =>
    z.object({
        data: z.array(schema),
        links: paginationLinksSchema,
        meta: paginationMetaSchema,
    });

export const apiResponseSchema = createResourceResponseSchema(apiSchema);
export type ApiResponse = z.infer<typeof apiResponseSchema>;

export const paginatedApiResponseSchema =
    createPaginatedResponseSchema(apiSchema);
export type PaginatedApiResponse = z.infer<typeof paginatedApiResponseSchema>;

export const apiTypeResponseSchema =
    createResourceResponseSchema(apiTypeSchema);
export type ApiTypeResponse = z.infer<typeof apiTypeResponseSchema>;

export const paginatedApiTypeResponseSchema =
    createPaginatedResponseSchema(apiTypeSchema);
export type PaginatedApiTypeResponse = z.infer<
    typeof paginatedApiTypeResponseSchema
>;

export const lifecycleResponseSchema =
    createResourceResponseSchema(lifecycleSchema);
export type LifecycleResponse = z.infer<typeof lifecycleResponseSchema>;

export const paginatedLifecycleResponseSchema =
    createPaginatedResponseSchema(lifecycleSchema);
export type PaginatedLifecycleResponse = z.infer<
    typeof paginatedLifecycleResponseSchema
>;

export const programmingLanguageResponseSchema = createResourceResponseSchema(
    programmingLanguageSchema
);
export type ProgrammingLanguageResponse = z.infer<
    typeof programmingLanguageResponseSchema
>;

export const paginatedProgrammingLanguageResponseSchema =
    createPaginatedResponseSchema(programmingLanguageSchema);
export type PaginatedProgrammingLanguageResponse = z.infer<
    typeof paginatedProgrammingLanguageResponseSchema
>;

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

// Request payloads --------------------------------------------------------

export interface CreateApiRequest {
    name: string;
    description?: string;
    api_type_id?: number;
    lifecycle_id?: number;
    api_status_id?: number;
    programming_language_id?: number;
    business_domain_category?: string;
    discovery_source?: string;
}

export type UpdateApiRequest = Partial<CreateApiRequest>;

export interface CreateApiTypeRequest {
    name: string;
    description?: string;
}

export type UpdateApiTypeRequest = Partial<CreateApiTypeRequest>;

export interface CreateLifecycleRequest {
    name: string;
    description?: string;
    approval_required: boolean;
}

export type UpdateLifecycleRequest = Partial<CreateLifecycleRequest>;

export interface CreateProgrammingLanguageRequest {
    name: string;
    description?: string;
}

export type UpdateProgrammingLanguageRequest =
    Partial<CreateProgrammingLanguageRequest>;
