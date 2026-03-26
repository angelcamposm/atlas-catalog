/**
 * Tests for Operations API module
 * TDD — verify module exports and API structure
 */

import {
    serviceStatusesApi,
    metricsApi,
    metricSchema,
    type Metric,
    type CreateMetricRequest,
} from "@/lib/api/operations";

describe("serviceStatusesApi (Operations module)", () => {
    describe("Module exports", () => {
        it("should export serviceStatusesApi", () => {
            expect(serviceStatusesApi).toBeDefined();
        });

        it("should have getAll method", () => {
            expect(typeof serviceStatusesApi.getAll).toBe("function");
        });

        it("should have getById method", () => {
            expect(typeof serviceStatusesApi.getById).toBe("function");
        });

        it("should have create method", () => {
            expect(typeof serviceStatusesApi.create).toBe("function");
        });

        it("should have update method", () => {
            expect(typeof serviceStatusesApi.update).toBe("function");
        });

        it("should have delete method", () => {
            expect(typeof serviceStatusesApi.delete).toBe("function");
        });
    });
});

describe("metricsApi", () => {
    describe("Module exports", () => {
        it("should export metricsApi", () => {
            expect(metricsApi).toBeDefined();
        });

        it("should have getAll method", () => {
            expect(typeof metricsApi.getAll).toBe("function");
        });

        it("should have getById method", () => {
            expect(typeof metricsApi.getById).toBe("function");
        });

        it("should have create method", () => {
            expect(typeof metricsApi.create).toBe("function");
        });

        it("should have update method", () => {
            expect(typeof metricsApi.update).toBe("function");
        });

        it("should have delete method", () => {
            expect(typeof metricsApi.delete).toBe("function");
        });
    });

    describe("metricSchema", () => {
        it("should export metricSchema", () => {
            expect(metricSchema).toBeDefined();
        });

        it("should validate a valid metric", () => {
            const valid: Metric = {
                id: 1,
                name: "response_time",
                value: 42.5,
                unit: "ms",
                metric_definition_id: 2,
                component_id: null,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };
            const result = metricSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it("should accept null unit and component_id", () => {
            const withNulls = {
                id: 1,
                name: "cpu_usage",
                value: 0.75,
                unit: null,
                metric_definition_id: 3,
                component_id: null,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };
            const result = metricSchema.safeParse(withNulls);
            expect(result.success).toBe(true);
        });

        it("should reject missing name", () => {
            const invalid = {
                id: 1,
                value: 1.0,
                metric_definition_id: 1,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
            };
            const result = metricSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });

        it("should reject non-numeric value", () => {
            const invalid = {
                id: 1,
                name: "error",
                value: "not-a-number",
                metric_definition_id: 1,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
            };
            const result = metricSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });
    });

    describe("CreateMetricRequest type", () => {
        it("should accept a valid create request", () => {
            const req: CreateMetricRequest = {
                name: "latency",
                value: 120.0,
                metric_definition_id: 1,
            };
            expect(req.name).toBe("latency");
            expect(req.value).toBe(120.0);
        });
    });
});
