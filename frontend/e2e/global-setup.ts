import { chromium, FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

import { ADMIN_STORAGE_STATE } from "./fixtures";

/**
 * Global setup — runs once before the entire E2E test suite.
 *
 * Responsibilities:
 * - Attempt to authenticate as an admin user and persist the browser
 *   storage state so individual tests don't need to log in.
 * - If the backend is unavailable (e.g., unit-only CI runs), skip auth
 *   silently — tests that require auth are already marked test.skip().
 *
 * Credentials are read from environment variables so they are never
 * hard-coded:
 *   E2E_ADMIN_EMAIL    (default: admin@example.com)
 *   E2E_ADMIN_PASSWORD (default: password)
 */
async function globalSetup(_config: FullConfig) {
    const authDir = path.dirname(ADMIN_STORAGE_STATE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const baseURL =
        process.env.E2E_BASE_URL || "http://localhost:3001";
    const email =
        process.env.E2E_ADMIN_EMAIL || "admin@example.com";
    const password =
        process.env.E2E_ADMIN_PASSWORD || "password";

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`${baseURL}/es/login`, { timeout: 15_000 });
        await page.waitForLoadState("networkidle", { timeout: 15_000 });

        await page.getByLabel(/email/i).fill(email);
        await page.getByLabel(/password|contraseña/i).fill(password);
        await page.getByRole("button", { name: /sign in|login|iniciar/i }).click();

        // Wait for redirect away from login page
        await page.waitForURL((url) => !url.pathname.includes("/login"), {
            timeout: 15_000,
        });

        await page.context().storageState({ path: ADMIN_STORAGE_STATE });
        console.log("[global-setup] Auth storage state saved.");
    } catch {
        // Backend unavailable or login failed — create an empty storage state
        // so tests that depend on it can still be skipped gracefully.
        fs.writeFileSync(
            ADMIN_STORAGE_STATE,
            JSON.stringify({ cookies: [], origins: [] })
        );
        console.warn(
            "[global-setup] Could not authenticate — empty storage state created."
        );
    } finally {
        await browser.close();
    }
}

export default globalSetup;
