/**
 * Tests for Compliance Requirements API module
 * TDD — verify module exports and API structure
 */

import {
    complianceRequirementsApi,
    complianceRequirementSchema,
    type ComplianceRequirement,
    type CreateComplianceRequirementRequest,
} from "@/lib/api/compliance";

describe("complianceRequirementsApi", () => {
    describe("Module exports", () => {
        it("should export complianceRequirementsApi", () => {
            expect(complianceRequirementsApi).toBeDefined();
        });

        it("should have getAll method", () => {
            expect(typeof complianceRequirementsApi.getAll).toBe("function");
        });

        it("should have getById method", () => {
            expect(typeof complianceRequirementsApi.getById).toBe("function");
        });

        it("should have create method", () => {
            expect(typeof complianceRequirementsApi.create).toBe("function");
        });

        it("should have update method", () => {
            expect(typeof complianceRequirementsApi.update).toBe("function");
        });

        it("should have delete method", () => {
            expect(typeof complianceRequirementsApi.delete).toBe("function");
        });
    });

    describe("complianceRequirementSchema", () => {
        it("should export complianceRequirementSchema", () => {
            expect(complianceRequirementSchema).toBeDefined();
        });

        it("should validate a valid compliance requirement", () => {
            const valid: ComplianceRequirement = {
                id: 1,
                compliance_standard_id: 2,
                name: "Req-001",
                description: "Test requirement",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };
            const result = complianceRequirementSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it("should accept null description", () => {
            const withNullDesc = {
                id: 1,
                compliance_standard_id: 2,
                name: "Req-001",
                description: null,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };
            const result = complianceRequirementSchema.safeParse(withNullDesc);
            expect(result.success).toBe(true);
        });

        it("should reject missing name", () => {
            const invalid = {
                id: 1,
                compliance_standard_id: 2,
                // name missing
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };
            const result = complianceRequirementSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });
    });

    describe("CreateComplianceRequirementRequest type", () => {
        it("should accept a minimal create request", () => {
            const req: CreateComplianceRequirementRequest = {
                compliance_standard_id: 1,
                name: "Req-001",
            };
            expect(req.compliance_standard_id).toBe(1);
            expect(req.name).toBe("Req-001");
        });

        it("should accept optional description", () => {
            const req: CreateComplianceRequirementRequest = {
                compliance_standard_id: 1,
                name: "Req-001",
                description: "Details here",
            };
            expect(req.description).toBe("Details here");
        });
    });
});
