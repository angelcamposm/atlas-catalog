"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SidebarListItem {
    label: string;
    href?: string;
    description?: string;
}

interface Props {
    chatChannels?: SidebarListItem[];
    repositories?: SidebarListItem[];
}

export function SidebarReposChannelsCard({
    chatChannels,
    repositories,
}: Props) {
    return (
        <div className="space-y-3">
            {chatChannels && chatChannels.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Canales de chat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-[13px]">
                        {chatChannels.map((c) => (
                            <div key={c.label} className="flex flex-col">
                                {c.href ? (
                                    <a
                                        href={c.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {c.label}
                                    </a>
                                ) : (
                                    <span>{c.label}</span>
                                )}
                                {c.description && (
                                    <span className="text-[11px] text-muted-foreground">
                                        {c.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {repositories && repositories.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Repositorios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-[13px]">
                        {repositories.map((r) => (
                            <div key={r.label} className="flex flex-col">
                                {r.href ? (
                                    <a
                                        href={r.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {r.label}
                                    </a>
                                ) : (
                                    <span>{r.label}</span>
                                )}
                                {r.description && (
                                    <span className="text-[11px] text-muted-foreground">
                                        {r.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default SidebarReposChannelsCard;
