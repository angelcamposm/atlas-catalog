import { test, expect } from "../fixtures";

test.describe("Cluster Types CRUD", () => {
    test.describe("List Cluster Types", () => {
        test("should display cluster types page", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types");
            await page.waitForLoadState("networkidle");

            await expect(
                page.getByRole("heading", {
                    name: /cluster types|tipos de cluster/i,
                })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types");
            await page.waitForLoadState("networkidle");

            const createLink = page.locator('a[href*="/cluster-types/create"]');
            await expect(createLink).toBeVisible();
        });

        test("should display list or empty state", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types");
            await page.waitForLoadState("networkidle");

            await page.waitForTimeout(1000);

            const items = page.locator('[class*="Card"], table tbody tr');
            const emptyState = page.getByText(/no cluster types|no hay|empty/i);

            const hasItems = (await items.count().catch(() => 0)) > 0;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasItems || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Cluster Type", () => {
        test("should navigate to create form", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types");
            await page.waitForLoadState("networkidle");

            await page.locator('a[href*="/cluster-types/create"]').click();

            await expect(page).toHaveURL(
                /\/infrastructure\/cluster-types\/create/
            );
            await expect(
                page.getByRole("heading", { name: /create cluster type/i })
            ).toBeVisible();
        });

        test("should display form fields", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types/create");
            await page.waitForLoadState("networkidle");

            // Name field
            await expect(page.locator("#name")).toBeVisible();

            // Description field
            const descriptionField = page.locator("#description");
            await expect(descriptionField).toBeVisible();

            // Licensing model field
            const licensingField = page.locator("#licensing_model");
            await expect(licensingField).toBeVisible();
        });

        test("should validate required fields", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types/create");
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
            await page.goto("/es/infrastructure/cluster-types/create");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-cluster-type-${Date.now()}`;

            // Fill form fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#description").fill("E2E test cluster type");

            // Select licensing model
            const licensingSelect = page.locator("#licensing_model");
            if (await licensingSelect.isVisible()) {
                await licensingSelect.selectOption("open_source");
            }

            // Submit and wait for response
            const [response] = await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/cluster-types") &&
                        resp.request().method() === "POST",
                    { timeout: 15000 }
                ),
                page
                    .getByRole("button", { name: /create|crear|save|guardar/i })
                    .click(),
            ]);

            expect(response.status()).toBeLessThan(400);
        });

        test("should allow selecting different licensing models", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/cluster-types/create");
            await page.waitForLoadState("networkidle");

            const licensingSelect = page.locator("#licensing_model");
            if (await licensingSelect.isVisible()) {
                // Test open_source option
                await licensingSelect.selectOption("open_source");
                await expect(licensingSelect).toHaveValue("open_source");

                // Test commercial option
                await licensingSelect.selectOption("commercial");
                await expect(licensingSelect).toHaveValue("commercial");

                // Test hybrid option
                await licensingSelect.selectOption("hybrid");
                await expect(licensingSelect).toHaveValue("hybrid");
            }
        });

        test("should go back when clicking back button", async ({ page }) => {
            await page.goto("/es/infrastructure/cluster-types/create");
            await page.waitForLoadState("networkidle");

            // Click back button
            await page.getByRole("button").first().click();

            // Should navigate away
            await page.waitForURL(
                /\/infrastructure\/cluster-types(?!\/create)/,
                {
                    timeout: 10000,
                }
            );
        });
    });
});
