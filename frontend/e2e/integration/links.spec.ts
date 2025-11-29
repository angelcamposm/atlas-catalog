import { test, expect, testData } from "../fixtures";

test.describe("Links CRUD", () => {
    test.describe("List Links", () => {
        test("should display links page", async ({ page }) => {
            await page.goto("/es/integration/links");

            await expect(
                page.getByRole("heading", { name: /links|enlaces/i })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/integration/links");

            await expect(
                page.getByRole("link", { name: /crear|create|nuevo|new/i })
            ).toBeVisible();
        });

        test("should display links table or empty state", async ({ page }) => {
            await page.goto("/es/integration/links");

            // Either table or empty state should be visible
            const table = page.getByRole("table");
            const emptyState = page.getByText(
                /no hay|no links|empty|sin datos/i
            );

            const hasTable = await table.isVisible().catch(() => false);
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasTable || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Link", () => {
        test("should navigate to create link form", async ({ page }) => {
            await page.goto("/es/integration/links");

            await page
                .getByRole("link", { name: /crear|create|nuevo|new/i })
                .click();

            await expect(page).toHaveURL(/\/es\/integration\/links\/new/);
        });

        test("should display link form fields", async ({ page }) => {
            await page.goto("/es/integration/links/new");

            // Should have name field
            await expect(page.getByLabel(/nombre|name/i)).toBeVisible();
        });

        test("should show validation errors for empty required fields", async ({
            page,
        }) => {
            await page.goto("/es/integration/links/new");

            // Try to submit empty form
            await page
                .getByRole("button", { name: /guardar|save|crear|create/i })
                .click();

            // Should show validation error
            await expect(
                page.getByText(/requerido|required|obligatorio/i)
            ).toBeVisible();
        });
    });

    test.describe("Link Types", () => {
        test("should display link types page", async ({ page }) => {
            await page.goto("/es/integration/link-types");

            await expect(
                page.getByRole("heading", {
                    name: /link types|tipos de enlace/i,
                })
            ).toBeVisible();
        });

        test("should navigate to create link type form", async ({ page }) => {
            await page.goto("/es/integration/link-types");

            await page
                .getByRole("link", { name: /crear|create|nuevo|new/i })
                .click();

            await expect(page).toHaveURL(
                /\/es\/integration\/link-types\/create/
            );
        });
    });
});

test.describe("APIs CRUD", () => {
    test.describe("List APIs", () => {
        test("should display APIs page", async ({ page }) => {
            await page.goto("/es/apis");

            await expect(
                page.getByRole("heading", { name: /apis/i })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/es/apis");

            await expect(
                page.getByRole("link", { name: /crear|create|nuevo|new/i })
            ).toBeVisible();
        });
    });

    test.describe("Create API", () => {
        test("should navigate to create API form", async ({ page }) => {
            await page.goto("/es/apis");

            await page
                .getByRole("link", { name: /crear|create|nuevo|new/i })
                .click();

            // Should navigate to create page
            await expect(page).toHaveURL(/\/es\/apis\/(new|create)/);
        });
    });
});
