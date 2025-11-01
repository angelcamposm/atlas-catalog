"use client";

import { Users } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function TeamsPage() {
    return (
        <UnderConstruction
            icon={Users}
            title="Gestión de Equipos"
            description="Esta sección permitirá gestionar equipos, asignar permisos y organizar la colaboración entre diferentes áreas de la organización."
            estimatedCompletion="Q2 2026"
        />
    );
}
