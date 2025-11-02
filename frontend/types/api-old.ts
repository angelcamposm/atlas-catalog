/**
 * API Type Definitions for Atlas Catalog
 *
 * These types correspond to the Laravel API Resources
 * Generated from DBML schema
 */

import { z } from "zod";

// Common schemas -----------------------------------------------------------

const nullableString = () => z.string().trim().optional().nullable();
const nullableNumber = () => z.number().int().optional().nullable();
const nullableBoolean = () => z.boolean().optional().nullable();
const nullableDate = () => z.string().optional().nullable();

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

// Enums --------------------------------------------------------------------

export enum AuthorizationMethod {
    BASIC = "BASIC",
    OAUTH = "OAUTH",
    KEY = "KEY",
    NONE = "NONE",
}

export enum Protocol {
    HTTP = "HTTP",
    HTTPS = "HTTPS",
}

export enum AccessPolicy {
    PUBLIC = "PUBLIC",
    INTERNAL = "INTERNAL",
    THIRD_PARTY = "THIRD_PARTY",
}

export enum DomainCategory {
    CORE = "CORE",
    SUPPORTING = "SUPPORTING",
    GENERIC = "GENERIC",
}

export enum DiscoverySource {
    SCAN = "SCAN",
    PIPELINE = "PIPELINE",
    MANUAL = "MANUAL",
}

export enum BuildResult {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    ABORTED = "ABORTED",
    UNSTABLE = "UNSTABLE",
}

export enum WorkloadKind {
    DEPLOYMENT = "DEPLOYMENT",
    DAEMONSET = "DAEMONSET",
    STATEFULSET = "STATEFULSET",
    REPLICASET = "REPLICASET",
}

// Users and Groups ---------------------------------------------------------

