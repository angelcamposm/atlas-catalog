/**
 * Unit tests for UserList component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserList } from "@/components/organization/UserList";
import type { User } from "@/types/api";

const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    email_verified_at: "2024-01-01T00:00:00Z",
    is_enabled: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("UserList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of users", () => {
            const users = [
                createMockUser({ id: 1, name: "John Doe" }),
                createMockUser({
                    id: 2,
                    name: "Jane Smith",
                    email: "jane@example.com",
                }),
            ];

            render(<UserList users={users} />);

            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        });

        it("should render user email", () => {
            const users = [createMockUser({ email: "john@example.com" })];

            render(<UserList users={users} />);

            expect(screen.getByText("john@example.com")).toBeInTheDocument();
        });

        it("should render initials avatar", () => {
            const users = [createMockUser({ name: "Alice Brown" })];

            render(<UserList users={users} />);

            expect(screen.getByText("A")).toBeInTheDocument();
        });

        it("should render ? avatar for null name", () => {
            const users = [createMockUser({ name: null })];

            render(<UserList users={users} />);

            expect(screen.getByText("?")).toBeInTheDocument();
        });

        it("should render Active badge for enabled users", () => {
            const users = [createMockUser({ is_enabled: true })];

            render(<UserList users={users} />);

            expect(screen.getByText("Active")).toBeInTheDocument();
        });

        it("should render Inactive badge for disabled users", () => {
            const users = [createMockUser({ is_enabled: false })];

            render(<UserList users={users} />);

            expect(screen.getByText("Inactive")).toBeInTheDocument();
        });

        it("should show email verified indicator when verified", () => {
            const users = [
                createMockUser({ email_verified_at: "2024-01-01T00:00:00Z" }),
            ];

            render(<UserList users={users} />);

            expect(screen.getByTestId("email-verified-1")).toBeInTheDocument();
        });

        it("should show email unverified indicator when not verified", () => {
            const users = [createMockUser({ email_verified_at: null })];

            render(<UserList users={users} />);

            expect(
                screen.getByTestId("email-unverified-1"),
            ).toBeInTheDocument();
        });
    });

    describe("Empty state", () => {
        it("should render empty state when no users", () => {
            render(<UserList users={[]} />);

            expect(screen.getByText("No users found")).toBeInTheDocument();
        });
    });

    describe("onViewDetail callback", () => {
        it("should call onViewDetail when a row is clicked", () => {
            const onViewDetail = jest.fn();
            const users = [createMockUser({ id: 42 })];

            render(<UserList users={users} onViewDetail={onViewDetail} />);

            fireEvent.click(screen.getByText("John Doe"));

            expect(onViewDetail).toHaveBeenCalledWith(42);
        });

        it("should not throw when no onViewDetail provided", () => {
            const users = [createMockUser()];

            expect(() => {
                render(<UserList users={users} />);
                fireEvent.click(screen.getByText("John Doe"));
            }).not.toThrow();
        });
    });
});
