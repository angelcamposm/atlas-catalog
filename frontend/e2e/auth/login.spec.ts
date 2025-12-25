import { test, expect } from "../fixtures";

test.describe("Authentication", () => {
    test.describe("Login Page", () => {
        test("should display login form", async ({ page }) => {
            await page.goto("/es/login");

            // Verify login page elements are visible
            // The login page may use translated text "Iniciar sesion" (without accent)
            await expect(
                page.getByRole("heading", {
                    name: /iniciar sesi[oó]n|login|sign in/i,
                })
            ).toBeVisible();
            // Use locator by id which is more reliable
            await expect(page.locator("#email")).toBeVisible();
            await expect(page.locator("#password")).toBeVisible();
            await expect(
                page.getByRole("button", {
                    name: /iniciar sesi[oó]n|login|sign in|entrar/i,
                })
            ).toBeVisible();
        });

        test.skip("should show validation errors for empty form", async ({
            page,
        }) => {
            // Skip: Current form uses HTML5 required validation which doesn't show custom errors
            await page.goto("/es/login");

            // Try to submit empty form
            await page
                .getByRole("button", {
                    name: /iniciar sesión|login|sign in|entrar/i,
                })
                .click();

            // Should show validation errors
            await expect(page.getByText(/requerido|required/i)).toBeVisible();
        });

        test.skip("should show error for invalid credentials", async ({
            page,
        }) => {
            // Skip: Auth backend is not fully implemented yet
            await page.goto("/es/login");

            // Fill in invalid credentials
            await page.locator("#email").fill("invalid@example.com");
            await page.locator("#password").fill("wrongpassword");
            await page
                .getByRole("button", {
                    name: /iniciar sesión|login|sign in|entrar/i,
                })
                .click();

            // Should show error message
            await expect(
                page.getByText(/credenciales|invalid|error/i)
            ).toBeVisible({ timeout: 10000 });
        });

        test.skip("should redirect to dashboard after successful login", async ({
            page,
        }) => {
            // Skip until auth backend is ready
            await page.goto("/es/login");

            // Fill in valid credentials
            await page.locator("#email").fill("admin@example.com");
            await page.locator("#password").fill("password");
            await page
                .getByRole("button", {
                    name: /iniciar sesión|login|sign in|entrar/i,
                })
                .click();

            // Should redirect to dashboard
            await expect(page).toHaveURL(/\/es\/dashboard/);
            await expect(
                page.getByRole("heading", { name: /dashboard/i })
            ).toBeVisible();
        });
    });

    test.describe("Protected Routes", () => {
        test.skip("should redirect unauthenticated users to login", async ({
            page,
        }) => {
            // Skip until auth is implemented
            await page.goto("/es/dashboard");

            // Should redirect to login
            await expect(page).toHaveURL(/\/es\/login/);
        });

        test.skip("should allow access to authenticated users", async ({
            authenticatedPage,
        }) => {
            // Skip until auth is implemented
            await authenticatedPage.goto("/es/dashboard");

            // Should stay on dashboard
            await expect(authenticatedPage).toHaveURL(/\/es\/dashboard/);
        });
    });

    test.describe("Logout", () => {
        test.skip("should logout user and redirect to login", async ({
            authenticatedPage,
        }) => {
            // Skip until auth is implemented
            await authenticatedPage.goto("/es/dashboard");

            // Click logout button
            await authenticatedPage
                .getByRole("button", { name: /logout|cerrar sesión|salir/i })
                .click();

            // Should redirect to login
            await expect(authenticatedPage).toHaveURL(/\/es\/login/);
        });
    });
});
