import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReleaseList } from "@/components/ci-cd/ReleaseList";
import type { CiRelease } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineEye: () => <span data-testid="icon-eye">eye</span>,
    HiOutlinePencil: () => <span data-testid="icon-pencil">pencil</span>,
    HiOutlineTrash: () => <span data-testid="icon-trash">trash</span>,
}));

function createMockRelease(overrides: Partial<CiRelease> = {}): CiRelease {
    return {
        id: 1,
        version: "v1.0.0",
        status: "released",
        changelog: "Initial release",
        released_at: "2024-03-01",
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
        ...overrides,
    };
}

describe("ReleaseList", () => {
    describe("Rendering", () => {
        it("should render a list of releases", () => {
            const releases = [
                createMockRelease({ id: 1, version: "v1.0.0" }),
                createMockRelease({ id: 2, version: "v2.0.0" }),
            ];
            render(<ReleaseList releases={releases} />);

            expect(screen.getByText("v1.0.0")).toBeInTheDocument();
            expect(screen.getByText("v2.0.0")).toBeInTheDocument();
        });

        it("should render release status", () => {
            const releases = [createMockRelease({ status: "released" })];
            render(<ReleaseList releases={releases} />);

            expect(screen.getByText("released")).toBeInTheDocument();
        });

        it("should show dash for null version", () => {
            const releases = [createMockRelease({ version: null })];
            render(<ReleaseList releases={releases} />);

            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should render empty state when no releases", () => {
            render(<ReleaseList releases={[]} />);

            expect(
                screen.getByText("No releases found")
            ).toBeInTheDocument();
        });

        it("should show released_at date", () => {
            const releases = [
                createMockRelease({ released_at: "2024-03-15" }),
            ];
            render(<ReleaseList releases={releases} />);

            expect(screen.getByText(/2024-03-15/)).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should call onView when view button clicked", () => {
            const onView = jest.fn();
            const releases = [createMockRelease({ id: 42 })];
            render(<ReleaseList releases={releases} onView={onView} />);

            const viewBtn = screen.getByRole("button", { name: /view/i });
            fireEvent.click(viewBtn);

            expect(onView).toHaveBeenCalledWith(42);
        });

        it("should call onEdit when edit button clicked", () => {
            const onEdit = jest.fn();
            const releases = [createMockRelease({ id: 7 })];
            render(<ReleaseList releases={releases} onEdit={onEdit} />);

            const editBtn = screen.getByRole("button", { name: /edit/i });
            fireEvent.click(editBtn);

            expect(onEdit).toHaveBeenCalledWith(releases[0]);
        });

        it("should call onDelete when delete button clicked", () => {
            const onDelete = jest.fn();
            const releases = [createMockRelease({ id: 3 })];
            render(<ReleaseList releases={releases} onDelete={onDelete} />);

            const deleteBtn = screen.getByRole("button", { name: /delete/i });
            fireEvent.click(deleteBtn);

            expect(onDelete).toHaveBeenCalledWith(3);
        });

        it("should not render action buttons when no handlers provided", () => {
            const releases = [createMockRelease()];
            render(<ReleaseList releases={releases} />);

            expect(
                screen.queryByRole("button", { name: /view/i })
            ).not.toBeInTheDocument();
        });
    });
});
