"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineUserGroup,
    HiOutlinePlus,
    HiOutlineEnvelope,
    HiOutlineChevronRight,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineMagnifyingGlass,
    HiOutlineUsers,
    HiOutlineFolder,
    HiOutlineTag,
} from "react-icons/hi2";
import { groupsApi, groupTypesApi } from "@/lib/api/groups";
import type { Group, GroupType } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamDetailSlideOver from "@/components/teams/TeamDetailSlideOver";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

export default function TeamsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";

    const [teams, setTeams] = useState<Group[]>([]);
    const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<number | null>(null);

    const loadTeams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [teamsResponse, typesResponse] = await Promise.all([
                groupsApi.getAll(),
                groupTypesApi.getAll().catch(() => ({ data: [] })),
            ]);
            setTeams(teamsResponse.data);
            setGroupTypes(typesResponse.data);
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

    // Filtered teams based on search and type filter
    const filteredTeams = useMemo(() => {
        return teams.filter((team) => {
            const matchesSearch =
                !searchTerm ||
                team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType =
                selectedTypeFilter === null || team.type_id === selectedTypeFilter;

            return matchesSearch && matchesType;
        });
    }, [teams, searchTerm, selectedTypeFilter]);

    // Stats calculations
    const stats = useMemo(() => {
        const withParent = teams.filter((t) => t.parent_id).length;
        const withEmail = teams.filter((t) => t.email).length;
        const byType = groupTypes.reduce(
            (acc, type) => {
                acc[type.id] = teams.filter((t) => t.type_id === type.id).length;
                return acc;
            },
            {} as Record<number, number>
        );
        return { withParent, withEmail, byType };
    }, [teams, groupTypes]);

    // Get type name by id
    const getTypeName = (typeId: number | null | undefined) => {
        if (!typeId) return null;
        const type = groupTypes.find((t) => t.id === typeId);
        return type?.name || null;
    };

    const getIconColor = (icon: string | null, index: number = 0) => {
        const colors: Record<string, string> = {
            server: "bg-blue-500",
            shield: "bg-purple-500",
            "credit-card": "bg-green-500",
            "shopping-cart": "bg-orange-500",
            users: "bg-indigo-500",
            "chart-bar": "bg-cyan-500",
            bell: "bg-yellow-500",
            archive: "bg-red-500",
        };
        if (icon && colors[icon]) return colors[icon];
        // Fallback to index-based color
        const fallbackColors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return fallbackColors[index % fallbackColors.length];
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
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="Teams"
                subtitle="Gestión de equipos y grupos de trabajo"
                actions={
                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center rounded-lg border bg-muted p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "rounded-md p-1.5 transition-colors",
                                    viewMode === "grid"
                                        ? "bg-background shadow-sm"
                                        : "hover:bg-background/50"
                                )}
                                title="Vista de tarjetas"
                            >
                                <HiOutlineSquares2X2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "rounded-md p-1.5 transition-colors",
                                    viewMode === "list"
                                        ? "bg-background shadow-sm"
                                        : "hover:bg-background/50"
                                )}
                                title="Vista de lista"
                            >
                                <HiOutlineListBullet className="h-4 w-4" />
                            </button>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Nuevo Equipo
                        </Button>
                    </div>
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
                                <p className="text-2xl font-bold">{teams.length}</p>
                                <p className="text-sm text-muted-foreground">
                                    Total Equipos
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-500/10 p-3">
                                <HiOutlineEnvelope className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.withEmail}</p>
                                <p className="text-sm text-muted-foreground">
                                    Con Email
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-500/10 p-3">
                                <HiOutlineFolder className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.withParent}</p>
                                <p className="text-sm text-muted-foreground">
                                    Sub-equipos
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-500/10 p-3">
                                <HiOutlineTag className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{groupTypes.length}</p>
                                <p className="text-sm text-muted-foreground">
                                    Tipos de Equipo
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar equipos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {groupTypes.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedTypeFilter(null)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                                selectedTypeFilter === null
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            Todos
                        </button>
                        {groupTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedTypeFilter(type.id)}
                                className={cn(
                                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                                    selectedTypeFilter === type.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                {type.name}
                                <span className="ml-1 text-xs opacity-70">
                                    ({stats.byType[type.id] || 0})
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results count */}
            {(searchTerm || selectedTypeFilter !== null) && (
                <p className="text-sm text-muted-foreground">
                    Mostrando {filteredTeams.length} de {teams.length} equipos
                </p>
            )}

            {/* Teams Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTeams.map((team, index) => (
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
                                                getIconColor(team.icon ?? null, index)
                                            )}
                                        >
                                            <span className="text-lg font-bold">
                                                {(team.label || team.name).charAt(0)}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-base truncate">
                                                {team.label || team.name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground truncate">
                                                @{team.name}
                                            </p>
                                        </div>
                                    </div>
                                    <HiOutlineChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {team.description || "Sin descripción"}
                                </p>
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    {team.type_id && getTypeName(team.type_id) && (
                                        <Badge variant="secondary" className="text-xs">
                                            {getTypeName(team.type_id)}
                                        </Badge>
                                    )}
                                    {team.parent_id && (
                                        <Badge variant="outline" className="text-xs">
                                            Sub-equipo
                                        </Badge>
                                    )}
                                </div>
                                {team.email && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <HiOutlineEnvelope className="h-4 w-4" />
                                        <span className="truncate">{team.email}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Teams List View */}
            {viewMode === "list" && (
                <Card>
                    <div className="divide-y">
                        {filteredTeams.map((team, index) => (
                            <div
                                key={team.id}
                                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => {
                                    setSelectedTeamId(team.id);
                                    setSlideOpen(true);
                                }}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg text-white shrink-0",
                                        getIconColor(team.icon ?? null, index)
                                    )}
                                >
                                    <span className="text-lg font-bold">
                                        {(team.label || team.name).charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">
                                            {team.label || team.name}
                                        </p>
                                        {team.type_id && getTypeName(team.type_id) && (
                                            <Badge variant="secondary" className="text-xs">
                                                {getTypeName(team.type_id)}
                                            </Badge>
                                        )}
                                        {team.parent_id && (
                                            <Badge variant="outline" className="text-xs">
                                                Sub-equipo
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {team.description || "Sin descripción"}
                                    </p>
                                </div>
                                {team.email && (
                                    <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                                        <HiOutlineEnvelope className="h-4 w-4" />
                                        <span className="truncate max-w-[200px]">{team.email}</span>
                                    </div>
                                )}
                                <HiOutlineChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {filteredTeams.length === 0 && teams.length > 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineMagnifyingGlass className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No se encontraron equipos
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Intenta con otros términos de búsqueda o filtros
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedTypeFilter(null);
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </CardContent>
                </Card>
            )}

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
