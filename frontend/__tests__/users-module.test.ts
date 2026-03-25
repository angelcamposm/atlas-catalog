/**
 * Tests for Users API module
 */

import { usersApi } from "@/lib/api";

// Mock the api-client
jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        buildQuery: jest.fn((params: Record<string, unknown>) => {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, String(value));
                }
            });
            const queryString = query.toString();
            return queryString ? `?${queryString}` : "";
        }),
    },
    ApiError: class ApiError extends Error {
        constructor(
            message: string,
            public status: number
        ) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const createUserMock = (overrides = {}) => ({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    email_verified_at: null,
    is_enabled: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const createPaginatedResponse = <T>(data: T[], page = 1) => ({
    data,
    meta: {
        current_page: page,
        last_page: 1,
        per_page: 15,
        from: 1,
        to: data.length,
        total: data.length,
        path: "/api/v1/organization/users",
    },
    links: {
        first: "/api/v1/organization/users?page=1",
        last: "/api/v1/organization/users?page=1",
        prev: null,
        next: null,
    },
});

describe("usersApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Structure", () => {
        it("exports usersApi with all CRUD methods", () => {
            expect(usersApi.getAll).toBeDefined();
            expect(usersApi.getById).toBeDefined();
            expect(usersApi.create).toBeDefined();
            expect(usersApi.update).toBeDefined();
            expect(usersApi.delete).toBeDefined();
        });

        it("all methods are functions", () => {
            expect(typeof usersApi.getAll).toBe("function");
            expect(typeof usersApi.getById).toBe("function");
            expect(typeof usersApi.create).toBe("function");
            expect(typeof usersApi.update).toBe("function");
            expect(typeof usersApi.delete).toBe("function");
        });
    });

    describe("getAll", () => {
        it("calls GET /v1/organization/users with page param", async () => {
            const mockUsers = [createUserMock(), createUserMock({ id: 2, name: "Jane", email: "jane@example.com" })];
            const mockResponse = createPaginatedResponse(mockUsers);
            mockedApiClient.get.mockResolvedValueOnce(mockResponse);
            mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

            const result = await usersApi.getAll(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/organization/users?page=1"
            );
            expect(result.data).toHaveLength(2);
            expect(result.meta.total).toBe(2);
        });

        it("uses default page 1 when no argument provided", async () => {
            const mockResponse = createPaginatedResponse([createUserMock()]);
            mockedApiClient.get.mockResolvedValueOnce(mockResponse);
            mockedApiClient.buildQuery.mockReturnValueOnce("?page=1");

            await usersApi.getAll();

            expect(mockedApiClient.buildQuery).toHaveBeenCalledWith({ page: 1 });
        });
    });

    describe("getById", () => {
        it("calls GET /v1/organization/users/:id", async () => {
            const mockUser = createUserMock();
            mockedApiClient.get.mockResolvedValueOnce({ data: mockUser });

            const result = await usersApi.getById(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/organization/users/1"
            );
            expect(result.data.id).toBe(1);
            expect(result.data.name).toBe("John Doe");
        });
    });

    describe("create", () => {
        it("calls POST /v1/organization/users with data", async () => {
            const createData = { name: "New User", email: "new@example.com" };
            const mockUser = createUserMock({ name: "New User", email: "new@example.com" });
            mockedApiClient.post.mockResolvedValueOnce({ data: mockUser });

            const result = await usersApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/organization/users",
                createData
            );
            expect(result.data.name).toBe("New User");
        });
    });

    describe("update", () => {
        it("calls PUT /v1/organization/users/:id with data", async () => {
            const updateData = { name: "Updated User" };
            const mockUser = createUserMock({ name: "Updated User" });
            mockedApiClient.put.mockResolvedValueOnce({ data: mockUser });

            const result = await usersApi.update(1, updateData);

            expect(mockedApiClient.put).toHaveBeenCalledWith(
                "/v1/organization/users/1",
                updateData
            );
            expect(result.data.name).toBe("Updated User");
        });
    });

    describe("delete", () => {
        it("calls DELETE /v1/organization/users/:id", async () => {
            mockedApiClient.delete.mockResolvedValueOnce(undefined);

            await usersApi.delete(1);

            expect(mockedApiClient.delete).toHaveBeenCalledWith(
                "/v1/organization/users/1"
            );
        });
    });
});
