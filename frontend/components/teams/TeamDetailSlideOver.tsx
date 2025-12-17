"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { groupsApi } from "@/lib/api/groups";
import type { Group } from "@/types/api";
import { SlideOver } from "@/components/ui/SlideOver";
import TeamDetailContent from "./TeamDetailContent";
import { Button } from "@/components/ui/Button";

interface Props {
    open: boolean;
    onClose: () => void;
    teamId?: number;
    locale?: string;
}

export function TeamDetailSlideOver({
    open,
    onClose,
    teamId,
    locale = "es",
}: Props) {
    const router = useRouter();
    const [team, setTeam] = useState<Group | null>(null);
    const [members, setMembers] = useState<import("@/types/api").User[] | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTeam = useCallback(async () => {
        if (!teamId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await groupsApi.getById(Number(teamId));
            setTeam(response.data);

            // try load members (may return [] or 404)
            try {
                const membersResponse = await groupsApi.getMembers(
                    Number(teamId)
                );
                setMembers(membersResponse as any);
            } catch (err) {
                // ignore if endpoint not available
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
        if (open) loadTeam();
    }, [open, loadTeam]);

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={team ? team.label || team.name : "Equipo"}
            description={team ? team.description ?? undefined : undefined}
            mode="push"
            showOverlay={false}
            side="right"
            size="lg"
            icon={<HiOutlineUserGroup className="h-6 w-6 text-primary" />}
            loading={loading}
            footer={
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            onClose();
                            router.push(`/${locale}/teams/${teamId}`);
                        }}
                    >
                        Abrir en pantalla completa
                    </Button>
                </div>
            }
        >
            {team && <TeamDetailContent team={team} members={members} locale={locale} />}
            {error && <p className="text-destructive">{error}</p>}
        </SlideOver>
    );
}

export default TeamDetailSlideOver;
