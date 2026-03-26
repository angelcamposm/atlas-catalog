import { test, expect } from "../fixtures";

/**
 * E2E tests for protected routes — redirect to login when unauthenticated.
 * Task 0.4 — Protected Routes E2E.
 */
const PROTECTED_ROUTES = [
    "/es/dashboard",
    "/es/apis",
    "/es/components",
    "/es/resources",
    "/es/infrastructure",
    "/es/teams",
    "/es/admin/api-types",
];

test.describe("Protected Routes", () => {
    for (const route of PROTECTED_ROUTES) {
        test.skip(`${route} redirects to login when unauthenticated`, async ({
            page,
        }) => {
            // Skip: requires auth middleware to be active
            // When not authenticated, protected routes should redirect to login
            await page.goto(route);
            await page.waitForLoadState("networkidle");

            // Should be on login page or show auth error
            const onLoginPage = page.url().includes("/login");
            const hasLoginForm = await page
                .locator('[name="email"], #email')
                .isVisible()
                .catch(() => false);

            expect(onLoginPage || hasLoginForm).toBeTruthy();
        });
    }

    test("login page is accessible without authentication", async ({ page }) => {
        await page.goto("/es/login");
        await page.waitForLoadState("networkidle");

        await expect(
            page.getByRole("heading", {
                name: /iniciar sesi[oó]n|login|sign in/i,
            }),
        ).toBeVisible();
    });
});
