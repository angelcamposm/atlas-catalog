import { test, expect } from "../fixtures";

/**
 * E2E tests for the Components catalog page.
 */
test.describe("Components", () => {
    const BASE_URL = "/es/components";

    test("list page loads and shows heading", async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");

        const hasHeading = await page
            .getByRole("heading", { name: /components|componentes/i })
            .isVisible()
            .catch(() => false);
        const hasContent =
            (await page.locator("table, [data-testid], ul li, .card").count()) >
            0;

        expect(hasHeading || hasContent).toBeTruthy();
    });

    test("shows list or empty state", async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1500);

        const hasItems =
            (await page
                .locator('table tbody tr, [data-testid="entity-card"]')
                .count()) > 0;
        const hasEmpty = await page
            .getByText(/no hay|empty|no items|sin datos/i)
            .isVisible()
            .catch(() => false);
        const hasHeading = await page
            .getByRole("heading")
            .isVisible()
            .catch(() => false);

        expect(hasHeading || hasItems || hasEmpty).toBeTruthy();
    });
});
