"use client";

import { Tag } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function TypesPage() {
    return (
        <UnderConstruction
            icon={Tag}
            title="Tipos de API"
            description="Esta sección permitirá gestionar los diferentes tipos de APIs: REST, GraphQL, gRPC, WebSocket, etc."
            estimatedCompletion="Q1 2026"
        />
    );
}
