/**
 * EntityDetail — Vista detallada de una entidad de arquitectura con tabs.
 *
 * Tabs disponibles:
 *  - Resumen: información general de la entidad
 *  - Atributos: tabla CRUD de EntityAttribute
 *  - Componentes: lista de componentes asociados con enlace al catálogo
 *
 * @example
 * <EntityDetail
 *   entity={entity}
 *   attributes={attributes}
 *   components={components}
 *   locale="es"
 *   onAttributeChange={reloadAttributes}
 * />
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
    HiSquares2X2,
    HiCubeTransparent,
    HiArrowTopRightOnSquare,
    HiListBullet,
} from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { EntityAttributeTable } from "@/components/architecture/EntityAttributeTable";
import type { Entity, EntityAttribute, Component } from "@/types/api";

type ActiveTab = "overview" | "attributes" | "components";

interface EntityDetailProps {
    /** La entidad a mostrar */
    entity: Entity;
    /** Atributos de la entidad */
    attributes: EntityAttribute[];
    /** Componentes asociados */
    components: Component[];
    /** Locale para construir enlaces internos */
    locale: string;
    /** Callback para recargar atributos tras un cambio */
    onAttributeChange: () => void;
}

const tabs: { id: ActiveTab; label: string }[] = [
    { id: "overview", label: "Resumen" },
    { id: "attributes", label: "Atributos" },
    { id: "components", label: "Componentes" },
];

/**
 * Detail view for an Architecture Entity.
 *
 * Uses a simple state-based tab system (no Radix dependency).
 */
export function EntityDetail({
    entity,
    attributes,
    components,
    locale,
    onAttributeChange,
}: EntityDetailProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

    return (
        <div className="space-y-4">
            {/* Tab bar */}
            <div className="flex gap-1 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                            "px-4 py-2 text-sm font-medium transition-colors",
                            activeTab === tab.id
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground",
                        ].join(" ")}
                    >
                        {tab.label}
                        {tab.id === "attributes" && attributes.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                {attributes.length}
                            </span>
                        )}
                        {tab.id === "components" && components.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                {components.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiSquares2X2 className="h-5 w-5 text-primary" />
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
                                    {entity.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    ID
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {entity.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Estado
                                </p>
                                <div className="mt-1">
                                    <Badge
                                        variant={
                                            entity.is_enabled
                                                ? "primary"
                                                : "secondary"
                                        }
                                    >
                                        {entity.is_enabled
                                            ? "Activa"
                                            : "Inactiva"}
                                    </Badge>
                                </div>
                            </div>
                            {entity.domain_id && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Dominio ID
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {entity.domain_id}
                                    </p>
                                </div>
                            )}
                        </div>

                        {entity.description && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Descripción
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {entity.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Attributes tab */}
            {activeTab === "attributes" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiListBullet className="h-5 w-5 text-primary" />
                            Atributos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EntityAttributeTable
                            entityId={entity.id}
                            attributes={attributes}
                            onRefresh={onAttributeChange}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Components tab */}
            {activeTab === "components" && (
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
                                No hay componentes asociados a esta entidad.
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
            )}
        </div>
    );
}
