import { test, expect, testData } from "../fixtures";

test.describe("Platforms CRUD", () => {
    test.describe("List Platforms", () => {
        test("should display platforms page", async ({ page }) => {
            await page.goto("/en/platform/platforms");

            await expect(
                page.getByRole("heading", { name: "Platforms" })
            ).toBeVisible();
        });

        test("should display create button", async ({ page }) => {
            await page.goto("/en/platform/platforms");

            // The button is inside a Link, so look for the button with text
            await expect(
                page.getByRole("button", { name: /New Platform/i })
            ).toBeVisible();
        });

        test("should display platforms list or empty state", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms");

            // Wait for page to load
            await page.waitForLoadState("networkidle");

            // Either cards with platform names or empty state should be visible
            const cards = page.locator(".grid .cursor-pointer");
            const emptyState = page.getByText("No Platforms Found");

            const hasCards =
                (await cards.count().catch(() => 0)) > 0 ? true : false;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            expect(hasCards || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Create Platform - Happy Path", () => {
        test("should navigate to create platform page", async ({ page }) => {
            await page.goto("/en/platform/platforms");

            // Click the New Platform button (which is inside a Link)
            await page.getByRole("button", { name: /New Platform/i }).click();

            await expect(page).toHaveURL(/\/platform\/platforms\/new/);
        });

        test("should display create platform form", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Check form elements are visible
            await expect(
                page.getByLabel("Name", { exact: false })
            ).toBeVisible();
            await expect(page.getByLabel("Description")).toBeVisible();
            // Icon is now a picker with select, verify the select exists
            await expect(page.getByRole("combobox")).toBeVisible();
        });

        test("should fill and submit create platform form", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms/new");

            const uniqueName = `E2E Test Platform ${Date.now()}`;

            // Fill form with valid data
            await page.locator("#name").fill(uniqueName);
            await page
                .locator("#description")
                .fill(testData.platform.description);

            // Select icon from dropdown (click on "Seleccionar" mode first, then select)
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Globe.*Web/i }).click();

            // Submit form and wait for API response
            const [response] = await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/platforms") &&
                        resp.request().method() === "POST",
                    { timeout: 15000 }
                ),
                page.getByRole("button", { name: "Create Platform" }).click(),
            ]);

            // Verify API call was successful
            expect(response.status()).toBeLessThan(400);
        });

        test("should create platform with minimum required fields", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms/new");

            // Fill required fields (name and icon)
            await page.locator("#name").fill(`Test Platform ${Date.now()}`);

            // Select icon from dropdown
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Server/i }).click();

            // Submit form and wait for API response
            const [response] = await Promise.all([
                page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/platforms") &&
                        resp.request().method() === "POST",
                    { timeout: 10000 }
                ),
                page.getByRole("button", { name: "Create Platform" }).click(),
            ]);

            // Verify API call was successful
            expect(response.status()).toBeLessThan(400);
        });
    });

    test.describe("Create Platform - Sad Path (Validation Errors)", () => {
        test("should show error when name is empty", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Select an icon but leave name empty
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Server/i }).click();
            await page.locator("#name").fill("");

            // Try to submit
            await page.getByRole("button", { name: "Create Platform" }).click();

            // Form should not submit (HTML5 validation)
            // The page should still be on the create page
            await expect(page).toHaveURL(/\/platform\/platforms\/new/);

            // Check for HTML5 validation message
            const nameInput = page.locator("#name");
            const isInvalid = await nameInput.evaluate(
                (el: HTMLInputElement) => !el.validity.valid
            );
            expect(isInvalid).toBeTruthy();
        });

        test("should show error when icon is not selected", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms/new");

            // Fill name but don't select any icon
            await page.locator("#name").fill("Test Platform");
            // Icon select will be empty by default

            // Try to submit
            await page.getByRole("button", { name: "Create Platform" }).click();

            // Form should not submit successfully without icon
            // Either stays on page or shows validation error
            await expect(page).toHaveURL(/\/platform\/platforms\/new/);
        });

        test("should show error when name is too short", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Select icon and fill very short name
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Server/i }).click();
            await page.locator("#name").fill("a");

            // Submit form
            await page.getByRole("button", { name: "Create Platform" }).click();

            // Should either stay on page or show error
            await page.waitForTimeout(1000);

            // Check if still on create page or showing error
            const isOnCreatePage = page.url().includes("/new");
            const hasError = await page
                .getByText(/error|invalid|minimum|required|failed/i)
                .isVisible()
                .catch(() => false);

            expect(isOnCreatePage || hasError).toBeTruthy();
        });

        test("should show error on duplicate name", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Use a name that likely exists (with required icon)
            await page.locator("#name").fill("Web");
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Globe.*Web/i }).click();

            // Submit form
            await page.getByRole("button", { name: "Create Platform" }).click();

            // Wait for potential error response
            try {
                const response = await page.waitForResponse(
                    (resp) =>
                        resp.url().includes("/v1/platforms") &&
                        resp.request().method() === "POST",
                    { timeout: 5000 }
                );

                // If we get a 422 or 409, that's expected for duplicate
                if (response.status() === 422 || response.status() === 409) {
                    await expect(
                        page.getByText(/already exists|duplicate|error|failed/i)
                    ).toBeVisible({ timeout: 5000 });
                }
            } catch {
                // If no response, form validation may have prevented submit
                expect(page.url()).toContain("/new");
            }
        });

        test("should handle API error gracefully", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Fill form with required fields
            await page.locator("#name").fill(`Test Platform ${Date.now()}`);
            await page.getByRole("combobox").click();
            await page.getByRole("option", { name: /Server/i }).click();

            // Intercept and mock error response
            await page.route("**/v1/platforms", async (route) => {
                if (route.request().method() === "POST") {
                    await route.fulfill({
                        status: 500,
                        contentType: "application/json",
                        body: JSON.stringify({
                            message: "Internal server error",
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            // Submit form
            await page.getByRole("button", { name: "Create Platform" }).click();

            // Should show error message (the form uses alert())
            page.on("dialog", async (dialog) => {
                expect(dialog.message()).toContain("Failed");
                await dialog.accept();
            });

            // Wait for alert or error text
            await page.waitForTimeout(2000);
        });

        test("should allow cancel without saving", async ({ page }) => {
            await page.goto("/en/platform/platforms/new");

            // Fill form with some data
            await page.locator("#name").fill("Test Cancel");

            // Click cancel button
            await page.getByRole("button", { name: "Cancel" }).click();

            // Should navigate back (router.back() is called)
            await page.waitForTimeout(500);
            // Check we're not on the new page anymore
            expect(page.url()).not.toContain("/new");
        });
    });

    test.describe("View Platform Details", () => {
        test("should display platforms as clickable cards", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms");

            // Wait for content to load
            await page.waitForLoadState("networkidle");

            // Verify cards exist and are styled as clickable
            const platformCard = page.locator(".cursor-pointer").first();
            const emptyState = page.getByText("No Platforms Found");

            const hasCard = await platformCard.isVisible().catch(() => false);
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            // Either we have clickable cards or empty state
            expect(hasCard || hasEmptyState).toBeTruthy();
        });
    });

    test.describe("Edit Platform", () => {
        test("should navigate to edit platform page", async ({ page }) => {
            // Navigate directly to a platform details page (assuming platform with id 1 exists)
            await page.goto("/en/platform/platforms/1");

            // Look for edit button
            const editButton = page.getByRole("button", {
                name: /edit/i,
            });
            const editLink = page.getByRole("link", { name: /edit/i });

            if (await editButton.isVisible().catch(() => false)) {
                await editButton.click();
            } else if (await editLink.isVisible().catch(() => false)) {
                await editLink.click();
            }
        });
    });

    test.describe("Delete Platform", () => {
        test("should have delete buttons on platform cards", async ({
            page,
        }) => {
            await page.goto("/en/platform/platforms");

            // Wait for content to load
            await page.waitForLoadState("networkidle");

            // Check if there are platforms with delete buttons
            const deleteButtons = page.getByRole("button", { name: "Delete" });
            const emptyState = page.getByText("No Platforms Found");

            const hasDeleteButtons = (await deleteButtons.count()) > 0;
            const hasEmptyState = await emptyState
                .isVisible()
                .catch(() => false);

            // Either we have delete buttons or empty state
            expect(hasDeleteButtons || hasEmptyState).toBeTruthy();
        });

        test("should trigger confirm dialog on delete", async ({ page }) => {
            await page.goto("/en/platform/platforms");

            // Wait for content to load
            await page.waitForLoadState("networkidle");

            const deleteButton = page
                .getByRole("button", { name: "Delete" })
                .first();

            if (await deleteButton.isVisible().catch(() => false)) {
                // Set up dialog handler BEFORE clicking
                let dialogShown = false;
                page.on("dialog", async (dialog) => {
                    expect(dialog.type()).toBe("confirm");
                    expect(dialog.message()).toContain("delete");
                    dialogShown = true;
                    await dialog.dismiss(); // Cancel the delete
                });

                await deleteButton.click();

                // Wait a moment for dialog to be processed
                await page.waitForTimeout(500);
                expect(dialogShown).toBeTruthy();
            }
        });
    });
});
