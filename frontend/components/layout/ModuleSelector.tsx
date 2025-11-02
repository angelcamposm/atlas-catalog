"use client";

import { useState } from "react";
import {
    HiShieldCheck,
    HiDocumentText,
    HiSquares2X2,
} from "react-icons/hi2";

interface Module {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    requiredPermission?: string;
}

interface ModuleSelectorProps {
    userPermissions?: string[];
}

export function ModuleSelector({ userPermissions = [] }: ModuleSelectorProps) {
    // Definir módulos disponibles
    const allModules: Module[] = [
        {
            id: "general",
            name: "General",
            icon: HiSquares2X2,
            description: "Vista general del catálogo",
        },
        {
            id: "security",
            name: "Seguridad",
            icon: HiShieldCheck,
            description: "Gestión de seguridad y accesos",
            requiredPermission: "view_security",
        },
        {
            id: "audit",
            name: "Auditoría",
            icon: HiDocumentText,
            description: "Registro y seguimiento de eventos",
            requiredPermission: "view_audit",
        },
    ];

    // Filtrar módulos según permisos del usuario
    const availableModules = allModules.filter((module) => {
        if (!module.requiredPermission) return true;
        return userPermissions.includes(module.requiredPermission);
    });

    // Estado del módulo activo
    const [activeModule, setActiveModule] = useState<Module>(
        availableModules[0] || allModules[0]
    );

    const handleModuleChange = (moduleId: string) => {
        const selectedModule = availableModules.find((m) => m.id === moduleId);
        if (selectedModule) {
            setActiveModule(selectedModule);
            // Aquí puedes agregar lógica adicional como:
            // - Actualizar el contexto global
            // - Redirigir a la página del módulo
            // - Notificar cambio a componentes hijos
            console.log("Módulo cambiado a:", selectedModule.id);
        }
    };

    if (availableModules.length === 0) {
        return null;
    }

    const ActiveIcon = activeModule.icon;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2">
                <ActiveIcon className="h-4 w-4 text-muted-foreground" />
                <select
                    value={activeModule.id}
                    onChange={(e) => handleModuleChange(e.target.value)}
                    className="border-none bg-transparent text-sm font-medium outline-none focus:outline-none"
                >
                    {availableModules.map((module) => (
                        <option key={module.id} value={module.id}>
                            {module.name}
                        </option>
                    ))}
                </select>
            </div>
            <span className="hidden text-xs text-muted-foreground md:block">
                {activeModule.description}
            </span>
        </div>
    );
}
