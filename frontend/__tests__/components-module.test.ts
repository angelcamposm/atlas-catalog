/**
 * Tests for the components API module.
 *
 * Verifies that each function constructs the correct URL and delegates to
 * apiClient with the right arguments. We mock apiClient so no real HTTP
 * traffic is produced.
 */

import { componentsApi } from "@/lib/api/components";

// ---------------------------------------------------------------------------
// Mock apiClient
// ---------------------------------------------------------------------------

jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
    ApiError: class ApiError extends Error {
        constructor(
            message: string,
            public status: number,
        ) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPut = apiClient.put as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Minimal paginated envelope returned by the backend
const paginatedEnvelope = {
    data: [],
    meta: {
        current_page: 1,
        from: 0,
        to: 0,
        per_page: 15,
        total: 0,
        last_page: 1,
        path: "/api/v1/catalog/components",
    },
    links: { first: "", last: "", prev: null, next: null },
};

// Minimal single-resource envelope
const singleEnvelope = {
    data: {
        id: 1,
        name: "auth-service",
        slug: "auth-service",
        display_name: "Auth Service",
        description: null,
        is_stateless: false,
        has_zero_downtime_deployments: true,
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue(paginatedEnvelope);
});

// ---------------------------------------------------------------------------
// getAll
// ---------------------------------------------------------------------------

describe("componentsApi.getAll", () => {
    it("calls /v1/catalog/components with no params when called with no args", async () => {
        await componentsApi.getAll();
        const [url] = mockGet.mock.calls[0];
        expect(url).toBe("/v1/catalog/components");
    });

    it("appends page and per_page to the query string", async () => {
        await componentsApi.getAll({ page: 2, per_page: 25 });
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("page=2");
        expect(url).toContain("per_page=25");
    });

    it("appends search term", async () => {
        await componentsApi.getAll({ search: "auth" });
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("search=auth");
    });

    it("appends filter params for domain_id, tier_id, lifecycle_id", async () => {
        await componentsApi.getAll({
            domain_id: 3,
            tier_id: 1,
            lifecycle_id: 2,
        });
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("domain_id=3");
        expect(url).toContain("tier_id=1");
        expect(url).toContain("lifecycle_id=2");
    });

    it("appends boolean is_stateless correctly", async () => {
        await componentsApi.getAll({ is_stateless: true });
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("is_stateless=true");
    });

    it("uses the correct field name has_zero_downtime_deployments (with s)", async () => {
        await componentsApi.getAll({ has_zero_downtime_deployments: true });
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("has_zero_downtime_deployments=true");
        // Must NOT appear without the trailing 's'
        expect(url).not.toMatch(/has_zero_downtime_deployment(?!s)/);
    });

    it("does not append undefined/null filter values", async () => {
        await componentsApi.getAll({ domain_id: undefined, page: undefined });
        const [url] = mockGet.mock.calls[0];
        expect(url).toBe("/v1/catalog/components");
    });
});

// ---------------------------------------------------------------------------
// getById
// ---------------------------------------------------------------------------

describe("componentsApi.getById", () => {
    beforeEach(() => {
        mockGet.mockResolvedValue(singleEnvelope);
    });

    it("calls the correct URL with an ID", async () => {
        await componentsApi.getById(42);
        const [url] = mockGet.mock.calls[0];
        expect(url).toBe("/v1/catalog/components/42");
    });

    it("appends with param as comma-separated string", async () => {
        await componentsApi.getById(42, ["domain", "platform", "owner"]);
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("with=domain%2Cplatform%2Cowner");
    });

    it("does NOT use semicolon separator for with param", async () => {
        await componentsApi.getById(42, ["domain", "platform"]);
        const [url] = mockGet.mock.calls[0];
        expect(url).not.toContain(";");
    });
});

// ---------------------------------------------------------------------------
// getBySlug
// ---------------------------------------------------------------------------

describe("componentsApi.getBySlug", () => {
    beforeEach(() => {
        mockGet.mockResolvedValue(singleEnvelope);
    });

    it("calls the correct URL with a slug", async () => {
        await componentsApi.getBySlug("auth-service");
        const [url] = mockGet.mock.calls[0];
        expect(url).toBe("/v1/catalog/components/auth-service");
    });

    it("appends with param comma-separated", async () => {
        await componentsApi.getBySlug("auth-service", ["domain", "lifecycle"]);
        const [url] = mockGet.mock.calls[0];
        expect(url).toContain("with=domain%2Clifecycle");
    });
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

describe("componentsApi.create", () => {
    beforeEach(() => {
        mockPost.mockResolvedValue(singleEnvelope);
    });

    it("POSTs to /v1/catalog/components with the payload", async () => {
        const payload = {
            name: "new-service",
            slug: "new-service",
            display_name: "New Service",
            has_zero_downtime_deployments: true,
        };
        await componentsApi.create(payload);
        expect(mockPost).toHaveBeenCalledWith(
            "/v1/catalog/components",
            payload,
        );
    });
});

// ---------------------------------------------------------------------------
// update
// ---------------------------------------------------------------------------

describe("componentsApi.update", () => {
    beforeEach(() => {
        mockPut.mockResolvedValue(singleEnvelope);
    });

    it("PUTs to /v1/catalog/components/{id} with the payload", async () => {
        await componentsApi.update(7, { display_name: "Renamed" });
        expect(mockPut).toHaveBeenCalledWith("/v1/catalog/components/7", {
            display_name: "Renamed",
        });
    });
});

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

describe("componentsApi.delete", () => {
    beforeEach(() => {
        mockDelete.mockResolvedValue(undefined);
    });

    it("DELETEs /v1/catalog/components/{id}", async () => {
        await componentsApi.delete(9);
        expect(mockDelete).toHaveBeenCalledWith("/v1/catalog/components/9");
    });
});
