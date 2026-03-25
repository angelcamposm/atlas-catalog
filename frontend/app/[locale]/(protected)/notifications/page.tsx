"use client";

import { Bell } from "lucide-react";
import { UnderConstruction } from "@/components/ui/UnderConstruction";

export default function NotificationsPage() {
    return (
        <UnderConstruction
            icon={Bell}
            title="Centro de Notificaciones"
            description="Esta sección permitirá gestionar notificaciones, alertas, y configurar canales de comunicación para eventos importantes del sistema."
            estimatedCompletion="Q1 2026"
        />
    );
}
