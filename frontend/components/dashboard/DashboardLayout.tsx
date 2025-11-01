"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/Button";
import { LogOut, Bell } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        // Por ahora solo redirige al home
        router.push(`/${locale}`);
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <AppSidebar locale={locale} />

                {/* Main Content */}
                <SidebarInset className="flex-1">
                    {/* Top Bar */}
                    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex h-16 items-center justify-between px-6">
                            {/* Left side - could add breadcrumbs or title here */}
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Dashboard
                                </h2>
                            </div>

                            {/* Right side - User info and logout */}
                            <div className="flex items-center space-x-3">
                                {/* Notifications */}
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        className="relative"
                                        onClick={() =>
                                            setShowNotifications(
                                                !showNotifications
                                            )
                                        }
                                    >
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                                    </Button>
                                </div>

                                {/* User Info */}
                                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-blue-indigo text-sm font-semibold text-white">
                                        JD
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            John Doe
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Admin
                                        </p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Logout
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 bg-gray-50 dark:bg-gray-950">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