export const userSchema = z
    .object({
        id: z.number().int(),
        email: nullableString(),
        email_verified_at: nullableDate(),
        is_active: z.boolean().default(true),
        remember_token: nullableBoolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type User = z.infer<typeof userSchema>;

export const groupTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type GroupType = z.infer<typeof groupTypeSchema>;

export const groupSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        email: nullableString(),
        icon: nullableString(),
        label: nullableString(),
        parent_id: nullableNumber(),
        type_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Group = z.infer<typeof groupSchema>;

export const groupMemberRoleSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type GroupMemberRole = z.infer<typeof groupMemberRoleSchema>;

export const groupMemberSchema = z
    .object({
        id: z.number().int(),
        is_active: z.boolean().default(true),
        team_id: z.number().int(),
        user_id: z.number().int(),
        role_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type GroupMember = z.infer<typeof groupMemberSchema>;

// Business Domain ----------------------------------------------------------

export const businessDomainSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        category: z
            .nativeEnum(DomainCategory)
            .optional()
            .nullable(),
        description: nullableString(),
        display_name: nullableString(),
        parent_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type BusinessDomain = z.infer<typeof businessDomainSchema>;

export const businessTierSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        code: nullableString(),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type BusinessTier = z.infer<typeof businessTierSchema>;

export const businessCriticalityLevelSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type BusinessCriticalityLevel = z.infer<
    typeof businessCriticalityLevelSchema
>;

// Environments and Status --------------------------------------------------

export const environmentSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        approval_required: z.boolean().default(false),
        description: nullableString(),
        display_in_matrix: z.boolean().default(true),
        label: nullableString(),
        prefix: nullableString(),
        suffix: nullableString(),
        owner_id: nullableNumber(),
        url: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Environment = z.infer<typeof environmentSchema>;

export const lifecycleSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        color: nullableString(),
        description: nullableString(),
        approval_required: nullableBoolean(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Lifecycle = z.infer<typeof lifecycleSchema>;

export const serviceStatusSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ServiceStatus = z.infer<typeof serviceStatusSchema>;

export const operationalStatusSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type OperationalStatus = z.infer<typeof operationalStatusSchema>;

// Programming Languages and Frameworks -------------------------------------

export const programmingLanguageSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        icon: nullableString(),
        is_enabled: nullableBoolean(),
        url: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ProgrammingLanguage = z.infer<typeof programmingLanguageSchema>;

export const frameworkSchema = z
    .object({
        id: z.number().int(),
        language_id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        icon: nullableString(),
        is_enabled: nullableBoolean(),
        url: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Framework = z.infer<typeof frameworkSchema>;

// Platforms and Components -------------------------------------------------

export const platformSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        icon: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Platform = z.infer<typeof platformSchema>;

export const componentCategorySchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        description: nullableString(),
        icon: nullableString(),
        model: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ComponentCategory = z.infer<typeof componentCategorySchema>;

export const componentSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        criticality_id: nullableNumber(),
        discovery_source: z
            .nativeEnum(DiscoverySource)
            .optional()
            .nullable(),
        display_name: nullableString(),
        description: nullableString(),
        domain_id: nullableNumber(),
        has_zero_downtime_deployment: z.boolean().default(false),
        is_stateless: z.boolean().default(false),
        lifecycle_id: nullableNumber(),
        operational_status_id: nullableNumber(),
        owner_id: nullableNumber(),
        platform_id: nullableNumber(),
        slug: z.string().trim().min(1),
        status_id: nullableNumber(),
        tags: z.record(z.string(), z.unknown()).optional().nullable(),
        tier_id: nullableNumber(),
        type_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Component = z.infer<typeof componentSchema>;

// Builds, Releases, and Deployments ----------------------------------------

export const buildSchema = z.object({
    id: z.number().int(),
    component_id: nullableNumber(),
    job_id: z.string().trim().min(1),
    launched_at: z.string(),
    launched_by: nullableNumber(),
    finished_at: z.string(),
    result: z.nativeEnum(BuildResult).optional().nullable(),
});
export type Build = z.infer<typeof buildSchema>;

export const releaseSchema = z
    .object({
        id: z.number().int(),
        build_id: nullableNumber(),
        component_id: z.number().int(),
        digest_md5: nullableString(),
        digest_sha1: nullableString(),
        digest_sha256: nullableString(),
        framework_id: nullableNumber(),
        language_id: nullableNumber(),
        sbom_digest: nullableString(),
        sbom_ref: nullableString(),
        url: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Release = z.infer<typeof releaseSchema>;

export const deploymentSchema = z
    .object({
        id: z.number().int(),
        deployed_at: z.string(),
        deployed_by: z.number().int(),
        deployment_model: nullableString(),
        deployment_status: nullableString(),
        environment_id: z.number().int(),
        release_id: z.number().int(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Deployment = z.infer<typeof deploymentSchema>;

export const componentEnvironmentSchema = z
    .object({
        id: z.number().int(),
        component_id: z.number().int(),
        discovery_source: z
            .nativeEnum(DiscoverySource)
            .optional()
            .nullable(),
        environment_id: z.number().int(),
        kind: z.nativeEnum(WorkloadKind).optional().nullable(),
        release_id: z.number().int(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ComponentEnvironment = z.infer<typeof componentEnvironmentSchema>;

// Resources ----------------------------------------------------------------

export const resourceTypeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().trim().min(1),
        category: nullableString(),
        description: nullableString(),
        icon: nullableString(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ResourceType = z.infer<typeof resourceTypeSchema>;

export const resourceSchema = z
    .object({
        id: z.number().int(),
        name: nullableString(),
        type_id: nullableNumber(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type Resource = z.infer<typeof resourceSchema>;

export const componentResourceSchema = z
    .object({
        id: z.number().int(),
        component_id: z.number().int(),
        resource_id: z.number().int(),
        relationship_id: z.number().int(),
    })
    .merge(timestampsSchema)
    .merge(userReferenceSchema);
export type ComponentResource = z.infer<typeof componentResourceSchema>;

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
