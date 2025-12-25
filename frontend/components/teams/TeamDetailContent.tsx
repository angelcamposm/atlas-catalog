"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    HiOutlineEnvelope,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineUserGroup,
    HiOutlineLink,
    HiOutlineFolder,
    HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import type { Group, GroupType, User } from "@/types/api";
import { groupsApi, groupTypesApi } from "@/lib/api/groups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Props {
    team: Group;
    members?: User[] | null;
    locale?: string;
}

export function TeamDetailContent({ team, members, locale = "es" }: Props) {
    const [groupType, setGroupType] = useState<GroupType | null>(null);
    const [parentGroup, setParentGroup] = useState<Group | null>(null);
    const [childGroups, setChildGroups] = useState<Group[]>([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    useEffect(() => {
        async function loadRelatedData() {
            setLoadingRelations(true);
            try {
                // Load group type if type_id exists
                if (team.type_id) {
                    try {
                        const typeResponse = await groupTypesApi.getById(
                            team.type_id
                        );
                        setGroupType(typeResponse.data);
                    } catch (e) {
                        console.warn("Could not load group type:", e);
                    }
                }

                // Load parent group if parent_id exists
                if (team.parent_id) {
                    try {
                        const parentResponse = await groupsApi.getById(
                            team.parent_id
                        );
                        setParentGroup(parentResponse.data);
                    } catch (e) {
                        console.warn("Could not load parent group:", e);
                    }
                }

                // Load all groups to find children
                try {
                    const allGroups = await groupsApi.getAll();
                    const children = allGroups.data.filter(
                        (g) => g.parent_id === team.id
                    );
                    setChildGroups(children);
                } catch (e) {
                    console.warn("Could not load child groups:", e);
                }
            } finally {
                setLoadingRelations(false);
            }
        }

        loadRelatedData();
    }, [team]);

    const getIconColor = (icon: string | null | undefined) => {
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

    const getMemberColor = (id: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return colors[id % colors.length];
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div
                            className={cn(
                                "flex h-20 w-20 items-center justify-center rounded-xl text-white shrink-0",
                                getIconColor(team.icon)
                            )}
                        >
                            <span className="text-4xl">
                                {(team.label || team.name).charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold">
                                    {team.label || team.name}
                                </h1>
                                {groupType && (
                                    <Badge variant="secondary">
                                        {groupType.name}
                                    </Badge>
                                )}
                                {team.parent_id && (
                                    <Badge variant="outline">Sub-equipo</Badge>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground font-mono">
                                @{team.name}
                            </p>
                            {team.description && (
                                <p className="mt-3 text-muted-foreground">
                                    {team.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hierarchy Section - Parent Group */}
            {parentGroup && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineBuildingOffice2 className="h-5 w-5" />
                            Equipo Padre
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href={`/${locale}/teams/${parentGroup.id}`}
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                        >
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                    getIconColor(parentGroup.icon)
                                )}
                            >
                                <span className="text-lg font-bold">
                                    {(
                                        parentGroup.label || parentGroup.name
                                    ).charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                    {parentGroup.label || parentGroup.name}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    @{parentGroup.name}
                                </p>
                            </div>
                            <HiOutlineLink className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Sub-teams Section */}
            {childGroups.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineFolder className="h-5 w-5" />
                            Sub-equipos
                            <Badge variant="secondary" className="ml-2">
                                {childGroups.length}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {childGroups.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/${locale}/teams/${child.id}`}
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                >
                                    <div
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm",
                                            getIconColor(child.icon)
                                        )}
                                    >
                                        {(child.label || child.name).charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {child.label || child.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {child.description ||
                                                "Sin descripción"}
                                        </p>
                                    </div>
                                    <HiOutlineLink className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineEnvelope className="h-5 w-5" />{" "}
                            Información de Contacto
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {team.email ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Email
                                </p>
                                <a
                                    href={`mailto:${team.email}`}
                                    className="text-primary hover:underline"
                                >
                                    {team.email}
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay email configurado
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineTag className="h-5 w-5" /> Metadatos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    ID
                                </p>
                                <p className="font-mono">{team.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Tipo
                                </p>
                                <p>
                                    {groupType
                                        ? groupType.name
                                        : team.type_id
                                        ? `ID: ${team.type_id}`
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Icon
                                </p>
                                <p className="font-mono">
                                    {team.icon || "N/A"}
                                </p>
                            </div>
                            {team.label && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Etiqueta
                                    </p>
                                    <p>{team.label}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineUserGroup className="h-5 w-5" />
                            Miembros
                            {members && members.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {members.length}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {members && members.length > 0 ? (
                            <div className="space-y-2">
                                {members.map((m: User) => (
                                    <Link
                                        key={m.id}
                                        href={`/${locale}/profile`}
                                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                    >
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold",
                                                getMemberColor(m.id)
                                            )}
                                        >
                                            {m.name
                                                ? m.name.charAt(0).toUpperCase()
                                                : "?"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {m.name ||
                                                    m.email ||
                                                    `Usuario ${m.id}`}
                                            </p>
                                            {m.email && (
                                                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                    <HiOutlineEnvelope className="h-3 w-3 shrink-0" />
                                                    {m.email}
                                                </p>
                                            )}
                                        </div>
                                        {m.is_active === false && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Inactivo
                                            </Badge>
                                        )}
                                        <HiOutlineLink className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <HiOutlineUserGroup className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    No hay miembros asignados
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Los miembros aparecerán aquí cuando se
                                    añadan al equipo
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineCalendar className="h-5 w-5" />{" "}
                            Información de Auditoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado
                                </p>
                                <p>{formatDate(team.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />{" "}
                                    {team.created_by || "Sistema"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado
                                </p>
                                <p>{formatDate(team.updated_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />{" "}
                                    {team.updated_by || "Sistema"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default TeamDetailContent;
