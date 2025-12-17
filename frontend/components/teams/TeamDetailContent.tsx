"use client";

import React from "react";
import {
    HiOutlineEnvelope,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
} from "react-icons/hi2";
import type { Group, User } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Props {
    team: Group;
    members?: import("@/types/api").User[] | null;
}

export function TeamDetailContent({ team, members }: Props) {
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
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div
                            className={cn(
                                "flex h-20 w-20 items-center justify-center rounded-xl text-white",
                                getIconColor(team.icon)
                            )}
                        >
                            <span className="text-4xl">
                                {(team.label || team.name).charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">
                                    {team.label || team.name}
                                </h1>
                                {team.type_id && (
                                    <Badge variant="secondary">
                                        Tipo {team.type_id}
                                    </Badge>
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
                                    Icon
                                </p>
                                <p className="font-mono">
                                    {team.icon || "N/A"}
                                </p>
                            </div>
                            {team.parent_id && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Parent ID
                                    </p>
                                    <p className="font-mono">
                                        {team.parent_id}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Miembros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {members && members.length > 0 ? (
                            <ul className="space-y-3">
                                {members.map((m: User) => (
                                    <li
                                        key={m.id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                                {m.name
                                                    ? m.name
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "?"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {m.name ||
                                                        m.email ||
                                                        `user ${m.id}`}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {m.email || "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay miembros asignados
                            </p>
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
