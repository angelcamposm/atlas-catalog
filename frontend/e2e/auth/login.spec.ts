import { test, expect } from "../fixtures";

test.describe("Authentication", () => {
    test.describe("Login Page", () => {
        test("should display login form", async ({ page }) => {
            await page.goto("/es/login");

            // Verify login page elements are visible
            await expect(
                page.getByRole("heading", { name: /iniciar sesión|login/i })
            ).toBeVisible();
            await expect(page.getByLabel(/email|correo/i)).toBeVisible();
            await expect(page.getByLabel(/password|contraseña/i)).toBeVisible();
            await expect(
                page.getByRole("button", {
                    name: /iniciar sesión|login|entrar/i,
                })
            ).toBeVisible();
        });

        test("should show validation errors for empty form", async ({
            page,
        }) => {
            await page.goto("/es/login");

            // Try to submit empty form
            await page
                .getByRole("button", { name: /iniciar sesión|login|entrar/i })
                .click();

            // Should show validation errors
            await expect(page.getByText(/requerido|required/i)).toBeVisible();
        });

        test("should show error for invalid credentials", async ({ page }) => {
            await page.goto("/es/login");

            // Fill in invalid credentials
            await page.getByLabel(/email|correo/i).fill("invalid@example.com");
            await page.getByLabel(/password|contraseña/i).fill("wrongpassword");
            await page
                .getByRole("button", { name: /iniciar sesión|login|entrar/i })
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
            await page.getByLabel(/email|correo/i).fill("admin@example.com");
            await page.getByLabel(/password|contraseña/i).fill("password");
            await page
                .getByRole("button", { name: /iniciar sesión|login|entrar/i })
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
