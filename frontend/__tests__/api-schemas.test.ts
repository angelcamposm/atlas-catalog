import {
    apiResponseSchema,
    paginatedApiResponseSchema,
    apiTypeResponseSchema,
    paginatedApiTypeResponseSchema,
    lifecycleResponseSchema,
    paginatedLifecycleResponseSchema,
    programmingLanguageResponseSchema,
    paginatedProgrammingLanguageResponseSchema,
    entityResponseSchema,
    paginatedEntityResponseSchema,
    systemResponseSchema,
    paginatedSystemResponseSchema,
    businessCapabilityResponseSchema,
    paginatedBusinessCapabilityResponseSchema,
    entityAttributeResponseSchema,
    paginatedEntityAttributeResponseSchema,
    businessCapabilitySystemResponseSchema,
    paginatedBusinessCapabilitySystemResponseSchema,
} from "@/types/api";

const baseMeta = {
    current_page: 1,
    from: 1,
    last_page: 1,
    path: "http://localhost/apis",
    per_page: 15,
    to: 1,
    total: 1,
};

const baseLinks = {
    first: "http://localhost/apis?page=1",
    last: "http://localhost/apis?page=1",
    prev: null,
    next: null,
};

const timestamps = {
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
};

const userReference = {
    created_by: 1,
    updated_by: 1,
};

const buildApi = () => ({
    id: 1,
    name: "Catalog API",
    description: "Demo",
    access_policy_id: null,
    authentication_method_id: null,
    protocol: "http",
    document_specification: null,
    status_id: null,
    type_id: null,
    url: "https://api.example.com",
    version: "1.0",
    api_type_id: null,
    lifecycle_id: null,
    api_status_id: null,
    programming_language_id: null,
    business_domain_category: null,
    discovery_source: null,
    ...timestamps,
    ...userReference,
});

describe("api schemas", () => {
    it("parses a valid API response", () => {
        const result = apiResponseSchema.parse({ data: buildApi() });
        expect(result.data.name).toBe("Catalog API");
    });

    it("rejects an invalid API response", () => {
        expect(() =>
            apiResponseSchema.parse({
                data: {
                    ...buildApi(),
                    name: 123,
                },
            })
        ).toThrow();
    });

    it("parses paginated API responses", () => {
        const result = paginatedApiResponseSchema.parse({
            data: [buildApi()],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.meta.total).toBe(1);
    });

    it("parses API type responses", () => {
        const apiType = {
            id: 1,
            name: "REST",
            description: null,
            ...timestamps,
            ...userReference,
        };
        const result = apiTypeResponseSchema.parse({ data: apiType });
        expect(result.data.name).toBe("REST");
    });

    it("parses paginated API type responses", () => {
        const apiType = {
            id: 1,
            name: "SOAP",
            description: null,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedApiTypeResponseSchema.parse({
            data: [apiType],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data).toHaveLength(1);
    });

    it("parses lifecycle responses", () => {
        const lifecycle = {
            id: 1,
            name: "Production",
            description: null,
            approval_required: true,
            ...timestamps,
            ...userReference,
        };
        const result = lifecycleResponseSchema.parse({ data: lifecycle });
        expect(result.data.approval_required).toBe(true);
    });

    it("parses paginated lifecycle responses", () => {
        const lifecycle = {
            id: 1,
            name: "Development",
            description: null,
            approval_required: false,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedLifecycleResponseSchema.parse({
            data: [lifecycle],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.meta.current_page).toBe(1);
    });

    it("parses programming language responses", () => {
        const language = {
            id: 1,
            name: "TypeScript",
            description: null,
            ...timestamps,
            ...userReference,
        };
        const result = programmingLanguageResponseSchema.parse({
            data: language,
        });
        expect(result.data.name).toBe("TypeScript");
    });

    it("parses paginated programming language responses", () => {
        const language = {
            id: 2,
            name: "PHP",
            description: null,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedProgrammingLanguageResponseSchema.parse({
            data: [language],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].name).toBe("PHP");
    });

    // Architecture Domain schemas
    it("parses entity responses", () => {
        const entity = {
            id: 1,
            name: "User",
            description: "User entity",
            is_enabled: true,
            domain_id: null,
            ...timestamps,
            ...userReference,
        };
        const result = entityResponseSchema.parse({ data: entity });
        expect(result.data.name).toBe("User");
    });

    it("parses paginated entity responses", () => {
        const entity = {
            id: 2,
            name: "Order",
            description: null,
            is_enabled: false,
            domain_id: 1,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedEntityResponseSchema.parse({
            data: [entity],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].name).toBe("Order");
    });

    it("parses system responses", () => {
        const system = {
            id: 1,
            name: "Billing System",
            description: "Manages billing",
            ...timestamps,
            ...userReference,
        };
        const result = systemResponseSchema.parse({ data: system });
        expect(result.data.name).toBe("Billing System");
    });

    it("parses paginated system responses", () => {
        const system = {
            id: 2,
            name: "Auth System",
            description: null,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedSystemResponseSchema.parse({
            data: [system],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].name).toBe("Auth System");
    });

    it("parses business capability responses", () => {
        const capability = {
            id: 1,
            name: "Customer Management",
            description: null,
            parent_id: null,
            ...timestamps,
            ...userReference,
        };
        const result = businessCapabilityResponseSchema.parse({ data: capability });
        expect(result.data.name).toBe("Customer Management");
    });

    it("parses paginated business capability responses", () => {
        const capability = {
            id: 2,
            name: "Order Processing",
            description: "Handles orders",
            parent_id: 1,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedBusinessCapabilityResponseSchema.parse({
            data: [capability],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].name).toBe("Order Processing");
    });

    it("parses entity attribute responses", () => {
        const attr = {
            id: 1,
            entity_id: 1,
            name: "email",
            type: "string",
            is_required: true,
            ...timestamps,
            ...userReference,
        };
        const result = entityAttributeResponseSchema.parse({ data: attr });
        expect(result.data.name).toBe("email");
    });

    it("parses paginated entity attribute responses", () => {
        const attr = {
            id: 2,
            entity_id: 1,
            name: "age",
            type: null,
            is_required: false,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedEntityAttributeResponseSchema.parse({
            data: [attr],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].name).toBe("age");
    });

    it("parses business capability system responses", () => {
        const link = {
            id: 1,
            business_capability_id: 1,
            system_id: 2,
            ...timestamps,
            ...userReference,
        };
        const result = businessCapabilitySystemResponseSchema.parse({ data: link });
        expect(result.data.system_id).toBe(2);
    });

    it("parses paginated business capability system responses", () => {
        const link = {
            id: 2,
            business_capability_id: 3,
            system_id: 4,
            ...timestamps,
            ...userReference,
        };
        const result = paginatedBusinessCapabilitySystemResponseSchema.parse({
            data: [link],
            links: baseLinks,
            meta: baseMeta,
        });
        expect(result.data[0].business_capability_id).toBe(3);
    });
});
