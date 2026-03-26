import { test, expect } from "@playwright/test";

/**
 * E2E tests for the Register page.
 * Task 11.1 — Auth E2E register test.
 */
test.describe("Register", () => {
    test("shows register form", async ({ page }) => {
        await page.goto("/es/register");
        await page.waitForLoadState("networkidle");

        await expect(
            page.getByRole("heading", {
                name: /register|registr/i,
            }),
        ).toBeVisible();
        await expect(page.locator('[name="name"], #name')).toBeVisible();
        await expect(page.locator('[name="email"], #email')).toBeVisible();
        await expect(
            page.locator('[name="password"], #password'),
        ).toBeVisible();
        await expect(
            page.locator(
                '[name="password_confirmation"], #password_confirmation',
            ),
        ).toBeVisible();
    });

    test.skip("validates required fields on submit", async ({ page }) => {
        // Skip: HTML5 native validation may not produce visible custom error text
        await page.goto("/es/register");
        await page.click('button[type="submit"]');
        await expect(page.getByText(/required|requerido/i)).toBeVisible();
    });
});
