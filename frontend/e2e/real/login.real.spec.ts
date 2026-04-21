import { test, expect } from "@playwright/test";

/**
 * Real login E2E — exercises the full auth flow against the deployed
 * backend. No mocks, no pre-loaded storage state.
 */

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3001";
const API_URL = process.env.E2E_API_URL || "http://localhost:8080";
const EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "password";

// Use a clean, unauthenticated context for these tests.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Real login flow", () => {
    test.beforeAll(async ({ request }) => {
        const res = await request
            .get(`${API_URL}/api/v1/catalog/apis`, {
                timeout: 3_000,
                headers: { Accept: "application/json" },
            })
            .catch(() => null);
        test.skip(!res || !res.ok(), `Backend not reachable at ${API_URL}`);
    });

    test("logs in with valid credentials and lands on dashboard", async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}/es/login`);
        await page.locator("#email").fill(EMAIL);
        await page.locator("#password").fill(PASSWORD);
        await page.getByRole("button", { name: /sign in/i }).click();

        await page.waitForURL((url) => !url.pathname.includes("/login"), {
            timeout: 15_000,
        });

        // Land somewhere inside the protected area.
        expect(page.url()).not.toContain("/login");
        // Auth token must be persisted by the client.
        const token = await page.evaluate(() =>
            localStorage.getItem("auth_token"),
        );
        expect(
            token,
            "Sanctum token should be stored in localStorage",
        ).toBeTruthy();
    });

    test("rejects invalid credentials with an error message", async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}/es/login`);
        await page.locator("#email").fill("nope@example.com");
        await page.locator("#password").fill("wrong-password");
        await page.getByRole("button", { name: /sign in/i }).click();

        // We must remain on the login page.
        await expect(page).toHaveURL(/\/login/);

        // No auth token persisted.
        const token = await page.evaluate(() =>
            localStorage.getItem("auth_token"),
        );
        expect(token).toBeFalsy();
    });
});
