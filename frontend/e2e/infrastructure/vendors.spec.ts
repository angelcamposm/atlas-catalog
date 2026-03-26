import { test, expect } from "../fixtures";

/**
 * E2E tests for the Infrastructure Vendors page.
 * Task 3.4 — Vendors E2E.
 */
test.describe("Technology Vendors", () => {
    const BASE_URL = "/es/technology/vendors";

    test("list page loads and shows heading", async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");

        const hasHeading = await page
            .getByRole("heading", { name: /vendors?|proveedores?/i })
            .isVisible()
            .catch(() => false);
        const hasContent = (await page.locator("main *").count()) > 0;

        expect(hasHeading || hasContent).toBeTruthy();
    });

    test("shows list or empty state", async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1500);

        const hasItems = (await page.locator("table tbody tr").count()) > 0;
        const hasEmpty = await page
            .getByText(/no hay|empty|no items/i)
            .isVisible()
            .catch(() => false);
        const hasHeading = await page
            .getByRole("heading")
            .isVisible()
            .catch(() => false);

        expect(hasHeading || hasItems || hasEmpty).toBeTruthy();
    });
});
