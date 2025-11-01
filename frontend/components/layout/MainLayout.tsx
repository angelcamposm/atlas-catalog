"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./AppSidebar";
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
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar locale={locale} />
                <SidebarInset className="flex flex-1 flex-col">
                    {/* Header with trigger */}
                    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <div className="flex flex-1 items-center justify-between">
                            <h1 className="text-lg font-semibold">
                                Atlas Catalog
                            </h1>
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
    );
}
