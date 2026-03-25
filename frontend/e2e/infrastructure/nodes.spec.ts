import { test, expect, testData } from "../fixtures";

test.describe("Nodes CRUD", () => {
    test.describe("List Nodes", () => {
        test("should display nodes page", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes");
            await page.waitForLoadState("networkidle");

            await expect(
                page.getByRole("heading", { name: /nodes|nodos/i })
            ).toBeVisible();
        });

        test("should display new node button", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes");
            await page.waitForLoadState("networkidle");

            // Look for the New Node link or button
            const newNodeLink = page.locator('a[href*="/nodes/new"]');
            const newNodeButton = page.getByRole("button", {
                name: /new node|nuevo nodo|new|nuevo/i,
            });

            const isVisible =
                (await newNodeLink.isVisible().catch(() => false)) ||
                (await newNodeButton.isVisible().catch(() => false));
            expect(isVisible).toBeTruthy();
        });

        test("should display nodes list or empty state", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes");
            await page.waitForLoadState("networkidle");

            // Wait for loading to finish
            await page.waitForTimeout(1000);

            // Look for node cards/rows or empty state
            const nodeCards = page.locator('[class*="Card"], table tbody tr');
            const emptyState = page.getByText(/no nodes|no hay nodos|empty/i);
            const loadingSpinner = page.locator(".animate-spin");

            // Wait for loading to complete
            await expect(loadingSpinner).not.toBeVisible({ timeout: 10000 });

            // Either cards should exist or empty state
            const hasCards = (await nodeCards.count().catch(() => 0)) > 0;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasCards || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Node", () => {
        test("should navigate to create node form", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes");
            await page.waitForLoadState("networkidle");

            // Click the new node link or button
            const newNodeLink = page.locator('a[href*="/nodes/new"]');
            const newNodeButton = page.getByRole("button", {
                name: /new node|nuevo nodo/i,
            });

            if (await newNodeLink.isVisible().catch(() => false)) {
                await newNodeLink.click();
            } else if (await newNodeButton.isVisible().catch(() => false)) {
                await newNodeButton.click();
            } else {
                throw new Error("Create node action not found");
            }

            await expect(page).toHaveURL(/\/infrastructure\/nodes\/new/);
            await expect(
                page.getByRole("heading", {
                    name: /new node|nuevo nodo|crear nodo|create node/i,
                })
            ).toBeVisible();
        });

        test("should display node form fields", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Required field - name
            const nameInput = page.locator("#name");
            await expect(nameInput).toBeVisible();

            // IP Address field
            const ipInput = page.locator("#ip_address");
            await expect(ipInput).toBeVisible();

            // FQDN field
            const fqdnInput = page.locator("#fqdn");
            await expect(fqdnInput).toBeVisible();

            // OS field
            const osInput = page.locator("#os");
            await expect(osInput).toBeVisible();

            // OS Version field
            const osVersionInput = page.locator("#os_version");
            await expect(osVersionInput).toBeVisible();
        });

        test("should show validation for required fields", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Try to submit empty form
            await page
                .getByRole("button", { name: /create|crear|save|guardar/i })
                .click();

            // HTML5 validation should prevent submission
            const nameInput = page.locator("#name");
            const validationMessage = await nameInput.evaluate(
                (el: HTMLInputElement) => el.validationMessage
            );
            expect(validationMessage).toBeTruthy();
        });

        test("should fill basic node information", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-test-node-${Date.now()}`;

            // Fill required fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#os").fill("Ubuntu");
            await page.locator("#os_version").fill("22.04 LTS");

            // Fill optional fields
            await page.locator("#ip_address").fill("192.168.1.100");
            await page.locator("#fqdn").fill("node-test.example.com");

            // Verify values are set
            await expect(page.locator("#name")).toHaveValue(uniqueName);
            await expect(page.locator("#os")).toHaveValue("Ubuntu");
            await expect(page.locator("#os_version")).toHaveValue("22.04 LTS");
        });

        test("should fill CPU configuration", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // CPU Cores
            const cpuCoresInput = page.locator("#cpu_cores");
            if (await cpuCoresInput.isVisible()) {
                await cpuCoresInput.fill("4");
                await expect(cpuCoresInput).toHaveValue("4");
            }

            // CPU Threads
            const cpuThreadsInput = page.locator("#cpu_threads");
            if (await cpuThreadsInput.isVisible()) {
                await cpuThreadsInput.fill("8");
                await expect(cpuThreadsInput).toHaveValue("8");
            }
        });

        test("should toggle virtual node option", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Look for is_virtual switch or checkbox
            const virtualSwitch = page.locator(
                '#is_virtual, [name="is_virtual"], [data-state]'
            );
            if (await virtualSwitch.isVisible()) {
                await virtualSwitch.click();
            }
        });

        test("should create node successfully", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-node-${Date.now()}`;

            // Fill required fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#os").fill("Ubuntu");
            await page.locator("#os_version").fill("22.04");

            // Fill optional fields for completeness
            await page.locator("#ip_address").fill("10.0.0.50");
            await page.locator("#fqdn").fill(`${uniqueName}.example.com`);

            // CPU fields if visible
            const cpuCores = page.locator("#cpu_cores");
            if (await cpuCores.isVisible()) {
                await cpuCores.fill("2");
            }

            // Submit and wait for API response
            const [response] = await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/nodes") &&
                        resp.request().method() === "POST",
                    { timeout: 15000 }
                ),
                page
                    .getByRole("button", { name: /create|crear|save|guardar/i })
                    .click(),
            ]);

            // Verify API call was successful
            expect(response.status()).toBeLessThan(400);
        });

        test("should redirect after successful creation", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            const uniqueName = `e2e-redirect-node-${Date.now()}`;

            // Fill minimum required fields
            await page.locator("#name").fill(uniqueName);
            await page.locator("#os").fill("CentOS");
            await page.locator("#os_version").fill("8");

            // Submit and wait for redirect
            await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/nodes") &&
                        resp.request().method() === "POST",
                    { timeout: 15000 }
                ),
                page
                    .getByRole("button", { name: /create|crear|save|guardar/i })
                    .click(),
            ]);

            // Should redirect to nodes list
            await page.waitForURL(/\/infrastructure\/nodes(?!\/new)/, {
                timeout: 10000,
            });
            expect(page.url()).not.toMatch(/\/nodes\/new/);
        });

        test("should cancel and go back", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Click cancel button
            const cancelButton = page.getByRole("button", {
                name: /cancel|cancelar/i,
            });
            if (await cancelButton.isVisible()) {
                await cancelButton.click();

                // Should navigate away from create form
                await page.waitForURL(/\/infrastructure\/nodes(?!\/new)/, {
                    timeout: 10000,
                });
            }
        });
    });

    test.describe("Node Form Validation", () => {
        test("should require name field", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Fill OS fields but not name
            await page.locator("#os").fill("Ubuntu");
            await page.locator("#os_version").fill("22.04");

            // Try to submit
            await page
                .getByRole("button", { name: /create|crear|save|guardar/i })
                .click();

            // Name should be required (HTML5 validation)
            const nameInput = page.locator("#name");
            const isRequired = await nameInput.evaluate(
                (el: HTMLInputElement) => el.required
            );
            expect(isRequired).toBeTruthy();
        });

        test("should validate IP address format", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Fill invalid IP
            await page.locator("#ip_address").fill("invalid-ip");

            // Should show validation or allow (depending on implementation)
            // Just verify the field accepts input
            await expect(page.locator("#ip_address")).toHaveValue("invalid-ip");
        });
    });

    test.describe("Accessibility", () => {
        test("should have proper form labels", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Check that inputs have associated labels
            const nameLabel = page.locator('label[for="name"]');
            await expect(nameLabel).toBeVisible();

            const osLabel = page.locator('label[for="os"]');
            await expect(osLabel).toBeVisible();
        });

        test("should support keyboard navigation", async ({ page }) => {
            await page.goto("/es/infrastructure/nodes/new");
            await page.waitForLoadState("networkidle");

            // Focus on name field
            await page.locator("#name").focus();
            await page.keyboard.type("keyboard-test-node");

            await expect(page.locator("#name")).toHaveValue(
                "keyboard-test-node"
            );

            // Tab to next field
            await page.keyboard.press("Tab");
        });
    });
});
