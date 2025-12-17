import { test, expect } from "../fixtures";

test.describe("Link Types CRUD", () => {
    test.describe("List Link Types", () => {
        test("should display link types page", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            await expect(
                page.getByRole("heading", {
                    name: /link types|tipos de enlace/i,
                })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            const createLink = page.locator('a[href*="/link-types/create"]');
            await expect(createLink).toBeVisible();
        });

        test("should display list or empty state", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            await page.waitForTimeout(1000);

            const items = page.locator('[class*="Card"], table tbody tr');
            const emptyState = page.getByText(/no link types|no hay|empty/i);

            const hasItems = (await items.count().catch(() => 0)) > 0;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasItems || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Link Type", () => {
        test("should navigate to create form", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            await page.locator('a[href*="/link-types/create"]').click();

            await expect(page).toHaveURL(/\/integration\/link-types\/create/);
            await expect(
                page.getByRole("heading", {
                    name: /create link type|crear tipo de enlace/i,
                })
            ).toBeVisible();
        });

        test("should display form fields", async ({ page }) => {
            await page.goto("/es/integration/link-types/create");
            await page.waitForLoadState("networkidle");

            // Name field
            await expect(page.locator("#name")).toBeVisible();

            // Description field
            const descriptionField = page.locator("#description");
            await expect(descriptionField).toBeVisible();
        });

        test("should validate required fields", async ({ page }) => {
            await page.goto("/es/integration/link-types/create");
            await page.waitForLoadState("networkidle");

            // Try to submit empty form
            await page
                .getByRole("button", { name: /create|crear|save|guardar/i })
                .click();

            // Name should be required
            const nameInput = page.locator("#name");
            const isRequired = await nameInput.evaluate(
                (el: HTMLInputElement) => el.required
            );
            expect(isRequired).toBeTruthy();
        });

        test("should fill and submit form", async ({ page }) => {
            await page.goto("/es/integration/link-types/create");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-link-type-${Date.now()}`;

            // Fill form fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#description").fill("E2E test link type");

            // Submit and wait for response
            const [response] = await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/link-types") &&
                        resp.request().method() === "POST",
                    { timeout: 15000 }
                ),
                page
                    .getByRole("button", { name: /create|crear|save|guardar/i })
                    .click(),
            ]);

            expect(response.status()).toBeLessThan(400);
        });

        test("should go back when clicking back button", async ({ page }) => {
            await page.goto("/es/integration/link-types/create");
            await page.waitForLoadState("networkidle");

            // Click back button
            await page.getByRole("button").first().click();

            // Should navigate away
            await page.waitForURL(/\/integration\/link-types(?!\/create)/, {
                timeout: 10000,
            });
        });
    });
});
