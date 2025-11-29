import { test as base, Page } from "@playwright/test";

/**
 * Custom fixtures for Atlas Catalog E2E tests
 */

// Extend base test with custom fixtures
export const test = base.extend<{
    authenticatedPage: Page;
}>({
    // Fixture for authenticated page
    authenticatedPage: async ({ page }, use) => {
        // TODO: Implement actual authentication when auth is ready
        // For now, just navigate to the app
        await page.goto("/es");
        await use(page);
    },
});

export { expect } from "@playwright/test";

/**
 * Test data generators
 */
export const testData = {
    /**
     * Generate a unique name for test entities
     */
    uniqueName: (prefix: string) => `${prefix}-${Date.now()}`,

    /**
     * Sample API data
     */
    api: {
        name: () => testData.uniqueName("test-api"),
        displayName: "Test API",
        description: "API created by E2E test",
        version: "1.0.0",
    },

    /**
     * Sample Cluster data
     */
    cluster: {
        name: () => testData.uniqueName("test-cluster"),
        displayName: "Test Cluster",
        apiUrl: "https://api.test.example.com",
        version: "1.28.0",
    },

    /**
     * Sample Link data
     */
    link: {
        name: () => testData.uniqueName("test-link"),
        description: "Link created by E2E test",
    },
};

/**
 * Common page helpers
 */
export const helpers = {
    /**
     * Wait for page to be fully loaded
     */
    waitForPageLoad: async (page: Page) => {
        await page.waitForLoadState("networkidle");
    },

    /**
     * Wait for toast notification
     */
    waitForToast: async (page: Page, text?: string) => {
        const toastSelector = text
            ? `[role="alert"]:has-text("${text}")`
            : '[role="alert"]';
        await page.waitForSelector(toastSelector, { timeout: 5000 });
    },

    /**
     * Navigate using sidebar
     */
    navigateViaSidebar: async (page: Page, menuItems: string[]) => {
        for (const item of menuItems) {
            await page.getByRole("link", { name: item }).click();
        }
    },
};
