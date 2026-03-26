import { render, screen } from "@testing-library/react";
import { ServerDetail } from "@/components/ci-cd/ServerDetail";
import type { CiServer } from "@/types/api";

const createMockServer = (overrides: Partial<CiServer> = {}): CiServer => ({
    id: 1,
    name: "Jenkins Production",
    driver: "jenkins",
    url: "https://jenkins.example.com",
    is_enabled: true,
    last_synced_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("ServerDetail", () => {
    describe("Rendering", () => {
        it("should render server name", () => {
            render(
                <ServerDetail
                    server={createMockServer({ name: "Jenkins Production" })}
                />,
            );
            expect(screen.getByText("Jenkins Production")).toBeInTheDocument();
        });

        it("should render server driver", () => {
            render(
                <ServerDetail
                    server={createMockServer({ driver: "jenkins" })}
                />,
            );
            expect(screen.getByText("jenkins")).toBeInTheDocument();
        });

        it("should render server url", () => {
            render(
                <ServerDetail
                    server={createMockServer({
                        url: "https://jenkins.example.com",
                    })}
                />,
            );
            expect(
                screen.getByText("https://jenkins.example.com"),
            ).toBeInTheDocument();
        });

        it("should show enabled badge when is_enabled is true", () => {
            render(
                <ServerDetail
                    server={createMockServer({ is_enabled: true })}
                />,
            );
            expect(screen.getByText("Enabled")).toBeInTheDocument();
        });

        it("should show disabled badge when is_enabled is false", () => {
            render(
                <ServerDetail
                    server={createMockServer({ is_enabled: false })}
                />,
            );
            expect(screen.getByText("Disabled")).toBeInTheDocument();
        });

        it("should show dash when driver is null", () => {
            render(
                <ServerDetail server={createMockServer({ driver: null })} />,
            );
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThanOrEqual(1);
        });

        it("should show last synced at date", () => {
            render(
                <ServerDetail
                    server={createMockServer({
                        last_synced_at: "2024-06-20T10:00:00Z",
                        updated_at: "2024-01-15T10:00:00Z",
                    })}
                />,
            );
            expect(screen.getByText(/2024-06-20/)).toBeInTheDocument();
        });
    });
});
