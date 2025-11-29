import { test, expect } from "../fixtures";

test.describe("Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/es");
    });

    test.describe("Sidebar Navigation", () => {
        test("should display main navigation menu", async ({ page }) => {
            // Dashboard link
            await expect(
                page.getByRole("link", { name: /dashboard/i })
            ).toBeVisible();

            // Main sections
            await expect(
                page.getByRole("link", {
                    name: /infraestructura|infrastructure/i,
                })
            ).toBeVisible();
            await expect(
                page.getByRole("link", { name: /integración|integration/i })
            ).toBeVisible();
            await expect(
                page.getByRole("link", { name: /plataforma|platform/i })
            ).toBeVisible();
        });

        test("should navigate to Infrastructure section", async ({ page }) => {
            await page
                .getByRole("link", { name: /infraestructura|infrastructure/i })
                .click();

            await expect(page).toHaveURL(/\/es\/infrastructure/);
        });

        test("should navigate to Integration section", async ({ page }) => {
            await page
                .getByRole("link", { name: /integración|integration/i })
                .click();

            await expect(page).toHaveURL(/\/es\/integration/);
        });

        test("should navigate to Platform section", async ({ page }) => {
            await page
                .getByRole("link", { name: /plataforma|platform/i })
                .click();

            await expect(page).toHaveURL(/\/es\/platform/);
        });
    });

    test.describe("Infrastructure Submenu", () => {
        test("should display Clusters link", async ({ page }) => {
            await page.goto("/es/infrastructure");

            await expect(
                page.getByRole("link", { name: /clusters/i })
            ).toBeVisible();
        });

        test("should navigate to Clusters page", async ({ page }) => {
            await page.goto("/es/infrastructure");
            await page.getByRole("link", { name: /clusters/i }).click();

            await expect(page).toHaveURL(/\/es\/infrastructure\/clusters/);
            await expect(
                page.getByRole("heading", { name: /clusters/i })
            ).toBeVisible();
        });

        test("should navigate to Nodes page", async ({ page }) => {
            await page.goto("/es/infrastructure");
            await page.getByRole("link", { name: /nodes|nodos/i }).click();

            await expect(page).toHaveURL(/\/es\/infrastructure\/nodes/);
        });
    });

    test.describe("Integration Submenu", () => {
        test("should navigate to Links page", async ({ page }) => {
            await page.goto("/es/integration");
            await page.getByRole("link", { name: /links|enlaces/i }).click();

            await expect(page).toHaveURL(/\/es\/integration\/links/);
        });

        test("should navigate to Link Types page", async ({ page }) => {
            await page.goto("/es/integration");
            await page
                .getByRole("link", { name: /link types|tipos de enlace/i })
                .click();

            await expect(page).toHaveURL(/\/es\/integration\/link-types/);
        });
    });

    test.describe("Breadcrumbs", () => {
        test("should display breadcrumbs on nested pages", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            // Should have breadcrumb navigation
            const breadcrumb = page.locator(
                "nav[aria-label='breadcrumb'], nav:has(a)"
            );
            await expect(breadcrumb).toBeVisible();
        });

        test("should navigate back using breadcrumb", async ({ page }) => {
            await page.goto("/es/infrastructure/clusters");

            // Click on parent breadcrumb
            const infraLink = page
                .getByRole("link", { name: /infraestructura|infrastructure/i })
                .first();
            await infraLink.click();

            await expect(page).toHaveURL(/\/es\/infrastructure/);
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
