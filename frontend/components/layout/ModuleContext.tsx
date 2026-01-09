"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ModuleId = "general" | "examples";

interface ModuleContextType {
    activeModule: ModuleId;
    setActiveModule: (module: ModuleId) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
    children: ReactNode;
    defaultModule?: ModuleId;
}

export function ModuleProvider({
    children,
    defaultModule = "general",
}: ModuleProviderProps) {
    const [activeModule, setActiveModule] = useState<ModuleId>(defaultModule);

    return (
        <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
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
