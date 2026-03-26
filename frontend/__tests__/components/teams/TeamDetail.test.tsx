/**
 * Unit tests for TeamDetail component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { TeamDetail } from "@/components/teams/TeamDetail";
import type { Group } from "@/types/api";

const createMockGroup = (overrides: Partial<Group> = {}): Group => ({
    id: 1,
    name: "engineering",
    label: "Engineering Team",
    description: "Core engineering team",
    email: "eng@example.com",
    icon: "server",
    parent_id: null,
    type_id: null,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("TeamDetail", () => {
    describe("Rendering", () => {
        it("should render team label", () => {
            render(<TeamDetail team={createMockGroup()} />);

            expect(screen.getByText("Engineering Team")).toBeInTheDocument();
        });

        it("should render team name as @slug", () => {
            render(<TeamDetail team={createMockGroup()} />);

            expect(screen.getByText("@engineering")).toBeInTheDocument();
        });

        it("should render team description", () => {
            render(<TeamDetail team={createMockGroup()} />);

            expect(
                screen.getByText("Core engineering team"),
            ).toBeInTheDocument();
        });

        it("should render team email", () => {
            render(<TeamDetail team={createMockGroup()} />);

            expect(screen.getByText("eng@example.com")).toBeInTheDocument();
        });

        it("should render team ID", () => {
            render(<TeamDetail team={createMockGroup({ id: 42 })} />);

            expect(screen.getByText("42")).toBeInTheDocument();
        });

        it("should render avatar initial from label", () => {
            render(
                <TeamDetail team={createMockGroup({ label: "Zeta Squad" })} />,
            );

            expect(screen.getByText("Z")).toBeInTheDocument();
        });

        it("should render avatar initial from name when label is null", () => {
            render(
                <TeamDetail
                    team={createMockGroup({ name: "platform", label: null })}
                />,
            );

            expect(screen.getByText("P")).toBeInTheDocument();
        });

        it("should not render email section when email is null", () => {
            render(<TeamDetail team={createMockGroup({ email: null })} />);

            expect(
                screen.queryByText("eng@example.com"),
            ).not.toBeInTheDocument();
        });

        it("should not render description when null", () => {
            render(
                <TeamDetail team={createMockGroup({ description: null })} />,
            );

            expect(
                screen.queryByText("Core engineering team"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Optional membersCount", () => {
        it("should render members count when provided", () => {
            render(<TeamDetail team={createMockGroup()} membersCount={5} />);

            expect(screen.getByText("5")).toBeInTheDocument();
        });

        it("should not render member count section when not provided", () => {
            render(<TeamDetail team={createMockGroup()} />);

            // Badge with "0" should not appear (no membersCount prop)
            expect(screen.queryByText("0")).not.toBeInTheDocument();
        });
    });
});
