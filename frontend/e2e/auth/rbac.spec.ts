import { test, expect } from "../fixtures";

/**
 * E2E tests for Role-Based Access Control (RBAC).
 * Task 11.5 — RBAC E2E.
 *
 * These tests require multiple test users with different roles to be
 * pre-seeded in the backend.  They are skipped by default; enable them
 * by providing the required environment variables:
 *   E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD  — a user with viewer role only
 *   E2E_EDITOR_EMAIL / E2E_EDITOR_PASSWORD  — a user with editor role
 *   E2E_ADMIN_EMAIL  / E2E_ADMIN_PASSWORD   — a user with admin role
 */

const VIEWER_EMAIL = process.env.E2E_VIEWER_EMAIL;
const VIEWER_PASSWORD = process.env.E2E_VIEWER_PASSWORD;
const EDITOR_EMAIL = process.env.E2E_EDITOR_EMAIL;
const EDITOR_PASSWORD = process.env.E2E_EDITOR_PASSWORD;

test.describe("RBAC — Role-Based Access Control", () => {
    test.describe("Viewer role", () => {
        test.skip(
            !VIEWER_EMAIL || !VIEWER_PASSWORD,
            "Requires E2E_VIEWER_EMAIL and E2E_VIEWER_PASSWORD env vars"
        );

        test("viewer can access read-only catalog pages", async ({ page }) => {
            // Login as viewer
            await page.goto("/es/login");
            await page.waitForLoadState("networkidle");
            await page.getByLabel(/email/i).fill(VIEWER_EMAIL!);
            await page.getByLabel(/password|contraseña/i).fill(VIEWER_PASSWORD!);
            await page.getByRole("button", { name: /sign in|login|iniciar/i }).click();
            await page.waitForURL((url) => !url.pathname.includes("/login"));

            // Viewer should see catalog
            await page.goto("/es/components");
            await page.waitForLoadState("networkidle");
            const hasContent = (await page.locator("main *").count()) > 0;
            expect(hasContent).toBeTruthy();
        });

        test("viewer cannot access admin pages", async ({ page }) => {
            // Already logged in as viewer from storageState
            await page.goto("/es/admin");
            await page.waitForLoadState("networkidle");

            // Should be redirected or show forbidden
            const isForbidden =
                page.url().includes("/login") ||
                page.url().includes("/forbidden") ||
                (await page
                    .getByText(/forbidden|unauthorized|403|no autorizado/i)
                    .isVisible()
                    .catch(() => false));

            expect(isForbidden).toBeTruthy();
        });
    });

    test.describe("Editor role", () => {
        test.skip(
            !EDITOR_EMAIL || !EDITOR_PASSWORD,
            "Requires E2E_EDITOR_EMAIL and E2E_EDITOR_PASSWORD env vars"
        );

        test("editor can create resources", async ({ page }) => {
            // Login as editor
            await page.goto("/es/login");
            await page.waitForLoadState("networkidle");
            await page.getByLabel(/email/i).fill(EDITOR_EMAIL!);
            await page.getByLabel(/password|contraseña/i).fill(EDITOR_PASSWORD!);
            await page.getByRole("button", { name: /sign in|login|iniciar/i }).click();
            await page.waitForURL((url) => !url.pathname.includes("/login"));

            // Editor should see "New" / create buttons on catalog pages
            await page.goto("/es/components");
            await page.waitForLoadState("networkidle");

            const hasCreateButton = await page
                .getByRole("button", { name: /new|nuevo|create|crear/i })
                .isVisible()
                .catch(() => false);

            expect(hasCreateButton).toBeTruthy();
        });
    });

    test.describe("Admin role", () => {
        test("admin can access admin panel", async ({ page }) => {
            // Requires backend to be running with a seeded admin user
            test.skip(
                !process.env.E2E_ADMIN_EMAIL,
                "Requires E2E_ADMIN_EMAIL env var"
            );

            await page.goto("/es/admin");
            await page.waitForLoadState("networkidle");

            const hasAdminContent = (await page.locator("main *").count()) > 0;
            expect(hasAdminContent).toBeTruthy();
        });
    });
});
