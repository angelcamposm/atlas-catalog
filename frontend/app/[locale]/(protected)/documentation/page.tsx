"use client";

import { FileText } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function DocumentationPage() {
    return (
        <UnderConstruction
            icon={FileText}
            title="Centro de Documentación"
            description="Esta sección incluirá documentación completa, guías de uso, ejemplos de código y mejores prácticas para el catálogo de APIs."
            estimatedCompletion="Q1 2026"
        />
    );
}
