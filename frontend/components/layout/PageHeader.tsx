import React from "react";

interface PageHeaderProps {
    icon?: React.ElementType;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

/**
 * PageHeader Component
 * Componente consistente para los headers de las páginas
 * Diseñado para trabajar con el scroll detection del DashboardLayout
 */
export function PageHeader({
    icon: Icon,
    title,
    subtitle,
    actions,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-8 w-8 text-primary" />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
