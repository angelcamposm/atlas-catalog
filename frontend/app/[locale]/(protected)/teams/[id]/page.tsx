"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineUserGroup,
    HiOutlineEnvelope,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
} from "react-icons/hi2";
import { groupsApi } from "@/lib/api/groups";
import type { Group } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import TeamDetailContent from "@/components/teams/TeamDetailContent";

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const teamId = params?.id as string;

    const [team, setTeam] = useState<Group | null>(null);
    const [members, setMembers] = useState<import("@/types/api").User[] | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTeam = useCallback(async () => {
        if (!teamId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await groupsApi.getById(Number(teamId));
            setTeam(response.data);

            try {
                const membersResponse = await groupsApi.getMembers(
                    Number(teamId)
                );
                setMembers(membersResponse as any);
            } catch (err) {
                setMembers(null);
            }
        } catch (err) {
            setError("Error al cargar el equipo");
            console.error("Error loading team:", err);
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        loadTeam();
    }, [loadTeam]);

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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Equipo no encontrado"}
                </p>
                <Button
                    onClick={() => router.push(`/${locale}/teams`)}
                    variant="outline"
                >
                    Volver a Equipos
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={`/${locale}/teams`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Equipos
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">
                        {team.label || team.name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <HiOutlinePencil className="h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        <HiOutlineTrash className="h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            </div>

            <TeamDetailContent team={team} members={members} />
        </div>
    );
}
