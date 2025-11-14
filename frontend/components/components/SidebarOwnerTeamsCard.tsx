"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";

interface TeamItem {
    name: string;
    members?: number;
    description?: string;
    href?: string;
}

interface SidebarOwnerTeamsCardProps {
    teams?: TeamItem[];
}

export function SidebarOwnerTeamsCard({ teams }: SidebarOwnerTeamsCardProps) {
    if (!teams || teams.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Equipo propietario
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[13px]">
                {teams.map((t) => (
                    <div
                        key={t.name}
                        className="flex items-start justify-between gap-3"
                    >
                        <div>
                            {t.href ? (
                                <a
                                    href={t.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {t.name}
                                </a>
                            ) : (
                                <div className="font-medium">{t.name}</div>
                            )}
                            {t.description && (
                                <div className="text-[11px] text-muted-foreground">
                                    {t.description}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Badge variant="secondary">{t.members ?? 0}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default SidebarOwnerTeamsCard;
