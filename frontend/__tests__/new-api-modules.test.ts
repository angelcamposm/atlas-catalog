/**
 * Tests for new API modules
 */

import {
    infrastructureApi,
    platformApi,
    integrationApi,
    securityApi,
    apiExtendedApi,
    businessApi,
    technologyApi,
    groupsApiComplete,
    complianceApi,
    resourcesApiComplete,
    infrastructureTypesApi,
    serviceAccountsApi,
} from "@/lib/api";

describe("New API Modules", () => {
    describe("Infrastructure API", () => {
        it("exports all infrastructure APIs", () => {
            expect(infrastructureApi.clusterTypes).toBeDefined();
            expect(infrastructureApi.clusters).toBeDefined();
            expect(infrastructureApi.nodes).toBeDefined();
            expect(infrastructureApi.clusterServiceAccounts).toBeDefined();
        });

        it("has all CRUD methods for clusters", () => {
            expect(infrastructureApi.clusters.getAll).toBeDefined();
            expect(infrastructureApi.clusters.getById).toBeDefined();
            expect(infrastructureApi.clusters.create).toBeDefined();
            expect(infrastructureApi.clusters.update).toBeDefined();
            expect(infrastructureApi.clusters.delete).toBeDefined();
        });

        it("has all CRUD methods for nodes", () => {
            expect(infrastructureApi.nodes.getAll).toBeDefined();
            expect(infrastructureApi.nodes.getById).toBeDefined();
            expect(infrastructureApi.nodes.create).toBeDefined();
            expect(infrastructureApi.nodes.update).toBeDefined();
            expect(infrastructureApi.nodes.delete).toBeDefined();
        });
    });

    describe("Platform API", () => {
        it("exports all platform APIs", () => {
            expect(platformApi.platforms).toBeDefined();
            expect(platformApi.componentTypes).toBeDefined();
        });

        it("has all CRUD methods for platforms", () => {
            expect(platformApi.platforms.getAll).toBeDefined();
            expect(platformApi.platforms.getById).toBeDefined();
            expect(platformApi.platforms.create).toBeDefined();
            expect(platformApi.platforms.update).toBeDefined();
            expect(platformApi.platforms.delete).toBeDefined();
        });

        it("has all CRUD methods for component types", () => {
            expect(platformApi.componentTypes.getAll).toBeDefined();
            expect(platformApi.componentTypes.getById).toBeDefined();
            expect(platformApi.componentTypes.create).toBeDefined();
            expect(platformApi.componentTypes.update).toBeDefined();
            expect(platformApi.componentTypes.delete).toBeDefined();
        });
    });

    describe("Integration API", () => {
        it("exports all integration APIs", () => {
            expect(integrationApi.linkTypes).toBeDefined();
            expect(integrationApi.links).toBeDefined();
        });

        it("has all CRUD methods for links", () => {
            expect(integrationApi.links.getAll).toBeDefined();
            expect(integrationApi.links.getById).toBeDefined();
            expect(integrationApi.links.create).toBeDefined();
            expect(integrationApi.links.update).toBeDefined();
            expect(integrationApi.links.delete).toBeDefined();
        });

        it("has all CRUD methods for link types", () => {
            expect(integrationApi.linkTypes.getAll).toBeDefined();
            expect(integrationApi.linkTypes.getById).toBeDefined();
            expect(integrationApi.linkTypes.create).toBeDefined();
            expect(integrationApi.linkTypes.update).toBeDefined();
            expect(integrationApi.linkTypes.delete).toBeDefined();
        });
    });

    describe("Security API", () => {
        it("exports all security APIs", () => {
            expect(securityApi.serviceAccountTokens).toBeDefined();
        });

        it("has all CRUD methods for service account tokens", () => {
            expect(securityApi.serviceAccountTokens.getAll).toBeDefined();
            expect(securityApi.serviceAccountTokens.getById).toBeDefined();
            expect(securityApi.serviceAccountTokens.create).toBeDefined();
            expect(securityApi.serviceAccountTokens.update).toBeDefined();
            expect(securityApi.serviceAccountTokens.delete).toBeDefined();
        });
    });

    describe("API Extended API", () => {
        it("exports all API extended APIs", () => {
            expect(apiExtendedApi.categories).toBeDefined();
            expect(apiExtendedApi.statuses).toBeDefined();
            expect(apiExtendedApi.accessPolicies).toBeDefined();
        });

        it("has all CRUD methods for API categories", () => {
            expect(apiExtendedApi.categories.getAll).toBeDefined();
            expect(apiExtendedApi.categories.getById).toBeDefined();
            expect(apiExtendedApi.categories.create).toBeDefined();
            expect(apiExtendedApi.categories.update).toBeDefined();
            expect(apiExtendedApi.categories.delete).toBeDefined();
        });
    });

    describe("Business API", () => {
        it("exports all business APIs", () => {
            expect(businessApi.domains).toBeDefined();
            expect(businessApi.tiers).toBeDefined();
            expect(businessApi.environments).toBeDefined();
        });

        it("has all CRUD methods for business domains", () => {
            expect(businessApi.domains.getAll).toBeDefined();
            expect(businessApi.domains.getById).toBeDefined();
            expect(businessApi.domains.create).toBeDefined();
            expect(businessApi.domains.update).toBeDefined();
            expect(businessApi.domains.delete).toBeDefined();
        });
    });

    describe("Technology API", () => {
        it("exports all technology APIs", () => {
            expect(technologyApi.vendors).toBeDefined();
            expect(technologyApi.frameworks).toBeDefined();
            expect(technologyApi.authenticationMethods).toBeDefined();
        });

        it("has all CRUD methods for vendors", () => {
            expect(technologyApi.vendors.getAll).toBeDefined();
            expect(technologyApi.vendors.getById).toBeDefined();
            expect(technologyApi.vendors.create).toBeDefined();
            expect(technologyApi.vendors.update).toBeDefined();
            expect(technologyApi.vendors.delete).toBeDefined();
        });
    });

    describe("Groups API", () => {
        it("exports all groups APIs", () => {
            expect(groupsApiComplete.groups).toBeDefined();
            expect(groupsApiComplete.types).toBeDefined();
            expect(groupsApiComplete.memberRoles).toBeDefined();
        });

        it("has all CRUD methods for groups", () => {
            expect(groupsApiComplete.groups.getAll).toBeDefined();
            expect(groupsApiComplete.groups.getById).toBeDefined();
            expect(groupsApiComplete.groups.create).toBeDefined();
            expect(groupsApiComplete.groups.update).toBeDefined();
            expect(groupsApiComplete.groups.delete).toBeDefined();
        });
    });

    describe("Compliance API", () => {
        it("exports all compliance APIs", () => {
            expect(complianceApi.standards).toBeDefined();
            expect(complianceApi.serviceStatuses).toBeDefined();
        });

        it("has all CRUD methods for compliance standards", () => {
            expect(complianceApi.standards.getAll).toBeDefined();
            expect(complianceApi.standards.getById).toBeDefined();
            expect(complianceApi.standards.create).toBeDefined();
            expect(complianceApi.standards.update).toBeDefined();
            expect(complianceApi.standards.delete).toBeDefined();
        });
    });

    describe("Resources API", () => {
        it("exports all resources APIs", () => {
            expect(resourcesApiComplete.resources).toBeDefined();
            expect(resourcesApiComplete.categories).toBeDefined();
        });

        it("has all CRUD methods for resources", () => {
            expect(resourcesApiComplete.resources.getAll).toBeDefined();
            expect(resourcesApiComplete.resources.getById).toBeDefined();
            expect(resourcesApiComplete.resources.create).toBeDefined();
            expect(resourcesApiComplete.resources.update).toBeDefined();
            expect(resourcesApiComplete.resources.delete).toBeDefined();
        });
    });

    describe("Infrastructure Types API", () => {
        it("has all CRUD methods", () => {
            expect(infrastructureTypesApi.getAll).toBeDefined();
            expect(infrastructureTypesApi.getById).toBeDefined();
            expect(infrastructureTypesApi.create).toBeDefined();
            expect(infrastructureTypesApi.update).toBeDefined();
            expect(infrastructureTypesApi.delete).toBeDefined();
        });
    });

    describe("Service Accounts API", () => {
        it("has all CRUD methods", () => {
            expect(serviceAccountsApi.getAll).toBeDefined();
            expect(serviceAccountsApi.getById).toBeDefined();
            expect(serviceAccountsApi.create).toBeDefined();
            expect(serviceAccountsApi.update).toBeDefined();
            expect(serviceAccountsApi.delete).toBeDefined();
        });
    });
});
