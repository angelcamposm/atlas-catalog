"use client";

import Link from "next/link";
import {
    HiBuildingOffice2,
    HiOutlineSquares2X2,
    HiChevronRight,
    HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessCapability, BusinessCapabilitySystem } from "@/types/api";

interface CapabilityDetailProps {
    /** The capability to display */
    capability: BusinessCapability;
    /** Parent capability, if any */
    parent: BusinessCapability | null;
    /** List of system relationships */
    systems: BusinessCapabilitySystem[];
    /** Locale for building internal links */
    locale: string;
}

/**
 * Detail view for a Business Capability.
 *
 * Shows the capability metadata, its parent relationship,
 * and the list of associated systems.
 */
export function CapabilityDetail({
    capability,
    parent,
    systems,
    locale,
}: CapabilityDetailProps) {
    return (
        <div className="space-y-6">
            {/* Main info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HiBuildingOffice2 className="h-5 w-5 text-primary" />
                        Información General
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Nombre
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {capability.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                ID
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {capability.id}
                            </p>
                        </div>
                    </div>

                    {capability.description && (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Descripción
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {capability.description}
                            </p>
                        </div>
                    )}

                    {/* Parent capability */}
                    {parent ? (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Capacidad padre
                            </p>
                            <Link
                                href={`/${locale}/business/capabilities/${parent.id}`}
                                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <HiChevronRight className="h-3 w-3" />
                                {parent.name}
                                <HiArrowTopRightOnSquare className="h-3 w-3" />
                            </Link>
                        </div>
                    ) : capability.parent_id ? (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Capacidad padre
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                ID #{capability.parent_id}
                            </p>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* Associated systems */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HiOutlineSquares2X2 className="h-5 w-5 text-primary" />
                        Sistemas Asociados
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                            {systems.length}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {systems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay sistemas asociados a esta capacidad.
                        </p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {systems.map((rel) => (
                                <li
                                    key={rel.id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <span className="text-sm font-medium">
                                        Sistema #{rel.system_id}
                                    </span>
                                    <Link
                                        href={`/${locale}/architecture/systems/${rel.system_id}`}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Ver detalle
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
