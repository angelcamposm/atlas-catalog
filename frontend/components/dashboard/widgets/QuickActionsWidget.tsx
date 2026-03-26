"use client";

import Link from "next/link";
import {
    HiOutlineBolt,
    HiOutlinePlusCircle,
    HiOutlineMagnifyingGlass,
    HiOutlineGlobeAlt,
    HiOutlineServer,
    HiOutlineDocumentText,
} from "react-icons/hi2";

const actions = [
    {
        label: "New API",
        href: "/en/catalog/apis",
        icon: HiOutlinePlusCircle,
    },
    {
        label: "Browse Catalog",
        href: "/en/catalog",
        icon: HiOutlineGlobeAlt,
    },
    {
        label: "Search",
        href: "/en/catalog/apis",
        icon: HiOutlineMagnifyingGlass,
    },
    {
        label: "Clusters",
        href: "/en/infrastructure/clusters",
        icon: HiOutlineServer,
    },
    {
        label: "Documentation",
        href: "/en/catalog/apis",
        icon: HiOutlineDocumentText,
    },
];

/**
 * Dashboard widget with quick navigation links to common actions.
 */
export function QuickActionsWidget() {
    return (
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <HiOutlineBolt className="w-4 h-4" />
                <span>Quick Actions</span>
            </div>
            <ul className="flex flex-col gap-1">
                {actions.map(({ label, href, icon: Icon }) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="flex items-center gap-2 text-sm rounded-md px-2 py-1.5 hover:bg-accent transition-colors"
                        >
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
