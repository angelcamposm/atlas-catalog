"use client";

import {
    HiSquares2X2,
    HiChevronDown,
    HiCheck,
    HiBeaker,
} from "react-icons/hi2";
import { useModule, type ModuleId } from "./ModuleContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Module {
    id: ModuleId;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

export function ModuleSelector() {
    const { activeModule, setActiveModule } = useModule();

    // Definir módulos disponibles
    const modules: Module[] = [
        {
            id: "general",
            name: "General",
            icon: HiSquares2X2,
            description: "Vista general del catálogo",
        },
        {
            id: "examples",
            name: "Ejemplos",
            icon: HiBeaker,
            description: "Componentes de ejemplo y diseño",
        },
    ];

    const handleModuleChange = (module: Module) => {
        setActiveModule(module.id);
    };

    const currentModule = modules.find((m) => m.id === activeModule) || modules[0];
    const ActiveIcon = currentModule.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    id="module-selector-trigger"
                    variant="ghost"
                    className="h-9 gap-2 px-3 hover:bg-accent"
                >
                    <ActiveIcon className="h-4 w-4" />
                    <span className="font-medium">{currentModule.name}</span>
                    <HiChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                {modules.map((module) => {
                    const ModuleIcon = module.icon;
                    const isActive = activeModule === module.id;

                    return (
                        <DropdownMenuItem
                            key={module.id}
                            onClick={() => handleModuleChange(module)}
                            className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                        >
                            <ModuleIcon
                                className={cn(
                                    "mt-0.5 h-4 w-4 shrink-0",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            />
                            <div className="flex flex-1 flex-col gap-0.5">
                                <div className="flex items-center justify-between">
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            isActive && "text-primary"
                                        )}
                                    >
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
