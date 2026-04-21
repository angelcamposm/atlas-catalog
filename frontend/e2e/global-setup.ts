import { chromium, FullConfig, request } from "@playwright/test";
import fs from "fs";
import path from "path";

import { ADMIN_STORAGE_STATE } from "./fixtures";

/**
 * Global setup — runs once before the entire E2E test suite.
 *
 * Responsibilities:
 * - Verify the backend API is reachable (fail fast otherwise).
 * - Authenticate as an admin user via the real login flow and persist
 *   the browser storage state so individual tests don't need to log in.
 *
 * Environment variables:
 *   E2E_BASE_URL          (default: http://localhost:3001)
 *   E2E_API_URL           (default: http://localhost:8080)
 *   E2E_ADMIN_EMAIL       (default: admin@example.com)
 *   E2E_ADMIN_PASSWORD    (default: password)
 *   E2E_REQUIRE_BACKEND   (default: "1"). Set to "0" to allow tests to
 *                          run with an empty storage state when the
 *                          backend is unreachable.
 */
async function globalSetup(_config: FullConfig) {
    const authDir = path.dirname(ADMIN_STORAGE_STATE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const baseURL = process.env.E2E_BASE_URL || "http://localhost:3001";
    const apiURL = process.env.E2E_API_URL || "http://localhost:8080";
    const email = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
    const password = process.env.E2E_ADMIN_PASSWORD || "password";
    const requireBackend = (process.env.E2E_REQUIRE_BACKEND ?? "1") !== "0";

    const api = await request.newContext();
    let backendUp = false;
    try {
        const res = await api.get(`${apiURL}/api/v1/catalog/apis`, {
            timeout: 5_000,
            headers: { Accept: "application/json" },
        });
        backendUp = res.ok();
    } catch {
        backendUp = false;
    } finally {
        await api.dispose();
    }

    if (!backendUp) {
        const msg = `[global-setup] Backend not reachable at ${apiURL}/api/v1/catalog/apis`;
        if (requireBackend) {
            throw new Error(
                `${msg}. Start the backend stack (e.g. \`docker compose -f docker-compose.full.yml up -d\`) ` +
                    `or set E2E_REQUIRE_BACKEND=0 to run smoke tests only.`,
            );
        }
        console.warn(`${msg} — running in smoke mode.`);
        fs.writeFileSync(
            ADMIN_STORAGE_STATE,
            JSON.stringify({ cookies: [], origins: [] }),
        );
        return;
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`${baseURL}/es/login`, { timeout: 15_000 });
        await page.waitForLoadState("networkidle", { timeout: 15_000 });

        await page.locator("#email").fill(email);
        await page.locator("#password").fill(password);
        await page.getByRole("button", { name: /sign in/i }).click();

        await page.waitForURL((url) => !url.pathname.includes("/login"), {
            timeout: 15_000,
        });

        await page.context().storageState({ path: ADMIN_STORAGE_STATE });
        console.log("[global-setup] Auth storage state saved.");
    } catch (err) {
        await browser.close();
        throw new Error(
            `[global-setup] Login flow failed for ${email} at ${baseURL}/es/login: ${
                (err as Error).message
            }`,
        );
    }
    await browser.close();
}

export default globalSetup;
