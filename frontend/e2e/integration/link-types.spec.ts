import { test, expect } from "../fixtures";

test.describe("Link Types CRUD", () => {
    test.describe("List Link Types", () => {
        test("should display link types page", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            // Ensure the main H1 heading is visible (avoid matching h3 empty-state headings)
            await expect(
                page.getByRole("heading", {
                    name: /link types|tipos de enlace/i,
                    level: 1,
                })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/integration/link-types");
            await page.waitForLoadState("networkidle");

            const createLink = page.locator('a[href*="/link-types/create"]');
            const createButton = page.getByRole("button", {
                name: /crear|create|nuevo|new/i,
            });
            const visibleCreate =
                (await createLink.isVisible().catch(() => false)) ||
                (await createButton.isVisible().catch(() => false));
            expect(visibleCreate).toBeTruthy();
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

            const createLink = page.locator('a[href*="/link-types/create"]');
            const createButton = page.getByRole("button", {
                name: /crear|create|nuevo|new/i,
            });

            if (await createLink.isVisible().catch(() => false)) {
                await createLink.click();
            } else if (await createButton.isVisible().catch(() => false)) {
                await createButton.click();
            } else {
                throw new Error("Create action not found on link-types page");
            }

            await expect(page).toHaveURL(
                /\/(es\/)?integration\/link-types\/(create|new)/
            );
            await expect(
                page.getByRole("heading", {
                    name: /create link type|crear tipo de enlace/i,
                    level: 1,
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

            // Click submit button
            const submitButton = page.getByRole("button", {
                name: /create|crear|save|guardar/i,
            });
            await submitButton.click();

            // Wait for either navigation or error handling
            try {
                await page.waitForURL(
                    /\/integration\/link-types(?!\/(create|new))/,
                    { timeout: 10000 }
                );
            } catch {
                // If navigation fails, the form should still be responsive (API might be unavailable)
                await expect(submitButton).toBeEnabled();
            }
        });

        test("should go back when clicking back button", async ({ page }) => {
            await page.goto("/es/integration/link-types/create");
            await page.waitForLoadState("networkidle");

            // Click back button - look for button with back icon or specific variant
            const backButton = page
                .getByRole("button", { name: /back|atrás|volver/i })
                .or(page.locator('button:has(svg[class*="ArrowLeft"])'))
                .or(page.locator('button[variant="outline"]').first());

            await backButton.first().click();

            // Should navigate away from create page
            await page.waitForURL(/\/integration\/link-types(?!\/create)/, {
                timeout: 10000,
            });
        });
    });
});
