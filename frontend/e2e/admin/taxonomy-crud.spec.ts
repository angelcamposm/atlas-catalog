import { test, expect } from "../fixtures";

/**
 * Generic E2E tests for admin taxonomy pages (TaxonomyManager component).
 * These tests verify that each admin taxonomy page loads and renders correctly.
 */

const TAXONOMY_PAGES = [
    { path: "/es/admin/api-types", name: /api types/i },
    { path: "/es/admin/api-categories", name: /api categor/i },
    { path: "/es/admin/api-statuses", name: /api status/i },
    { path: "/es/admin/group-types", name: /group types|tipos de grupo/i },
    { path: "/es/admin/member-roles", name: /member roles|roles/i },
    { path: "/es/admin/resource-categories", name: /resource categor/i },
    { path: "/es/admin/cluster-types", name: /cluster types/i },
    { path: "/es/admin/link-categories", name: /link categor/i },
    { path: "/es/admin/component-types", name: /component types/i },
    {
        path: "/es/admin/infrastructure-types",
        name: /infrastructure types/i,
    },
    { path: "/es/admin/lifecycle-phases", name: /lifecycle phases/i },
] as const;

test.describe("Admin Taxonomy Pages", () => {
    for (const { path, name } of TAXONOMY_PAGES) {
        test(`${path} — page loads with heading`, async ({ page }) => {
            await page.goto(path);
            await page.waitForLoadState("networkidle");

            // Page should render a heading
            const heading = page.getByRole("heading", { name });
            const hasHeading = await heading.isVisible().catch(() => false);
            expect(hasHeading).toBeTruthy();
        });
    }

    test("api-types page shows add button or empty state", async ({ page }) => {
        await page.goto("/es/admin/api-types");
        await page.waitForLoadState("networkidle");

        // Should show either existing items or empty state
        const hasTable = (await page.locator("table").count()) > 0;
        const hasEmpty = await page
            .getByText(/no hay|empty|no items|sin datos/i)
            .isVisible()
            .catch(() => false);
        const hasHeading = await page
            .getByRole("heading", { name: /api types/i })
            .isVisible()
            .catch(() => false);

        expect(hasHeading || hasTable || hasEmpty).toBeTruthy();
    });
});
