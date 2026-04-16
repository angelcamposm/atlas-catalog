/**
 * Tests for the <MetaBlock> component.
 *
 * MetaBlock shows audit metadata: created/updated timestamps and author names.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MetaBlock } from "@/components/ui/MetaBlock";

describe("MetaBlock", () => {
    describe("Created at", () => {
        it("renders createdAt when provided", () => {
            render(<MetaBlock createdAt="2024-01-15T10:30:00Z" />);
            expect(screen.getByText(/jan 15, 2024/i)).toBeInTheDocument();
        });

        it("does not render the created section when createdAt is absent", () => {
            render(<MetaBlock />);
            expect(screen.queryByText(/created/i)).not.toBeInTheDocument();
        });
    });

    describe("Updated at", () => {
        it("renders updatedAt when provided", () => {
            render(<MetaBlock updatedAt="2024-06-20T08:00:00Z" />);
            expect(screen.getByText(/jun 20, 2024/i)).toBeInTheDocument();
        });

        it("does not render the updated section when updatedAt is absent", () => {
            render(<MetaBlock />);
            expect(screen.queryByText(/updated/i)).not.toBeInTheDocument();
        });
    });

    describe("Author names", () => {
        it("renders createdBy when provided alongside createdAt", () => {
            render(
                <MetaBlock
                    createdAt="2024-01-15T10:30:00Z"
                    createdBy="Alice"
                />,
            );
            expect(screen.getByText("Alice")).toBeInTheDocument();
        });

        it("renders updatedBy when provided alongside updatedAt", () => {
            render(
                <MetaBlock updatedAt="2024-06-20T08:00:00Z" updatedBy="Bob" />,
            );
            expect(screen.getByText("Bob")).toBeInTheDocument();
        });

        it("does not render author text when not provided", () => {
            render(<MetaBlock createdAt="2024-01-15T10:30:00Z" />);
            // No phantom names shown
            expect(screen.queryByText("Alice")).not.toBeInTheDocument();
        });
    });

    describe("Both fields present", () => {
        it("renders both created and updated blocks together", () => {
            render(
                <MetaBlock
                    createdAt="2024-01-15T10:30:00Z"
                    createdBy="Alice"
                    updatedAt="2024-06-20T08:00:00Z"
                    updatedBy="Bob"
                />,
            );

            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("Bob")).toBeInTheDocument();
            expect(screen.getByText(/jan 15, 2024/i)).toBeInTheDocument();
            expect(screen.getByText(/jun 20, 2024/i)).toBeInTheDocument();
        });
    });

    describe("Empty render", () => {
        it("renders nothing visible when no props are provided", () => {
            const { container } = render(<MetaBlock />);
            expect(container.firstChild).toBeNull();
        });
    });
});
