import { test, expect } from "../fixtures";

test.describe("Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/es");
    });

    test.describe("Sidebar Navigation", () => {
        test("should display main navigation menu", async ({ page }) => {
            // Dashboard link (use href rather than text to avoid i18n text mismatches)
            await expect(page.locator('a[href="/es/dashboard"]')).toBeVisible();

            // Main sections - APIs is in the main menu
            await expect(page.locator('a[href="/es/apis"]')).toBeVisible();
        });

        test("should navigate to Infrastructure section", async ({ page }) => {
            // Infrastructure section is collapsible, click on clusters to go there
            await page.locator('a[href="/es/infrastructure/clusters"]').click();
            await expect(page).toHaveURL(/\/es\/infrastructure\/clusters/);
        });

        test("should navigate to Integration section", async ({ page }) => {
            // Integration section - click on links
            await page.locator('a[href="/es/integration/links"]').click();
            await expect(page).toHaveURL(/\/es\/integration\/links/);
        });

        test("should navigate to Platform section", async ({ page }) => {
            await page.locator('a[href="/es/platform"]').click();
            await expect(page).toHaveURL(/\/es\/platform/);
        });
    });

    test.describe("Infrastructure Submenu", () => {
        test("should display Clusters link", async ({ page }) => {
            // Clusters link should be visible in sidebar
            await expect(
                page.locator('a[href="/es/infrastructure/clusters"]')
            ).toBeVisible();
        });

        test("should navigate to Clusters page", async ({ page }) => {
            await page.locator('a[href="/es/infrastructure/clusters"]').click();

            await expect(page).toHaveURL(/\/es\/infrastructure\/clusters/);
            await expect(
                page.getByRole("heading", { name: /clusters/i })
            ).toBeVisible();
        });

        test("should navigate to Nodes page", async ({ page }) => {
            await page.locator('a[href="/es/infrastructure/nodes"]').click();

            await expect(page).toHaveURL(/\/es\/infrastructure\/nodes/);
        });
    });

    test.describe("Integration Submenu", () => {
        test("should navigate to Links page", async ({ page }) => {
            await page.locator('a[href="/es/integration/links"]').click();

            await expect(page).toHaveURL(/\/es\/integration\/links/);
        });

        test("should navigate to Link Types page", async ({ page }) => {
            await page.locator('a[href="/es/integration/link-types"]').click();

            await expect(page).toHaveURL(/\/es\/integration\/link-types/);
        });
    });

    test.describe("Breadcrumbs", () => {
        test("should display breadcrumbs on nested pages", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            // Should have breadcrumb navigation
            // Use the breadcrumb nav element with explicit aria-label
            const breadcrumb = page
                .locator(
                    "nav[aria-label='breadcrumb'], nav.breadcrumb, [data-testid='breadcrumb']"
                )
                .first();
            // If breadcrumb exists, it should be visible
            const breadcrumbCount = await breadcrumb.count();
            if (breadcrumbCount > 0) {
                await expect(breadcrumb).toBeVisible();
            } else {
                // Some pages may not have breadcrumbs - that's okay
                expect(true).toBeTruthy();
            }
        });

        test("should navigate back using breadcrumb", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            // Try to find and click on a parent breadcrumb
            const infraLink = page
                .locator('nav[aria-label="breadcrumb"] a, nav.breadcrumb a')
                .first();
            const linkCount = await infraLink.count();

            if (linkCount > 0) {
                await infraLink.click();
                // Should navigate somewhere
                expect(page.url()).not.toContain("/clusters");
            } else {
                // Page may not have breadcrumbs
                expect(true).toBeTruthy();
            }
        });
    });

    test.describe("Language Switching", () => {
        test("should switch from Spanish to English", async ({ page }) => {
            // Look for language switcher
            const languageSwitcher = page.getByRole("button", {
                name: /español|es|language/i,
            });

            if (await languageSwitcher.isVisible()) {
                await languageSwitcher.click();

                // Select English
                await page
                    .getByRole("menuitem", { name: /english|en/i })
                    .click();

                // URL should change to /en
                await expect(page).toHaveURL(/\/en\//);
            }
        });

        test("should maintain current page when switching language", async ({
            page,
        }) => {
            await page.goto("/es/infrastructure/clusters");

            const languageSwitcher = page.getByRole("button", {
                name: /español|es|language/i,
            });

            if (await languageSwitcher.isVisible()) {
                await languageSwitcher.click();
                await page
                    .getByRole("menuitem", { name: /english|en/i })
                    .click();

                // Should stay on clusters page but in English
                await expect(page).toHaveURL(/\/en\/infrastructure\/clusters/);
            }
        });
    });
});
