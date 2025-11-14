"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";

interface SidebarListItem {
    label: string;
    href?: string;
    description?: string;
}

interface ComponentDetailsSidebarProps {
    ownerTeams?: SidebarListItem[];
    chatChannels?: SidebarListItem[];
    repositories?: SidebarListItem[];
    projects?: SidebarListItem[];
    dashboards?: SidebarListItem[];
    links?: SidebarListItem[];
}

function SidebarSection({
    title,
    items,
}: {
    title: string;
    items?: SidebarListItem[];
}) {
    if (!items || items.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {items.map((item) => (
                    <div key={item.label} className="flex flex-col">
                        {item.href ? (
                            <a
                                href={item.href}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span>{item.label}</span>
                        )}
                        {item.description && (
                            <span className="text-xs text-muted-foreground">
                                {item.description}
                            </span>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function ComponentDetailsSidebar({
    ownerTeams,
    chatChannels,
    repositories,
    projects,
    dashboards,
    links,
}: ComponentDetailsSidebarProps) {
    return (
        <div className="space-y-4">
            <SidebarSection title="Equipo propietario" items={ownerTeams} />
            <SidebarSection title="Canales de chat" items={chatChannels} />
            <SidebarSection title="Repositorios" items={repositories} />
            <SidebarSection title="Proyectos" items={projects} />
            <SidebarSection title="Paneles" items={dashboards} />
            <SidebarSection title="Otros enlaces" items={links} />
        </div>
    );
}
