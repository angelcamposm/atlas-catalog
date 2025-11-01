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
    created_by: z.number().int().nullable(),
    updated_by: z.number().int().nullable(),
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

// Infrastructure Domain ----------------------------------------------------

export const clusterTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        licensing_model: z.enum(["open_source", "commercial", "hybrid"]),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ClusterType = z.infer<typeof clusterTypeSchema>;

export const clusterSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        cluster_type_id: z.number().int(),
        cluster_type: clusterTypeSchema.optional(),
        version: z.string().trim().min(1),
        endpoint: z.string().url(),
        is_active: z.boolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Cluster = z.infer<typeof clusterSchema>;

export const nodeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        hostname: z.string().trim().min(1),
        ip_address: z.string().ip(),
        node_type: z.enum(["physical", "virtual", "cloud"]),
        node_role: z.enum(["master", "worker", "etcd"]),
        cpu_cores: z.number().int().positive(),
        cpu_architecture: z.enum(["x86_64", "arm64", "arm", "ppc64le"]),
        memory_bytes: z.number().int().positive(),
        storage_bytes: z.number().int().positive(),
        environment_id: z.number().int(),
        is_active: z.boolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Node = z.infer<typeof nodeSchema>;

export const clusterServiceAccountSchema = z
    .object({
        id: z.number().int(),
        cluster_id: z.number().int(),
        service_account_id: z.number().int(),
        namespace: z.string().trim().min(1),
        is_active: z.boolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ClusterServiceAccount = z.infer<typeof clusterServiceAccountSchema>;

// Platform Domain ----------------------------------------------------------

export const platformSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        vendor_id: nullableNumber(),
        version: nullableString(),
        url: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Platform = z.infer<typeof platformSchema>;

export const componentTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        icon: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ComponentType = z.infer<typeof componentTypeSchema>;

// Integration Domain -------------------------------------------------------

export const linkTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        icon: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type LinkType = z.infer<typeof linkTypeSchema>;

export const linkSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        link_type_id: z.number().int(),
        link_type: linkTypeSchema.optional(),
        source_type: z.string().trim().min(1),
        source_id: z.number().int(),
        target_type: z.string().trim().min(1),
        target_id: z.number().int(),
        protocol: z.enum(["http", "https", "grpc", "tcp", "udp", "websocket"]),
        communication_style: z.enum([
            "synchronous",
            "asynchronous",
            "event_driven",
            "batch",
        ]),
        endpoint: nullableString(),
        is_active: z.boolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Link = z.infer<typeof linkSchema>;

// Security Domain Extended -------------------------------------------------

export const serviceAccountTokenSchema = z
    .object({
        id: z.number().int(),
        service_account_id: z.number().int(),
        token: z.string().trim().min(1),
        expires_at: nullableString(),
        is_active: z.boolean(),
        last_used_at: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ServiceAccountToken = z.infer<typeof serviceAccountTokenSchema>;

// Enums --------------------------------------------------------------------

export enum NodeType {
    Physical = "physical",
    Virtual = "virtual",
    Cloud = "cloud",
}

export enum NodeRole {
    Master = "master",
    Worker = "worker",
    Etcd = "etcd",
}

export enum CpuArchitecture {
    X86_64 = "x86_64",
    ARM64 = "arm64",
    ARM = "arm",
    PPC64LE = "ppc64le",
}

export enum Protocol {
    HTTP = "http",
    HTTPS = "https",
    GRPC = "grpc",
    TCP = "tcp",
    UDP = "udp",
    WebSocket = "websocket",
}

export enum CommunicationStyle {
    Synchronous = "synchronous",
    Asynchronous = "asynchronous",
    EventDriven = "event_driven",
    Batch = "batch",
}

export enum LicensingModel {
    OpenSource = "open_source",
    Commercial = "commercial",
    Hybrid = "hybrid",
}

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

// Infrastructure response schemas ------------------------------------------

export const clusterTypeResponseSchema =
    createResourceResponseSchema(clusterTypeSchema);
export type ClusterTypeResponse = z.infer<typeof clusterTypeResponseSchema>;

export const paginatedClusterTypeResponseSchema =
    createPaginatedResponseSchema(clusterTypeSchema);
export type PaginatedClusterTypeResponse = z.infer<
    typeof paginatedClusterTypeResponseSchema
>;

export const clusterResponseSchema =
    createResourceResponseSchema(clusterSchema);
export type ClusterResponse = z.infer<typeof clusterResponseSchema>;

export const paginatedClusterResponseSchema =
    createPaginatedResponseSchema(clusterSchema);
export type PaginatedClusterResponse = z.infer<
    typeof paginatedClusterResponseSchema
>;

export const nodeResponseSchema = createResourceResponseSchema(nodeSchema);
export type NodeResponse = z.infer<typeof nodeResponseSchema>;

export const paginatedNodeResponseSchema =
    createPaginatedResponseSchema(nodeSchema);
export type PaginatedNodeResponse = z.infer<typeof paginatedNodeResponseSchema>;

export const clusterServiceAccountResponseSchema = createResourceResponseSchema(
    clusterServiceAccountSchema
);
export type ClusterServiceAccountResponse = z.infer<
    typeof clusterServiceAccountResponseSchema
>;

export const paginatedClusterServiceAccountResponseSchema =
    createPaginatedResponseSchema(clusterServiceAccountSchema);
export type PaginatedClusterServiceAccountResponse = z.infer<
    typeof paginatedClusterServiceAccountResponseSchema
>;

// Platform response schemas ------------------------------------------------

export const platformResponseSchema =
    createResourceResponseSchema(platformSchema);
export type PlatformResponse = z.infer<typeof platformResponseSchema>;

export const paginatedPlatformResponseSchema =
    createPaginatedResponseSchema(platformSchema);
export type PaginatedPlatformResponse = z.infer<
    typeof paginatedPlatformResponseSchema
>;

export const componentTypeResponseSchema =
    createResourceResponseSchema(componentTypeSchema);
export type ComponentTypeResponse = z.infer<typeof componentTypeResponseSchema>;

export const paginatedComponentTypeResponseSchema =
    createPaginatedResponseSchema(componentTypeSchema);
export type PaginatedComponentTypeResponse = z.infer<
    typeof paginatedComponentTypeResponseSchema
>;

// Integration response schemas ---------------------------------------------

export const linkTypeResponseSchema =
    createResourceResponseSchema(linkTypeSchema);
export type LinkTypeResponse = z.infer<typeof linkTypeResponseSchema>;

export const paginatedLinkTypeResponseSchema =
    createPaginatedResponseSchema(linkTypeSchema);
export type PaginatedLinkTypeResponse = z.infer<
    typeof paginatedLinkTypeResponseSchema
>;

export const linkResponseSchema = createResourceResponseSchema(linkSchema);
export type LinkResponse = z.infer<typeof linkResponseSchema>;

export const paginatedLinkResponseSchema =
    createPaginatedResponseSchema(linkSchema);
export type PaginatedLinkResponse = z.infer<typeof paginatedLinkResponseSchema>;

// Security response schemas ------------------------------------------------

export const serviceAccountTokenResponseSchema = createResourceResponseSchema(
    serviceAccountTokenSchema
);
export type ServiceAccountTokenResponse = z.infer<
    typeof serviceAccountTokenResponseSchema
>;

export const paginatedServiceAccountTokenResponseSchema =
    createPaginatedResponseSchema(serviceAccountTokenSchema);
export type PaginatedServiceAccountTokenResponse = z.infer<
    typeof paginatedServiceAccountTokenResponseSchema
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

// Infrastructure request payloads ------------------------------------------

export interface CreateClusterTypeRequest {
    name: string;
    description?: string;
    licensing_model: "open_source" | "commercial" | "hybrid";
}

export type UpdateClusterTypeRequest = Partial<CreateClusterTypeRequest>;

export interface CreateClusterRequest {
    name: string;
    description?: string;
    cluster_type_id: number;
    version: string;
    endpoint: string;
    is_active?: boolean;
}

export type UpdateClusterRequest = Partial<CreateClusterRequest>;

export interface CreateNodeRequest {
    name: string;
    hostname: string;
    ip_address: string;
    node_type: "physical" | "virtual" | "cloud";
    node_role: "master" | "worker" | "etcd";
    cpu_cores: number;
    cpu_architecture: "x86_64" | "arm64" | "arm" | "ppc64le";
    memory_bytes: number;
    storage_bytes: number;
    environment_id: number;
    is_active?: boolean;
}

export type UpdateNodeRequest = Partial<CreateNodeRequest>;

export interface CreateClusterServiceAccountRequest {
    cluster_id: number;
    service_account_id: number;
    namespace: string;
    is_active?: boolean;
}

export type UpdateClusterServiceAccountRequest =
    Partial<CreateClusterServiceAccountRequest>;

// Platform request payloads ------------------------------------------------

export interface CreatePlatformRequest {
    name: string;
    description?: string;
    vendor_id?: number;
    version?: string;
    url?: string;
}

export type UpdatePlatformRequest = Partial<CreatePlatformRequest>;

export interface CreateComponentTypeRequest {
    name: string;
    description?: string;
    icon?: string;
}

export type UpdateComponentTypeRequest = Partial<CreateComponentTypeRequest>;

// Integration request payloads ---------------------------------------------

export interface CreateLinkTypeRequest {
    name: string;
    description?: string;
    icon?: string;
}

export type UpdateLinkTypeRequest = Partial<CreateLinkTypeRequest>;

export interface CreateLinkRequest {
    name: string;
    description?: string;
    link_type_id: number;
    source_type: string;
    source_id: number;
    target_type: string;
    target_id: number;
    protocol: "http" | "https" | "grpc" | "tcp" | "udp" | "websocket";
    communication_style:
        | "synchronous"
        | "asynchronous"
        | "event_driven"
        | "batch";
    endpoint?: string;
    is_active?: boolean;
}

export type UpdateLinkRequest = Partial<CreateLinkRequest>;

// Security request payloads ------------------------------------------------

export interface CreateServiceAccountTokenRequest {
    service_account_id: number;
    token: string;
    expires_at?: string;
    is_active?: boolean;
}

export type UpdateServiceAccountTokenRequest =
    Partial<CreateServiceAccountTokenRequest>;
