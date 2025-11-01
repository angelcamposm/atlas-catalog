/**
 * Tests for new API modules
 */

import {
    infrastructureApi,
    platformApi,
    integrationApi,
    securityApi,
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
});
