"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/Button";
import { 
    LogOut, 
    Bell, 
    GitBranch, 
    Tag, 
    Users, 
    BarChart3, 
    FileText, 
    Shield 
} from "lucide-react";
import {
    HiServer,
    HiLink,
    HiCube,
    HiSquares2X2,
    HiChartBar,
    HiCog6Tooth,
} from "react-icons/hi2";

interface DashboardLayoutProps {
    children: React.ReactNode;
    locale: string;
}

// Configuración de secciones con iconos (los títulos vienen de traducciones)
const SECTION_ICONS: Record<string, React.ElementType> = {
    "/dashboard": HiChartBar,
    "/infrastructure": HiServer,
    "/integration": HiLink,
    "/platform": HiCube,
    "/apis": HiSquares2X2,
    "/settings": HiCog6Tooth,
    "/lifecycles": GitBranch,
    "/types": Tag,
    "/teams": Users,
    "/analytics": BarChart3,
    "/documentation": FileText,
    "/security": Shield,
    "/notifications": Bell,
};

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const mainRef = useRef<HTMLElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Traducciones
    const tDashboard = useTranslations("dashboard");
    const tInfrastructure = useTranslations("infrastructure");
    const tIntegration = useTranslations("integration");
    const tPlatform = useTranslations("platform");
    const tApis = useTranslations("apis");
    const tSettings = useTranslations("settings");
    const tSidebar = useTranslations("sidebar");

    // Mock user data - TODO: Replace with real user data from auth context
    const currentUser = {
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
    };

    // Detectar la sección actual basándose en la ruta
    const getCurrentSection = () => {
        // Remover el locale de la ruta
        const pathWithoutLocale = pathname.replace(`/${locale}`, "");

        // Buscar la sección que coincida y devolver con traducciones
        for (const [key, icon] of Object.entries(SECTION_ICONS)) {
            if (pathWithoutLocale.startsWith(key)) {
                let title = "";
                let subtitle = "";

                switch (key) {
                    case "/dashboard":
                        title = tDashboard("overview");
                        subtitle = tDashboard("subtitle");
                        break;
                    case "/infrastructure":
                        title = tInfrastructure("overview");
                        subtitle = tInfrastructure("subtitle");
                        break;
                    case "/integration":
                        title = tIntegration("overview");
                        subtitle = tIntegration("subtitle");
                        break;
                    case "/platform":
                        title = tPlatform("overview");
                        subtitle = tPlatform("subtitle");
                        break;
                    case "/apis":
                        title = tApis("title");
                        subtitle = "";
                        break;
                    case "/settings":
                        title = tSettings("title");
                        subtitle = tSettings("description");
                        break;
                    case "/lifecycles":
                        title = tSidebar("lifecycles");
                        subtitle = "Gestión de ciclos de vida de APIs";
                        break;
                    case "/types":
                        title = tSidebar("types");
                        subtitle = "Tipos y categorías de APIs";
                        break;
                    case "/teams":
                        title = tSidebar("teams");
                        subtitle = "Gestión de equipos y colaboración";
                        break;
                    case "/analytics":
                        title = tSidebar("analytics");
                        subtitle = "Analíticas y métricas avanzadas";
                        break;
                    case "/documentation":
                        title = tSidebar("documentation");
                        subtitle = "Centro de documentación";
                        break;
                    case "/security":
                        title = tSidebar("security");
                        subtitle = "Centro de seguridad";
                        break;
                    case "/notifications":
                        title = tSidebar("notifications");
                        subtitle = "Notificaciones y alertas";
                        break;
                }

                return { key, icon, title, subtitle };
            }
        }

        return null;
    };

    const currentSection = getCurrentSection();

    // Detectar scroll para mostrar/ocultar el título en la barra superior
    useEffect(() => {
        const mainElement = mainRef.current;
        if (!mainElement) return;

        const handleScroll = () => {
            // Mostrar título cuando se haya hecho scroll > 64px (altura de la barra superior h-16)
            setIsScrolled(mainElement.scrollTop > 64);
        };

        mainElement.addEventListener("scroll", handleScroll);
        return () => mainElement.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        // Por ahora solo redirige al home
        router.push(`/${locale}`);
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <AppSidebar locale={locale} />

                {/* Main Content */}
                <SidebarInset className="flex flex-1 flex-col overflow-hidden">
                    {/* Top Bar - Fixed */}
                    <header className="sticky top-0 z-40 shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex h-16 items-center justify-between px-6">
                            {/* Left side - Section title (visible only when scrolled) */}
                            <div
                                className={`flex items-center space-x-3 transition-all duration-300 ${
                                    isScrolled && currentSection
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-4 pointer-events-none"
                                }`}
                            >
                                {currentSection && (
                                    <>
                                        <currentSection.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {currentSection.title}
                                            </h2>
                                            {currentSection.subtitle && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {currentSection.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Right side - User info and logout */}
                            <div className="flex items-center space-x-3 ml-auto">
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

                                {/* User Info - Clickable */}
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
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
                                </button>

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

                    {/* Page Content - Scrollable */}
                    <main
                        ref={mainRef}
                        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950"
                    >
                        {children}
                    </main>
                </SidebarInset>
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={currentUser}
            />
        </SidebarProvider>
    );
}
