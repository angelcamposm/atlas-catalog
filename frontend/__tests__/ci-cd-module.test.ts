/**
 * Tests for CI/CD API Module
 *
 * Covers: ciServersApi, workflowsApi, releasesApi, deploymentsApi, ciCdApi
 */

import {
    ciCdApi,
    ciServersApi,
    workflowsApi,
    releasesApi,
    deploymentsApi,
} from "@/lib/api";

describe("CI/CD API Module", () => {
    describe("ciServersApi", () => {
        it("is defined", () => {
            expect(ciServersApi).toBeDefined();
        });

        it("has getAll method", () => {
            expect(ciServersApi.getAll).toBeDefined();
            expect(typeof ciServersApi.getAll).toBe("function");
        });

        it("has getById method", () => {
            expect(ciServersApi.getById).toBeDefined();
            expect(typeof ciServersApi.getById).toBe("function");
        });

        it("has create method", () => {
            expect(ciServersApi.create).toBeDefined();
            expect(typeof ciServersApi.create).toBe("function");
        });

        it("has update method", () => {
            expect(ciServersApi.update).toBeDefined();
            expect(typeof ciServersApi.update).toBe("function");
        });

        it("has delete method", () => {
            expect(ciServersApi.delete).toBeDefined();
            expect(typeof ciServersApi.delete).toBe("function");
        });
    });

    describe("workflowsApi", () => {
        it("is defined", () => {
            expect(workflowsApi).toBeDefined();
        });

        it("has getRuns method", () => {
            expect(workflowsApi.getRuns).toBeDefined();
            expect(typeof workflowsApi.getRuns).toBe("function");
        });

        it("has getRunById method", () => {
            expect(workflowsApi.getRunById).toBeDefined();
            expect(typeof workflowsApi.getRunById).toBe("function");
        });

        it("has createRun method", () => {
            expect(workflowsApi.createRun).toBeDefined();
            expect(typeof workflowsApi.createRun).toBe("function");
        });

        it("has updateRun method", () => {
            expect(workflowsApi.updateRun).toBeDefined();
            expect(typeof workflowsApi.updateRun).toBe("function");
        });

        it("has deleteRun method", () => {
            expect(workflowsApi.deleteRun).toBeDefined();
            expect(typeof workflowsApi.deleteRun).toBe("function");
        });

        it("has getCommits method", () => {
            expect(workflowsApi.getCommits).toBeDefined();
            expect(typeof workflowsApi.getCommits).toBe("function");
        });

        it("has getCommitById method", () => {
            expect(workflowsApi.getCommitById).toBeDefined();
            expect(typeof workflowsApi.getCommitById).toBe("function");
        });

        it("has getJobs method", () => {
            expect(workflowsApi.getJobs).toBeDefined();
            expect(typeof workflowsApi.getJobs).toBe("function");
        });
    });

    describe("releasesApi", () => {
        it("is defined", () => {
            expect(releasesApi).toBeDefined();
        });

        it("has getAll method", () => {
            expect(releasesApi.getAll).toBeDefined();
            expect(typeof releasesApi.getAll).toBe("function");
        });

        it("has getById method", () => {
            expect(releasesApi.getById).toBeDefined();
            expect(typeof releasesApi.getById).toBe("function");
        });

        it("has create method", () => {
            expect(releasesApi.create).toBeDefined();
            expect(typeof releasesApi.create).toBe("function");
        });

        it("has update method", () => {
            expect(releasesApi.update).toBeDefined();
            expect(typeof releasesApi.update).toBe("function");
        });

        it("has delete method", () => {
            expect(releasesApi.delete).toBeDefined();
            expect(typeof releasesApi.delete).toBe("function");
        });
    });

    describe("deploymentsApi", () => {
        it("is defined", () => {
            expect(deploymentsApi).toBeDefined();
        });

        it("has getAll method", () => {
            expect(deploymentsApi.getAll).toBeDefined();
            expect(typeof deploymentsApi.getAll).toBe("function");
        });

        it("has getById method", () => {
            expect(deploymentsApi.getById).toBeDefined();
            expect(typeof deploymentsApi.getById).toBe("function");
        });

        it("has update method", () => {
            expect(deploymentsApi.update).toBeDefined();
            expect(typeof deploymentsApi.update).toBe("function");
        });

        it("does NOT have create method (deployments from webhooks)", () => {
            expect(
                (deploymentsApi as Record<string, unknown>).create,
            ).toBeUndefined();
        });

        it("does NOT have delete method", () => {
            expect(
                (deploymentsApi as Record<string, unknown>).delete,
            ).toBeUndefined();
        });
    });

    describe("ciCdApi (consolidated)", () => {
        it("is defined", () => {
            expect(ciCdApi).toBeDefined();
        });

        it("exposes ciServersApi as servers", () => {
            expect(ciCdApi.servers).toBeDefined();
            expect(ciCdApi.servers.getAll).toBeDefined();
        });

        it("exposes workflowsApi as workflows", () => {
            expect(ciCdApi.workflows).toBeDefined();
            expect(ciCdApi.workflows.getRuns).toBeDefined();
        });

        it("exposes releasesApi as releases", () => {
            expect(ciCdApi.releases).toBeDefined();
            expect(ciCdApi.releases.getAll).toBeDefined();
        });

        it("exposes deploymentsApi as deployments", () => {
            expect(ciCdApi.deployments).toBeDefined();
            expect(ciCdApi.deployments.getAll).toBeDefined();
        });
    });
});
