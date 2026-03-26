import { test, expect } from "../fixtures";

/**
 * E2E tests for the API Docs page.
 */
test.describe("API Docs", () => {
    test("api docs page loads", async ({ page }) => {
        await page.goto("/es/documentation/api");
        await page.waitForLoadState("networkidle");

        const hasContent =
            (await page.locator("main, [data-testid], h1, h2").count()) > 0;
        expect(hasContent).toBeTruthy();
    });
});
