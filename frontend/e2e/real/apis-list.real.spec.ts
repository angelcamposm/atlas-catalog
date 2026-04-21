import { test, expect } from "./_real-test";

/**
 * Real APIs listing E2E — verifies the catalog page fetches and renders
 * data from the deployed backend.
 */

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3001";
const API_URL = process.env.E2E_API_URL || "http://localhost:8080";

test.describe("APIs catalog (real backend)", () => {
    test("renders the page header and toolbar", async ({ page }) => {
        await page.goto(`${BASE_URL}/es/apis`);
        await expect(
            page.getByRole("heading", { name: /^APIs$/ }),
        ).toBeVisible();
        await expect(page.getByPlaceholder(/buscar apis/i)).toBeVisible();
    });

    test("backend listing endpoint returns a paginated envelope", async ({
        request,
    }) => {
        const res = await request.get(`${API_URL}/api/v1/catalog/apis`, {
            headers: { Accept: "application/json" },
        });
        expect(res.ok()).toBe(true);
        const json = (await res.json()) as {
            data: unknown[];
            meta: { total: number; current_page: number; per_page: number };
            links: { first: string; last: string };
        };
        expect(Array.isArray(json.data)).toBe(true);
        expect(typeof json.meta.total).toBe("number");
        expect(typeof json.meta.per_page).toBe("number");
    });

    test("UI displays either the data table or the empty state", async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}/es/apis`);
        // Wait for the resource hook to settle.
        await page.waitForLoadState("networkidle");

        const hasTable = await page
            .locator("table")
            .first()
            .isVisible()
            .catch(() => false);
        const hasEmpty = await page
            .getByText(/sin resultados/i)
            .first()
            .isVisible()
            .catch(() => false);

        expect(hasTable || hasEmpty).toBe(true);
    });

    test("search state is reflected in the URL and survives a reload", async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}/es/apis`);
        await page.waitForLoadState("networkidle");

        const searchBox = page.getByPlaceholder(/buscar apis/i);
        await searchBox.fill("atlas");

        // URL must include the search term.
        await expect(page).toHaveURL(/[?&]search=atlas/, { timeout: 5_000 });

        // A reload must restore the same search value.
        await page.reload();
        await expect(page.getByPlaceholder(/buscar apis/i)).toHaveValue(
            "atlas",
        );
    });
});
