/**
 * Unit tests for UserDetail component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDetail } from "@/components/organization/UserDetail";
import type { User } from "@/types/api";

const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    email_verified_at: "2024-06-01T00:00:00Z",
    is_enabled: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("UserDetail", () => {
    describe("Rendering", () => {
        it("should render user name", () => {
            render(<UserDetail user={createMockUser({ name: "John Doe" })} />);
            expect(screen.getByText("John Doe")).toBeInTheDocument();
        });

        it("should render user email", () => {
            render(
                <UserDetail
                    user={createMockUser({ email: "john@example.com" })}
                />,
            );
            expect(screen.getByText("john@example.com")).toBeInTheDocument();
        });

        it("should render Active status for enabled user", () => {
            render(<UserDetail user={createMockUser({ is_enabled: true })} />);
            expect(screen.getByText("Active")).toBeInTheDocument();
        });

        it("should render Inactive status for disabled user", () => {
            render(<UserDetail user={createMockUser({ is_enabled: false })} />);
            expect(screen.getByText("Inactive")).toBeInTheDocument();
        });

        it("should render Verified text when email is verified", () => {
            render(
                <UserDetail
                    user={createMockUser({
                        email_verified_at: "2024-01-01T00:00:00Z",
                    })}
                />,
            );
            expect(screen.getByText("Verified")).toBeInTheDocument();
        });

        it("should render Not verified text when email is not verified", () => {
            render(
                <UserDetail
                    user={createMockUser({ email_verified_at: null })}
                />,
            );
            expect(screen.getByText("Not verified")).toBeInTheDocument();
        });

        it("should render initials avatar", () => {
            render(<UserDetail user={createMockUser({ name: "Alice Brown" })} />);
            expect(screen.getByText("A")).toBeInTheDocument();
        });

        it("should render ? avatar when name is null", () => {
            render(<UserDetail user={createMockUser({ name: null })} />);
            expect(screen.getByText("?")).toBeInTheDocument();
        });
    });
});
