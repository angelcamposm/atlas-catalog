"use client";

import { useState } from "react";
import { HiShieldCheck, HiDocumentText, HiSquares2X2, HiChevronDown, HiCheck } from "react-icons/hi2";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

    const handleModuleChange = (module: Module) => {
        setActiveModule(module);
        // Aquí puedes agregar lógica adicional como:
        // - Actualizar el contexto global
        // - Redirigir a la página del módulo
        // - Notificar cambio a componentes hijos
        console.log("Módulo cambiado a:", module.id);
    };

    if (availableModules.length === 0) {
        return null;
    }

    const ActiveIcon = activeModule.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="h-9 gap-2 px-3 hover:bg-accent"
                >
                    <ActiveIcon className="h-4 w-4" />
                    <span className="font-medium">{activeModule.name}</span>
                    <HiChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                {availableModules.map((module) => {
                    const ModuleIcon = module.icon;
                    const isActive = activeModule.id === module.id;
                    
                    return (
                        <DropdownMenuItem
                            key={module.id}
                            onClick={() => handleModuleChange(module)}
                            className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                        >
                            <ModuleIcon className={cn(
                                "mt-0.5 h-4 w-4 shrink-0",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div className="flex flex-1 flex-col gap-0.5">
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "text-sm font-medium",
                                        isActive && "text-primary"
                                    )}>
                                        {module.name}
                                    </span>
                                    {isActive && (
                                        <HiCheck className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {module.description}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
