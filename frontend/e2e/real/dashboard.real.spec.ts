import { test, expect } from "./_real-test";

/**
 * Real dashboard E2E — verifies the dashboard widgets render against the
 * deployed backend. Re-uses the storage state captured by global-setup.
 */

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3001";

test.describe("Dashboard (real backend)", () => {
    test("loads and shows the heading", async ({ page }) => {
        await page.goto(`${BASE_URL}/es/dashboard`);
        await expect(
            page.getByRole("heading", { name: /^dashboard$/i }),
        ).toBeVisible();
    });

    test("renders the recent activity widget", async ({ page }) => {
        await page.goto(`${BASE_URL}/es/dashboard`);
        await expect(page.getByText(/^Recent Activity$/i)).toBeVisible({
            timeout: 10_000,
        });
    });

    test("renders the lifecycle and type distribution charts", async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}/es/dashboard`);
        await expect(page.getByText(/APIs by Lifecycle/i)).toBeVisible({
            timeout: 10_000,
        });
        await expect(page.getByText(/APIs by Type/i)).toBeVisible({
            timeout: 10_000,
        });

        // Wait for both widgets to leave their loading skeleton.
        await expect(page.getByLabel("Loading chart")).toHaveCount(0, {
            timeout: 15_000,
        });

        // Either real data is shown (chart container) or the empty-state.
        const chartCount = await page
            .locator(".recharts-responsive-container")
            .count();
        const emptyCount = await page
            .getByText(/no apis to display/i)
            .count();

        expect(chartCount + emptyCount).toBeGreaterThan(0);
    });
});
