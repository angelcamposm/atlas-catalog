"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./AppSidebar";
import { ModuleSelector } from "./ModuleSelector";
import { ModuleProvider } from "./ModuleContext";
import { Footer } from "./Footer";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
    children: ReactNode;
    locale: string;
    showSidebar?: boolean;
    showFooter?: boolean;
    userPermissions?: string[];
}

/**
 * Main Layout Component
 * Based on shadcn/ui components with Golden Ratio spacing
 */
export function MainLayout({
    children,
    locale,
    showSidebar = false,
    showFooter = true,
    userPermissions = [],
}: MainLayoutProps) {
    if (!showSidebar) {
        // Simple layout without sidebar
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar locale={locale} />
                <main className="pt-16">
                    {children}
                    {showFooter && <Footer locale={locale} />}
                </main>
            </div>
        );
    }

    // Layout with sidebar using shadcn/ui SidebarProvider
    return (
        <ModuleProvider defaultModule="general" locale={locale}>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar locale={locale} />
                    <SidebarInset className="flex flex-1 flex-col">
                        {/* Header with Module Selector */}
                        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />

                            {/* Module Selector */}
                            <ModuleSelector />

                            <div className="ml-auto flex items-center gap-4">
                                <Navbar locale={locale} />
                            </div>
                        </header>

                        {/* Main content */}
                        <main className="flex flex-1 flex-col">{children}</main>

                        {/* Footer */}
                        {showFooter && <Footer locale={locale} />}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </ModuleProvider>
    );
}
