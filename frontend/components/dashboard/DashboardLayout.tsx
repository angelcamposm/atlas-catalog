"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconBar } from "@/components/layout/IconBar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { CommandKSearch } from "@/components/dashboard/CommandKSearch";
import { Button } from "@/components/ui/Button";
import {
    Bell,
    Search,
    SlidersHorizontal,
    Eye,
    ArrowUpDown,
    Plus,
    List,
    LayoutGrid,
    Calendar,
    BarChart3,
    ChevronRight,
    FileText,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    locale: string;
}

type ViewMode = "list" | "kanban" | "calendar" | "dashboard";

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentView, setCurrentView] = useState<ViewMode>("list");
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

    const viewModes: Array<{
        id: ViewMode;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
    }> = [
        { id: "list", label: "List", icon: List },
        { id: "kanban", label: "Kanban", icon: LayoutGrid },
        { id: "calendar", label: "Calendar", icon: Calendar },
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
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
                {/* Top Bar */}
                <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
                    {/* Left side - Breadcrumb & View Tabs */}
                    <div className="flex items-center gap-6">
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
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* View Mode Tabs */}
                        <div className="hidden lg:flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                            {viewModes.map((mode) => {
                                const Icon = mode.icon;
                                const isActive = currentView === mode.id;

                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setCurrentView(mode.id)}
                                        className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all ${
                                            isActive
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden xl:inline">
                                            {mode.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2">
                        {/* Sort */}
                        <Button variant="ghost" size="sm">
                            <ArrowUpDown className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Sort</span>
                        </Button>

                        {/* View */}
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">View</span>
                        </Button>

                        {/* Filter */}
                        <Button variant="ghost" size="sm">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">
                                Filter
                            </span>
                        </Button>

                        {/* Divider */}
                        <div className="mx-2 h-6 w-px bg-border" />

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

                        {/* Reports */}
                        <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">
                                Reports
                            </span>
                        </Button>

                        {/* Notifications */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                    3
                                </span>
                            </Button>
                        </div>

                        {/* Add Button - Highlighted */}
                        <Button variant="default" size="sm">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Add</span>
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
