import { test, expect } from "../fixtures";

/**
 * E2E tests for the Dashboard page.
 * Task 9.1 — Dashboard E2E.
 */
test.describe("Dashboard", () => {
    test("dashboard page loads", async ({ page }) => {
        await page.goto("/es/dashboard");
        await page.waitForLoadState("networkidle");

        const hasHeading = await page
            .getByRole("heading", { name: /dashboard/i })
            .isVisible()
            .catch(() => false);
        const hasContent =
            (await page.locator("main, [data-testid]").count()) > 0;

        expect(hasHeading || hasContent).toBeTruthy();
    });

    test("shows navigation sidebar", async ({ page }) => {
        await page.goto("/es/dashboard");
        await page.waitForLoadState("networkidle");

        const hasSidebar = await page
            .locator(
                'nav, aside, [data-testid="sidebar"], [aria-label*="navigation" i]',
            )
            .isVisible()
            .catch(() => false);

        expect(hasSidebar).toBeTruthy();
    });
});
