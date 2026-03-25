"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";

export type ModuleId = "general" | "examples";

// Default routes for each module
export const moduleDefaultRoutes: Record<ModuleId, string> = {
    general: "/components",
    examples: "/showcase/diagrams",
};

interface ModuleContextType {
    activeModule: ModuleId;
    setActiveModule: (module: ModuleId) => void;
    navigateToModule: (module: ModuleId) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
    children: ReactNode;
    defaultModule?: ModuleId;
    locale: string;
}

export function ModuleProvider({
    children,
    defaultModule = "general",
    locale,
}: ModuleProviderProps) {
    const [activeModule, setActiveModule] = useState<ModuleId>(defaultModule);
    const router = useRouter();

    const navigateToModule = useCallback(
        (module: ModuleId) => {
            setActiveModule(module);
            const route = moduleDefaultRoutes[module];
            router.push(`/${locale}${route}`);
        },
        [locale, router]
    );

    return (
        <ModuleContext.Provider
            value={{ activeModule, setActiveModule, navigateToModule }}
        >
            {children}
        </ModuleContext.Provider>
    );
}

export function useModule() {
    const context = useContext(ModuleContext);
    if (context === undefined) {
        throw new Error("useModule must be used within a ModuleProvider");
    }
    return context;
}
