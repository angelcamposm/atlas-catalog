/**
 * Unit tests for TeamMemberList component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TeamMemberList } from "@/components/teams/TeamMemberList";
import type { User } from "@/types/api";

const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    email_verified_at: "2024-01-01T00:00:00Z",
    is_enabled: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("TeamMemberList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of members", () => {
            const members = [
                createMockUser({ id: 1, name: "Alice Smith" }),
                createMockUser({
                    id: 2,
                    name: "Bob Jones",
                    email: "bob@example.com",
                }),
            ];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("Alice Smith")).toBeInTheDocument();
            expect(screen.getByText("Bob Jones")).toBeInTheDocument();
        });

        it("should render member email", () => {
            const members = [createMockUser({ email: "alice@example.com" })];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("alice@example.com")).toBeInTheDocument();
        });

        it("should render initials avatar from member name", () => {
            const members = [createMockUser({ name: "Charlie Brown" })];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("C")).toBeInTheDocument();
        });

        it("should render ? avatar when name is null", () => {
            const members = [createMockUser({ name: null })];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("?")).toBeInTheDocument();
        });

        it("should render Active badge for enabled members", () => {
            const members = [createMockUser({ is_enabled: true })];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("Activo")).toBeInTheDocument();
        });

        it("should render Inactivo badge for disabled members", () => {
            const members = [createMockUser({ is_enabled: false })];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("Inactivo")).toBeInTheDocument();
        });

        it("should render member count in header", () => {
            const members = [
                createMockUser({ id: 1 }),
                createMockUser({ id: 2, email: "b@example.com" }),
            ];

            render(<TeamMemberList members={members} />);

            expect(screen.getByText("2")).toBeInTheDocument();
        });
    });

    describe("Empty state", () => {
        it("should render empty state message when no members", () => {
            render(<TeamMemberList members={[]} />);

            expect(
                screen.getByText("No hay miembros asignados"),
            ).toBeInTheDocument();
        });

        it("should not render member count badge when members list is empty", () => {
            render(<TeamMemberList members={[]} />);

            expect(screen.queryByText("0")).not.toBeInTheDocument();
        });
    });

    describe("onViewMember callback", () => {
        it("should call onViewMember when a member row is clicked", () => {
            const onViewMember = jest.fn();
            const members = [createMockUser({ id: 7 })];

            render(
                <TeamMemberList
                    members={members}
                    onViewMember={onViewMember}
                />,
            );

            fireEvent.click(screen.getByText("Alice Smith"));

            expect(onViewMember).toHaveBeenCalledWith(7);
        });

        it("should not throw when onViewMember is not provided", () => {
            const members = [createMockUser()];

            expect(() => {
                render(<TeamMemberList members={members} />);
                fireEvent.click(screen.getByText("Alice Smith"));
            }).not.toThrow();
        });
    });
});
