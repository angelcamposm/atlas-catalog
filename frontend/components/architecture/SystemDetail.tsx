"use client";

import Link from "next/link";
import {
    HiServerStack,
    HiCubeTransparent,
    HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { System, Component } from "@/types/api";

interface SystemDetailProps {
    /** The system to display */
    system: System;
    /** List of components associated with this system */
    components: Component[];
    /** Locale for building internal links */
    locale: string;
}

/**
 * Detail view for an Architecture System.
 *
 * Shows the system metadata and the list of associated components.
 */
export function SystemDetail({
    system,
    components,
    locale,
}: SystemDetailProps) {
    return (
        <div className="space-y-6">
            {/* Main info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HiServerStack className="h-5 w-5 text-primary" />
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
                                {system.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                ID
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {system.id}
                            </p>
                        </div>
                    </div>

                    {system.description && (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Descripción
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {system.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Associated components */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HiCubeTransparent className="h-5 w-5 text-primary" />
                        Componentes Asociados
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                            {components.length}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {components.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay componentes asociados a este sistema.
                        </p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {components.map((component) => (
                                <li
                                    key={component.id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <span className="text-sm font-medium">
                                        {component.display_name ??
                                            component.name}
                                    </span>
                                    <Link
                                        href={`/${locale}/catalog/${component.slug}`}
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                        Ver detalle
                                        <HiArrowTopRightOnSquare className="h-3 w-3" />
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
