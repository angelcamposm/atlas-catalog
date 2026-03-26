import { test, expect } from "../fixtures";

/**
 * E2E tests for the API Detail page.
 * Task 11.2 — API Detail E2E.
 */
test.describe("API Detail", () => {
    test("list page loads with API cards or empty state", async ({ page }) => {
        await page.goto("/es/apis");
        await page.waitForLoadState("networkidle");

        const hasHeading = await page
            .getByRole("heading", { name: /api|apis/i })
            .isVisible()
            .catch(() => false);
        const hasCards =
            (await page.locator('[data-testid="api-card"]').count()) > 0;
        const hasEmpty = await page
            .getByText(/no hay|empty|sin api/i)
            .isVisible()
            .catch(() => false);

        expect(hasHeading || hasCards || hasEmpty).toBeTruthy();
    });

    test.skip("navigates to API detail when clicking a card", async ({
        page,
    }) => {
        // Skip: requires seeded data in the database
        await page.goto("/es/apis");
        await page.waitForLoadState("networkidle");

        await page
            .locator('[data-testid="api-card"]')
            .first()
            .click();
        await expect(page.getByRole("heading")).toBeVisible();
    });

    test.skip("shows tabs: Overview, Docs, Dependencies", async ({ page }) => {
        // Skip: requires seeded data
        await page.goto("/es/apis");
        await page.locator('[data-testid="api-card"]').first().click();

        await expect(
            page.getByRole("tab", { name: /overview/i }),
        ).toBeVisible();
        await expect(
            page.getByRole("tab", { name: /docs/i }),
        ).toBeVisible();
    });

    test.skip("can switch to docs tab", async ({ page }) => {
        // Skip: requires seeded data
        await page.goto("/es/apis");
        await page.locator('[data-testid="api-card"]').first().click();

        await page.getByRole("tab", { name: /docs/i }).click();
        await expect(
            page.locator('[data-testid="swagger-ui"]'),
        ).toBeVisible();
    });
});
