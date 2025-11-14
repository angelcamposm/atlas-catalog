"use client";

import type { ReactNode } from "react";

interface ComponentPageLayoutProps {
    header: ReactNode;
    sidebar: ReactNode;
    children: ReactNode;
}

export function ComponentPageLayout({
    header,
    sidebar,
    children,
}: ComponentPageLayoutProps) {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>{header}</div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="space-y-6">{children}</div>
                <aside className="space-y-4">{sidebar}</aside>
            </div>
        </div>
    );
}
