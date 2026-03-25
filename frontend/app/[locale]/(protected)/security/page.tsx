"use client";

import { Shield } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function SecurityPage() {
    return (
        <UnderConstruction
            icon={Shield}
            title="Centro de Seguridad"
            description="Esta sección proporcionará herramientas para gestionar autenticación, autorización, políticas de seguridad, y auditoría de accesos."
            estimatedCompletion="Q2 2026"
        />
    );
}
