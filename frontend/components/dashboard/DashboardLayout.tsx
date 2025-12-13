"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconBar } from "@/components/layout/IconBar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ModuleSelector } from "@/components/layout/ModuleSelector";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { CommandKSearch } from "@/components/dashboard/CommandKSearch";
import { RouteProgressBar } from "@/components/layout/RouteProgressBar";
import { Button } from "@/components/ui/Button";
import { Search, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showCommandK, setShowCommandK] = useState(false);

    // Sidebar collapsed state with localStorage persistence
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("sidebarCollapsed");
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    // Persist sidebar state to localStorage
    useEffect(() => {
        localStorage.setItem(
            "sidebarCollapsed",
            JSON.stringify(isSidebarCollapsed)
        );
    }, [isSidebarCollapsed]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K for search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setShowCommandK(true);
            }

            // Cmd+B or Ctrl+B for toggle sidebar
            if ((e.metaKey || e.ctrlKey) && e.key === "b") {
                e.preventDefault();
                setIsSidebarCollapsed((prev: boolean) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Mock user data - TODO: Replace with real user data from auth context
    const currentUser = {
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
    };

    // Get breadcrumb from pathname
    const getBreadcrumb = () => {
        const pathWithoutLocale = pathname.replace(`/${locale}`, "");
        const parts = pathWithoutLocale.split("/").filter(Boolean);

        if (parts.length === 0) return ["Home"];

        const breadcrumbMap: Record<string, string> = {
            dashboard: "Home",
            updates: "Updates",
            apis: "APIs",
            infrastructure: "Infrastructure",
            integration: "Integration",
            platform: "Platform",
            tasks: "My Tasks",
            inbox: "Inbox",
            clients: "Clients",
        };

        return parts.map((part) => breadcrumbMap[part] || part);
    };

    const breadcrumb = getBreadcrumb();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
            <RouteProgressBar />

            {/* Icon Bar - Left */}
            <IconBar
                locale={locale}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() =>
                    setIsSidebarCollapsed(!isSidebarCollapsed)
                }
            />

            {/* Navigation Sidebar */}
            <AppSidebar locale={locale} isCollapsed={isSidebarCollapsed} />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Primary Header Bar - Generic */}
                <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
                    {/* Left side - Module Selector + Breadcrumb */}
                    <div className="flex items-center gap-4">
                        {/* Module Selector */}
                        <ModuleSelector userPermissions={[]} />

                        {/* Separator */}
                        <div className="h-6 w-px bg-border" />

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm">
                            {breadcrumb.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    {index > 0 && (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span
                                        className={
                                            index === breadcrumb.length - 1
                                                ? "font-medium text-foreground"
                                                : "text-muted-foreground hover:text-foreground cursor-pointer"
                                        }
                                    >
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Global Actions */}
                    <div className="flex items-center gap-2">
                        {/* Toggle Sidebar - Desktop */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                            className="hidden lg:flex"
                            title={
                                isSidebarCollapsed
                                    ? "Expandir menú (⌘B)"
                                    : "Contraer menú (⌘B)"
                            }
                        >
                            {isSidebarCollapsed ? (
                                <PanelLeft className="h-4 w-4" />
                            ) : (
                                <PanelLeftClose className="h-4 w-4" />
                            )}
                        </Button>

                        {/* Search - Opens Command K */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCommandK(true)}
                            title="Buscar (⌘K)"
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* User Avatar */}
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-primary text-sm font-semibold text-primary-foreground ring-2 ring-border ring-offset-2 ring-offset-background transition-transform hover:scale-105"
                        >
                            JD
                        </button>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={currentUser}
            />

            {/* Command K Search */}
            <CommandKSearch
                isOpen={showCommandK}
                onClose={() => setShowCommandK(false)}
                locale={locale}
            />
        </div>
    );
}
