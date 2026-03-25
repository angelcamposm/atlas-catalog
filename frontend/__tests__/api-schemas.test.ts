import {
    apiResponseSchema,
    paginatedApiResponseSchema,
    apiTypeResponseSchema,
    paginatedApiTypeResponseSchema,
    lifecycleResponseSchema,
    paginatedLifecycleResponseSchema,
    programmingLanguageResponseSchema,
    paginatedProgrammingLanguageResponseSchema,
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
});
