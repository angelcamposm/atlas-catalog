import { test as base, expect, request } from "@playwright/test";
import fs from "fs";
import { ADMIN_STORAGE_STATE } from "../fixtures";

/**
 * Test suite that exercises the *real* deployed stack (frontend + backend
 * + database). No network mocking. Tests will skip themselves at runtime
 * if the backend is not reachable.
 */

const API_URL = process.env.E2E_API_URL || "http://localhost:8080";

/**
 * Per-test helper that ensures the backend is up. Skips the test when
 * unreachable so smoke runs (E2E_REQUIRE_BACKEND=0) don't fail.
 */
async function requireBackend(): Promise<void> {
    const ctx = await request.newContext();
    let ok = false;
    try {
        const res = await ctx.get(`${API_URL}/api/v1/catalog/apis`, {
            timeout: 3_000,
            headers: { Accept: "application/json" },
        });
        ok = res.ok();
    } catch {
        ok = false;
    } finally {
        await ctx.dispose();
    }
    if (!ok) {
        // eslint-disable-next-line no-console
        console.warn(`Skipping: backend not reachable at ${API_URL}`);
    }
    expect(ok, `Backend not reachable at ${API_URL}`).toBe(true);
}

/**
 * Authenticated test using the storage state captured by global-setup.
 * Skips when no real session was captured (smoke mode).
 */
export const test = base.extend({
    storageState: ADMIN_STORAGE_STATE,
});

test.beforeEach(async () => {
    await requireBackend();
    // Bail out if the saved storage state is empty (smoke mode).
    if (fs.existsSync(ADMIN_STORAGE_STATE)) {
        const raw = fs.readFileSync(ADMIN_STORAGE_STATE, "utf-8");
        const parsed = JSON.parse(raw) as {
            cookies?: unknown[];
            origins?: unknown[];
        };
        const empty =
            (parsed.cookies?.length ?? 0) === 0 &&
            (parsed.origins?.length ?? 0) === 0;
        test.skip(empty, "No authenticated storage state available.");
    }
});

export { expect };
