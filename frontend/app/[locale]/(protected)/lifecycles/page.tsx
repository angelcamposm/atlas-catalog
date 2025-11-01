"use client";

import { GitBranch } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function LifecyclesPage() {
    return (
        <UnderConstruction
            icon={GitBranch}
            title="Gestión de Ciclos de Vida"
            description="Esta sección permitirá gestionar los diferentes ciclos de vida de las APIs: Desarrollo, QA, Staging, Producción, Deprecado, etc."
            estimatedCompletion="Q1 2026"
        />
    );
}
