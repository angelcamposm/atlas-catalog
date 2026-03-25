"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiBuildingOffice2,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi2";
import { businessCapabilitiesApi } from "@/lib/api/architecture";
import type { BusinessCapability, BusinessCapabilitySystem } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { CapabilityDetail } from "@/components/business/CapabilityDetail";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CapabilityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const capabilityId = Number(params?.id);

    const [capability, setCapability] = useState<BusinessCapability | null>(
        null,
    );
    const [parent, setParent] = useState<BusinessCapability | null>(null);
    const [systems, setSystems] = useState<BusinessCapabilitySystem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadData = useCallback(async () => {
        if (!capabilityId) return;
        try {
            setLoading(true);
            setError(null);

            const capResponse =
                await businessCapabilitiesApi.getById(capabilityId);
            const cap = capResponse.data;
            setCapability(cap);

            // Load parent capability if referenced
            if (cap.parent_id) {
                try {
                    const parentResponse =
                        await businessCapabilitiesApi.getById(cap.parent_id);
                    setParent(parentResponse.data);
                } catch {
                    setParent(null);
                }
            }

            // Load associated systems (pivot records)
            try {
                const sysResponse =
                    await businessCapabilitiesApi.getCapabilitySystems(
                        capabilityId,
                    );
                setSystems(sysResponse.data);
            } catch {
                setSystems([]);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar la capacidad",
            );
        } finally {
            setLoading(false);
        }
    }, [capabilityId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async () => {
        if (!capability) return;
        try {
            setDeleting(true);
            await businessCapabilitiesApi.delete(capability.id);
            router.push(`/${locale}/business/capabilities`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al eliminar la capacidad",
            );
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-2 h-4 w-96" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !capability) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
                <p className="text-muted-foreground">
                    {error ?? "Capacidad no encontrada"}
                </p>
                <Link href={`/${locale}/business/capabilities`}>
                    <Button variant="outline" className="gap-2">
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Volver a capacidades
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={capability.name}
                subtitle="Detalle de capacidad de negocio"
                icon={HiBuildingOffice2}
                actions={
                    <div className="flex items-center gap-2">
                        <Link href={`/${locale}/business/capabilities`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <HiOutlineArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                                router.push(
                                    `/${locale}/business/capabilities?edit=${capability.id}`,
                                )
                            }
                        >
                            <HiOutlinePencil className="h-4 w-4" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <HiOutlineTrash className="h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                }
            />

            <CapabilityDetail
                capability={capability}
                parent={parent}
                systems={systems}
                locale={locale}
            />

            {/* Delete confirmation */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar capacidad?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente{" "}
                            <strong>{capability.name}</strong>. No se puede
                            deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Eliminando…" : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
