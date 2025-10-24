/**
 * API Type Definitions for Atlas Catalog
 *
 * These types correspond to the Laravel API Resources
 */

// Common types
export interface Timestamps {
    created_at: string;
    updated_at: string;
}

export interface UserReference {
    created_by: number;
    updated_by: number;
}

// Base model interfaces
export interface Api extends Timestamps, UserReference {
    id: number;
    name: string;
    description?: string;
    api_type_id?: number;
    lifecycle_id?: number;
    api_status_id?: number;
    programming_language_id?: number;
    business_domain_category?: string;
    discovery_source?: string;
}

export interface ApiType extends Timestamps, UserReference {
    id: number;
    name: string;
    description?: string;
}

export interface ApiStatus extends Timestamps, UserReference {
    id: number;
    name: string;
    description?: string;
}

export interface Lifecycle extends Timestamps, UserReference {
    id: number;
    name: string;
    description?: string;
    approval_required: boolean;
}

export interface ProgrammingLanguage extends Timestamps, UserReference {
    id: number;
    name: string;
    description?: string;
}

// API Response types
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface ApiResponse<T> {
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

// Request types
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

export interface UpdateApiRequest extends Partial<CreateApiRequest> {}

export interface CreateApiTypeRequest {
    name: string;
    description?: string;
}

export interface UpdateApiTypeRequest extends Partial<CreateApiTypeRequest> {}

export interface CreateLifecycleRequest {
    name: string;
    description?: string;
    approval_required: boolean;
}

export interface UpdateLifecycleRequest
    extends Partial<CreateLifecycleRequest> {}

export interface CreateProgrammingLanguageRequest {
    name: string;
    description?: string;
}

export interface UpdateProgrammingLanguageRequest
    extends Partial<CreateProgrammingLanguageRequest> {}
