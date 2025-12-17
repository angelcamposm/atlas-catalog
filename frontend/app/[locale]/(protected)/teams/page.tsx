"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineUserGroup,
    HiOutlinePlus,
    HiOutlineEnvelope,
    HiOutlineChevronRight,
} from "react-icons/hi2";
import { groupsApi } from "@/lib/api/groups";
import type { Group } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamDetailSlideOver from "@/components/teams/TeamDetailSlideOver";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function TeamsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";

    const [teams, setTeams] = useState<Group[]>([]);
    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTeams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await groupsApi.getAll();
            setTeams(response.data);
        } catch (err) {
            setError("Error al cargar los equipos");
            console.error("Error loading teams:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTeams();
    }, [loadTeams]);

    const getIconColor = (icon: string | null) => {
        const colors: Record<string, string> = {
            server: "bg-blue-500",
            shield: "bg-purple-500",
            "credit-card": "bg-green-500",
            "shopping-cart": "bg-orange-500",
            users: "bg-indigo-500",
            "chart-bar": "bg-cyan-500",
            bell: "bg-yellow-500",
            archive: "bg-red-500",
            default: "bg-gray-500",
        };
        return colors[icon || "default"] || colors.default;
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">{error}</p>
                <Button onClick={loadTeams} variant="outline">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Teams"
                subtitle="Gestión de equipos y grupos de trabajo"
                actions={
                    <Button className="gap-2">
                        <HiOutlinePlus className="h-4 w-4" />
                        Nuevo Equipo
                    </Button>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <HiOutlineUserGroup className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {teams.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Equipos
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <Card
                        key={team.id}
                        className="group cursor-pointer transition-all hover:shadow-md"
                        onClick={() => {
                            setSelectedTeamId(team.id);
                            setSlideOpen(true);
                        }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                            getIconColor(team.icon ?? null)
                                        )}
                                    >
                                        <HiOutlineUserGroup className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            {team.label || team.name}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            {team.name}
                                        </p>
                                    </div>
                                </div>
                                <HiOutlineChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {team.description || "Sin descripción"}
                            </p>
                            {team.email && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <HiOutlineEnvelope className="h-4 w-4" />
                                    <span>{team.email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {teams.length === 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineUserGroup className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No hay equipos
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Crea tu primer equipo para empezar a organizar
                                tu catálogo
                            </p>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Crear Equipo
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Team SlideOver */}
            <TeamDetailSlideOver
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                teamId={selectedTeamId}
                locale={locale}
            />
        </div>
    );
}
