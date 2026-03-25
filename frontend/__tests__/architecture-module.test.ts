/**
 * Tests for architecture API module extensions
 * Verifies all new endpoints added in Task 2.1
 */

import {
    businessCapabilitiesApi,
    entitiesApi,
    systemsApi,
    businessCapabilitySystemsApi,
    entityAttributesApi,
} from "@/lib/api/architecture";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import { businessDomainsApi } from "@/lib/api/business";

describe("Architecture API Module", () => {
    describe("businessCapabilitiesApi", () => {
        it("has all CRUD methods", () => {
            expect(businessCapabilitiesApi.getAll).toBeDefined();
            expect(businessCapabilitiesApi.getById).toBeDefined();
            expect(businessCapabilitiesApi.create).toBeDefined();
            expect(businessCapabilitiesApi.update).toBeDefined();
            expect(businessCapabilitiesApi.delete).toBeDefined();
        });

        it("has getCapabilitySystems nested method", () => {
            expect(businessCapabilitiesApi.getCapabilitySystems).toBeDefined();
            expect(
                typeof businessCapabilitiesApi.getCapabilitySystems
            ).toBe("function");
        });
    });

    describe("businessCapabilitySystemsApi", () => {
        it("is defined and exported", () => {
            expect(businessCapabilitySystemsApi).toBeDefined();
        });

        it("has all CRUD methods", () => {
            expect(businessCapabilitySystemsApi.getAll).toBeDefined();
            expect(businessCapabilitySystemsApi.getById).toBeDefined();
            expect(businessCapabilitySystemsApi.create).toBeDefined();
            expect(businessCapabilitySystemsApi.update).toBeDefined();
            expect(businessCapabilitySystemsApi.delete).toBeDefined();
        });
    });

    describe("entitiesApi", () => {
        it("has all CRUD methods", () => {
            expect(entitiesApi.getAll).toBeDefined();
            expect(entitiesApi.getById).toBeDefined();
            expect(entitiesApi.create).toBeDefined();
            expect(entitiesApi.update).toBeDefined();
            expect(entitiesApi.delete).toBeDefined();
        });

        it("has getEntityComponents nested method", () => {
            expect(entitiesApi.getEntityComponents).toBeDefined();
            expect(typeof entitiesApi.getEntityComponents).toBe("function");
        });
    });

    describe("entityAttributesApi", () => {
        it("is defined and exported", () => {
            expect(entityAttributesApi).toBeDefined();
        });

        it("has all CRUD methods", () => {
            expect(entityAttributesApi.getAll).toBeDefined();
            expect(entityAttributesApi.getById).toBeDefined();
            expect(entityAttributesApi.create).toBeDefined();
            expect(entityAttributesApi.update).toBeDefined();
            expect(entityAttributesApi.delete).toBeDefined();
        });
    });

    describe("systemsApi", () => {
        it("has all CRUD methods", () => {
            expect(systemsApi.getAll).toBeDefined();
            expect(systemsApi.getById).toBeDefined();
            expect(systemsApi.create).toBeDefined();
            expect(systemsApi.update).toBeDefined();
            expect(systemsApi.delete).toBeDefined();
        });

        it("has getSystemComponents nested method", () => {
            expect(systemsApi.getSystemComponents).toBeDefined();
            expect(typeof systemsApi.getSystemComponents).toBe("function");
        });
    });
});

describe("Lifecycles API Module - architecture extensions", () => {
    it("has getComponents nested method", () => {
        expect(lifecyclesApi.getComponents).toBeDefined();
        expect(typeof lifecyclesApi.getComponents).toBe("function");
    });
});

describe("BusinessDomains API Module - architecture extensions", () => {
    it("has getComponents nested method", () => {
        expect(businessDomainsApi.getComponents).toBeDefined();
        expect(typeof businessDomainsApi.getComponents).toBe("function");
    });

    it("has getDomainEntities nested method", () => {
        expect(businessDomainsApi.getDomainEntities).toBeDefined();
        expect(typeof businessDomainsApi.getDomainEntities).toBe("function");
    });
});
