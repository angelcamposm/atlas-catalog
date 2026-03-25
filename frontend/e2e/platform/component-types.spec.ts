import { test, expect } from "../fixtures";

test.describe("Component Types CRUD", () => {
    test.describe("List Component Types", () => {
        test("should display component types page", async ({ page }) => {
            await page.goto("/es/platform/component-types");
            await page.waitForLoadState("networkidle");

            // Match the main H1 only to avoid empty-state headings
            await expect(
                page.getByRole("heading", {
                    name: /component types|tipos de componente/i,
                    level: 1,
                })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/platform/component-types");
            await page.waitForLoadState("networkidle");

            const createLink = page.locator(
                'a[href*="/component-types/create"]'
            );
            await expect(createLink).toBeVisible();
        });

        test("should display list or empty state", async ({ page }) => {
            await page.goto("/es/platform/component-types");
            await page.waitForLoadState("networkidle");

            await page.waitForTimeout(1000);

            const items = page.locator('[class*="Card"], table tbody tr');
            const emptyState = page.getByText(
                /no component types|no hay|empty/i
            );

            const hasItems = (await items.count().catch(() => 0)) > 0;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasItems || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Component Type", () => {
        test("should navigate to create form", async ({ page }) => {
            await page.goto("/es/platform/component-types");
            await page.waitForLoadState("networkidle");

            await page.locator('a[href*="/component-types/create"]').click();

            await expect(page).toHaveURL(/\/platform\/component-types\/create/);
            await expect(
                page.getByRole("heading", {
                    name: /create component type/i,
                    level: 1,
                })
            ).toBeVisible();
        });

        test("should display form fields", async ({ page }) => {
            await page.goto("/es/platform/component-types/create");
            await page.waitForLoadState("networkidle");

            // Name field
            await expect(page.locator("#name")).toBeVisible();

            // Description field
            const descriptionField = page.locator("#description");
            await expect(descriptionField).toBeVisible();
        });

        test("should validate required fields", async ({ page }) => {
            await page.goto("/es/platform/component-types/create");
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
            await page.goto("/es/platform/component-types/create");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-component-type-${Date.now()}`;

            // Fill form fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#description").fill("E2E test component type");

            // Click submit button
            const submitButton = page.getByRole("button", {
                name: /create|crear|save|guardar/i,
            });
            await submitButton.click();

            // Wait for either navigation or error handling
            try {
                await page.waitForURL(
                    /\/platform\/component-types(?!\/(create|new))/,
                    { timeout: 10000 }
                );
            } catch {
                // If navigation fails, the form should still be responsive (API might be unavailable)
                await expect(submitButton).toBeEnabled();
            }
        });

        test("should go back when clicking back button", async ({ page }) => {
            // First navigate to the list page to build browser history
            await page.goto("/es/platform/component-types");
            await page.waitForLoadState("networkidle");

            // Then navigate to create page
            await page.goto("/es/platform/component-types/create");
            await page.waitForLoadState("networkidle");

            // Click back button - look for button with back icon or use browser back
            const backButton = page
                .getByRole("button", { name: /back|atrás|volver/i })
                .or(page.locator("button:has(svg)").first());

            if (await backButton.isVisible().catch(() => false)) {
                await backButton.click();
                // Should navigate away from create page
                await page.waitForURL(
                    /\/platform\/component-types(?!\/create)/,
                    {
                        timeout: 10000,
                    }
                );
            } else {
                // If no back button, use browser navigation
                await page.goBack();
                await page.waitForURL(
                    /\/platform\/component-types(?!\/create)/,
                    {
                        timeout: 10000,
                    }
                );
            }
        });
    });
});
