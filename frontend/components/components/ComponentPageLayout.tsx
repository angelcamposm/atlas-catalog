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
        <div className="container mx-auto space-y-5 px-6 py-4">
            <div>{header}</div>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="space-y-5">{children}</div>
                <aside className="space-y-4">{sidebar}</aside>
            </div>
        </div>
    );
}
