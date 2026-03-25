"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventRow {
    id: string;
    component: string;
    time: string;
    status: "ok" | "warning" | "error";
}

interface EventsGridProps {
    environmentLabel?: string;
    timeScaleLabel?: string;
    rows: EventRow[];
    className?: string;
}

export function EventsGrid({
    environmentLabel = "Producción",
    timeScaleLabel = "Hora",
    rows,
    className,
}: EventsGridProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="border-b bg-muted/40 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Eventos
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Entorno de implementación: {environmentLabel}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <button className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-[11px] font-medium shadow-sm">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            {environmentLabel}
                        </button>
                        <span className="rounded-full bg-background px-2 py-1 text-[11px] font-medium">
                            {timeScaleLabel}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-[minmax(0,1.7fr)_repeat(6,minmax(0,1fr))] gap-px bg-border text-[11px] leading-tight">
                    <div className="bg-muted/70 px-3 py-2 font-medium text-muted-foreground">
                        Componentes del equipo
                    </div>
                    {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map(
                        (label) => (
                            <div
                                key={label}
                                className="bg-muted/70 px-2 py-2 text-center font-medium text-muted-foreground"
                            >
                                {label}
                            </div>
                        )
                    )}

                    {rows.map((row) => (
                        <>
                            <div
                                key={row.id + "-label"}
                                className="bg-background px-3 py-1.5 text-[11px] font-medium text-foreground"
                            >
                                {row.component}
                            </div>
                            {[0, 1, 2, 3, 4, 5].map((slot) => {
                                const isActive = slot === 2 || slot === 3;
                                const baseClasses =
                                    "flex items-center justify-center bg-background py-1.5";
                                const statusClasses =
                                    row.status === "ok"
                                        ? "text-emerald-500"
                                        : row.status === "warning"
                                        ? "text-amber-500"
                                        : "text-red-500";
                                return (
                                    <div
                                        key={row.id + "-slot-" + slot}
                                        className={cn(
                                            baseClasses,
                                            isActive && statusClasses
                                        )}
                                    >
                                        {isActive ? "●" : ""}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
