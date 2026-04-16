/**
 * Tests for the <PermissionGate> component.
 *
 * PermissionGate conditionally renders its children depending on
 * the current auth state. It intentionally delegates the actual
 * "is this user allowed?" check to a caller-supplied predicate so
 * domain code stays decoupled from how permissions are modelled
 * on the backend.
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { PermissionGate } from "@/components/ui/permission-gate";
import { AuthContext } from "@/lib/auth-context";
import type { AuthUser } from "@/lib/api/auth";

function renderWithUser(
    ui: React.ReactElement,
    user: AuthUser | null,
    loading = false,
) {
    return render(
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login: jest.fn(),
                logout: jest.fn(),
            }}
        >
            {ui}
        </AuthContext.Provider>,
    );
}

const admin: AuthUser = {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
};

const viewer: AuthUser = {
    id: 2,
    name: "Viewer",
    email: "viewer@example.com",
    role: "viewer",
};

describe("PermissionGate", () => {
    it("renders children when the predicate allows the user", () => {
        renderWithUser(
            <PermissionGate allow={(u) => u?.role === "admin"}>
                <span>secret</span>
            </PermissionGate>,
            admin,
        );

        expect(screen.getByText("secret")).toBeInTheDocument();
    });

    it("renders the fallback when the predicate rejects the user", () => {
        renderWithUser(
            <PermissionGate
                allow={(u) => u?.role === "admin"}
                fallback={<span>denied</span>}
            >
                <span>secret</span>
            </PermissionGate>,
            viewer,
        );

        expect(screen.queryByText("secret")).not.toBeInTheDocument();
        expect(screen.getByText("denied")).toBeInTheDocument();
    });

    it("renders nothing when denied and no fallback is given", () => {
        const { container } = renderWithUser(
            <PermissionGate allow={() => false}>
                <span>secret</span>
            </PermissionGate>,
            viewer,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("denies access when no user is present", () => {
        renderWithUser(
            <PermissionGate allow={() => true} fallback={<span>anon</span>}>
                <span>secret</span>
            </PermissionGate>,
            null,
        );

        expect(screen.getByText("anon")).toBeInTheDocument();
    });

    it("shows a loading placeholder while auth is resolving", () => {
        renderWithUser(
            <PermissionGate
                allow={() => true}
                loadingFallback={<span>loading</span>}
            >
                <span>secret</span>
            </PermissionGate>,
            null,
            true,
        );

        expect(screen.getByText("loading")).toBeInTheDocument();
    });
});
