import React from "react";
import { render, screen } from "@testing-library/react";
import { ReleaseDetail } from "@/components/ci-cd/ReleaseDetail";
import type { CiRelease } from "@/types/api";

function createMockRelease(overrides: Partial<CiRelease> = {}): CiRelease {
    return {
        id: 1,
        version: "v1.5.0",
        status: "released",
        changelog: "- Fixed bug\n- Added feature",
        released_at: "2024-05-10",
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
        ...overrides,
    };
}

describe("ReleaseDetail", () => {
    describe("Rendering", () => {
        it("should render release version as heading", () => {
            render(<ReleaseDetail release={createMockRelease()} />);

            expect(screen.getByText("v1.5.0")).toBeInTheDocument();
        });

        it("should render release status", () => {
            render(<ReleaseDetail release={createMockRelease({ status: "released" })} />);

            expect(screen.getByText("released")).toBeInTheDocument();
        });

        it("should render changelog text", () => {
            render(<ReleaseDetail release={createMockRelease({ changelog: "Bug fixes" })} />);

            expect(screen.getByText("Bug fixes")).toBeInTheDocument();
        });

        it("should show dash for null status", () => {
            render(<ReleaseDetail release={createMockRelease({ status: null })} />);

            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should show released_at date", () => {
            render(<ReleaseDetail release={createMockRelease({ released_at: "2024-07-20" })} />);

            expect(screen.getByText(/2024-07-20/)).toBeInTheDocument();
        });

        it("should show dash for null released_at", () => {
            render(<ReleaseDetail release={createMockRelease({ released_at: null, status: "draft" })} />);

            // There will be at least one "—" for null released_at
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThan(0);
        });
    });
});
