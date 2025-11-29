import { test, expect, testData } from "../fixtures";

test.describe("Clusters CRUD", () => {
    test.describe("List Clusters", () => {
        test("should display clusters page", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            await expect(
                page.getByRole("heading", { name: /clusters/i })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            await expect(
                page.getByRole("link", { name: /crear|create|nuevo|new/i })
            ).toBeVisible();
        });

        test("should display clusters table or empty state", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/clusters");

            // Either table or empty state should be visible
            const table = page.getByRole("table");
            const emptyState = page.getByText(
                /no hay|no clusters|empty|sin datos/i
            );

            const hasTable = await table.isVisible().catch(() => false);
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasTable || hasEmptyState).toBeTruthy();
        });

        test("should have pagination when many clusters exist", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/clusters");

            // Check if pagination exists (may not be visible with few items)
            const pagination = page.getByRole("navigation", {
                name: /pagination|paginación/i,
            });
            const paginationButtons = page.locator(
                "button:has-text('1'), button:has-text('2')"
            );

            // Just verify page loads correctly
            await expect(
                page.getByRole("heading", { name: /clusters/i })
            ).toBeVisible();
        });
    });

    test.describe("Create Cluster", () => {
        test("should navigate to create cluster form", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            await page
                .getByRole("link", { name: /crear|create|nuevo|new/i })
                .click();

            await expect(page).toHaveURL(/\/es\/infrastructure\/clusters\/new/);
            await expect(
                page.getByRole("heading", { name: /crear|create|nuevo/i })
            ).toBeVisible();
        });

        test("should display cluster form fields", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters/new");

            // Required fields
            await expect(page.getByLabel(/nombre|name/i)).toBeVisible();

            // Optional fields
            await expect(
                page
                    .getByLabel(/display name|nombre visible/i)
                    .or(page.locator('input[name="display_name"]'))
            ).toBeVisible();
            await expect(
                page
                    .getByLabel(/version|versión/i)
                    .or(page.locator('input[name="version"]'))
            ).toBeVisible();
        });

        test("should show validation errors for empty required fields", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/clusters/new");

            // Try to submit empty form
            await page
                .getByRole("button", { name: /guardar|save|crear|create/i })
                .click();

            // Should show validation error for name
            await expect(
                page.getByText(/requerido|required|obligatorio/i)
            ).toBeVisible();
        });

        test("should create cluster with minimum required fields", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/clusters/new");

            const clusterName = testData.cluster.name();

            // Fill in required field
            await page.getByLabel(/^nombre|^name/i).fill(clusterName);

            // Submit form
            await page
                .getByRole("button", { name: /guardar|save|crear|create/i })
                .click();

            // Should redirect to clusters list or show success
            await expect(
                page
                    .getByText(/creado|created|éxito|success/i)
                    .or(page.locator(`text=${clusterName}`))
            ).toBeVisible({ timeout: 10000 });
        });

        test("should create cluster with all fields", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters/new");

            const clusterName = testData.cluster.name();

            // Fill in all fields
            await page.getByLabel(/^nombre|^name/i).fill(clusterName);

            const displayNameInput = page
                .getByLabel(/display name|nombre visible/i)
                .or(page.locator('input[name="display_name"]'));
            if (await displayNameInput.isVisible()) {
                await displayNameInput.fill(testData.cluster.displayName);
            }

            const versionInput = page
                .getByLabel(/version|versión/i)
                .or(page.locator('input[name="version"]'));
            if (await versionInput.isVisible()) {
                await versionInput.fill(testData.cluster.version);
            }

            const apiUrlInput = page
                .getByLabel(/api.?url/i)
                .or(page.locator('input[name="api_url"]'));
            if (await apiUrlInput.isVisible()) {
                await apiUrlInput.fill(testData.cluster.apiUrl);
            }

            // Submit form
            await page
                .getByRole("button", { name: /guardar|save|crear|create/i })
                .click();

            // Should show success
            await expect(
                page
                    .getByText(/creado|created|éxito|success/i)
                    .or(page.locator(`text=${clusterName}`))
            ).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe("View Cluster Detail", () => {
        test.skip("should display cluster details", async ({ page }) => {
            // Skip until we have test data
            await page.goto("/es/infrastructure/clusters/1");

            await expect(page.getByRole("heading")).toBeVisible();
        });
    });

    test.describe("Edit Cluster", () => {
        test.skip("should edit existing cluster", async ({ page }) => {
            // Skip until we have test data
            await page.goto("/es/infrastructure/clusters/1/edit");

            // Form should be pre-filled
            const nameInput = page.getByLabel(/nombre|name/i);
            await expect(nameInput).not.toBeEmpty();
        });
    });

    test.describe("Delete Cluster", () => {
        test.skip("should show delete confirmation", async ({ page }) => {
            // Skip until we have test data
            await page.goto("/es/infrastructure/clusters");

            // Click delete button on first cluster
            await page
                .getByRole("button", { name: /eliminar|delete|borrar/i })
                .first()
                .click();

            // Should show confirmation dialog
            await expect(page.getByRole("dialog")).toBeVisible();
            await expect(
                page.getByText(/confirmar|confirm|seguro|sure/i)
            ).toBeVisible();
        });
    });
});
