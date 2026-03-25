"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    HiMagnifyingGlass,
    HiXMark,
    HiArrowRight,
    HiClock,
    HiCodeBracket,
    HiServerStack,
    HiUserGroup,
    HiCog6Tooth,
    HiDocumentText,
    HiHome,
    HiChartBar,
    HiLink,
} from "react-icons/hi2";

export interface CommandItem {
    /** Unique identifier */
    id: string;
    /** Display title */
    title: string;
    /** Optional subtitle/description */
    subtitle?: string;
    /** Icon component */
    icon?: React.ReactNode;
    /** Category for grouping */
    category?: string;
    /** URL to navigate to */
    href?: string;
    /** Action to perform on select */
    onSelect?: () => void;
    /** Keywords for search */
    keywords?: string[];
    /** Whether this is a recent item */
    isRecent?: boolean;
}

export interface CommandPaletteProps {
    /** Whether the palette is open */
    isOpen: boolean;
    /** Callback when palette should close */
    onClose: () => void;
    /** Locale for URL generation */
    locale: string;
    /** Additional custom items */
    customItems?: CommandItem[];
    /** Placeholder text */
    placeholder?: string;
}

// Default navigation items
const getDefaultItems = (locale: string): CommandItem[] => [
    // Navigation
    {
        id: "nav-dashboard",
        title: "Go to Dashboard",
        subtitle: "View your dashboard",
        icon: <HiHome className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/dashboard`,
        keywords: ["home", "main", "overview"],
    },
    {
        id: "nav-apis",
        title: "Go to APIs",
        subtitle: "Browse API catalog",
        icon: <HiCodeBracket className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/apis`,
        keywords: ["api", "catalog", "services"],
    },
    {
        id: "nav-infrastructure",
        title: "Go to Infrastructure",
        subtitle: "Manage clusters and nodes",
        icon: <HiServerStack className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/infrastructure`,
        keywords: ["cluster", "node", "kubernetes", "infra"],
    },
    {
        id: "nav-teams",
        title: "Go to Teams",
        subtitle: "View teams and members",
        icon: <HiUserGroup className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/teams`,
        keywords: ["team", "group", "members", "people"],
    },
    {
        id: "nav-analytics",
        title: "Go to Analytics",
        subtitle: "View metrics and reports",
        icon: <HiChartBar className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/analytics`,
        keywords: ["metrics", "reports", "statistics"],
    },
    {
        id: "nav-docs",
        title: "Go to Documentation",
        subtitle: "Read documentation",
        icon: <HiDocumentText className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/documentation`,
        keywords: ["docs", "help", "guide"],
    },
    {
        id: "nav-settings",
        title: "Go to Settings",
        subtitle: "Configure your preferences",
        icon: <HiCog6Tooth className="h-5 w-5" />,
        category: "Navigation",
        href: `/${locale}/settings`,
        keywords: ["config", "preferences", "options"],
    },

    // Actions
    {
        id: "action-new-api",
        title: "Create new API",
        subtitle: "Add a new API to the catalog",
        icon: <HiCodeBracket className="h-5 w-5" />,
        category: "Actions",
        href: `/${locale}/apis/new`,
        keywords: ["create", "add", "new", "api"],
    },
    {
        id: "action-new-cluster",
        title: "Create new Cluster",
        subtitle: "Add a new Kubernetes cluster",
        icon: <HiServerStack className="h-5 w-5" />,
        category: "Actions",
        href: `/${locale}/infrastructure/clusters/new`,
        keywords: ["create", "add", "new", "cluster", "kubernetes"],
    },
    {
        id: "action-new-link",
        title: "Create new Link",
        subtitle: "Add a service integration",
        icon: <HiLink className="h-5 w-5" />,
        category: "Actions",
        href: `/${locale}/integration/links/new`,
        keywords: ["create", "add", "new", "link", "integration"],
    },
];

export function CommandPalette({
    isOpen,
    onClose,
    locale,
    customItems = [],
    placeholder = "Type a command or search...",
}: CommandPaletteProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentItems, setRecentItems] = useState<string[]>([]);

    // Load recent items from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("command-palette-recent");
        if (stored) {
            try {
                setRecentItems(JSON.parse(stored));
            } catch {
                // Ignore invalid JSON
            }
        }
    }, []);

    // Save recent item
    const saveRecent = useCallback((id: string) => {
        setRecentItems((prev) => {
            const updated = [id, ...prev.filter((i) => i !== id)].slice(0, 5);
            localStorage.setItem(
                "command-palette-recent",
                JSON.stringify(updated)
            );
            return updated;
        });
    }, []);

    // All items
    const allItems = useMemo(() => {
        const defaults = getDefaultItems(locale);
        return [...defaults, ...customItems];
    }, [locale, customItems]);

    // Filtered items
    const filteredItems = useMemo(() => {
        if (!query) {
            // Show recent items first, then all items
            const recent = recentItems
                .map((id) => allItems.find((item) => item.id === id))
                .filter(Boolean)
                .map((item) => ({ ...item!, isRecent: true }));

            const others = allItems.filter(
                (item) => !recentItems.includes(item.id)
            );

            return [...recent, ...others];
        }

        const lowerQuery = query.toLowerCase();
        return allItems.filter((item) => {
            const searchText = [
                item.title,
                item.subtitle,
                ...(item.keywords || []),
            ]
                .join(" ")
                .toLowerCase();
            return searchText.includes(lowerQuery);
        });
    }, [query, allItems, recentItems]);

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};

        // Recent items first
        const recentFiltered = filteredItems.filter((item) => item.isRecent);
        if (recentFiltered.length > 0) {
            groups["Recent"] = recentFiltered;
        }

        // Other items by category
        filteredItems
            .filter((item) => !item.isRecent)
            .forEach((item) => {
                const category = item.category || "Other";
                if (!groups[category]) {
                    groups[category] = [];
                }
                groups[category].push(item);
            });

        return groups;
    }, [filteredItems]);

    // Flat list for keyboard navigation
    const flatItems = useMemo(() => {
        return Object.values(groupedItems).flat();
    }, [groupedItems]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Reset selection when filtered items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < flatItems.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault();
                    const item = flatItems[selectedIndex];
                    if (item) {
                        saveRecent(item.id);
                        if (item.href) {
                            router.push(item.href);
                        } else if (item.onSelect) {
                            item.onSelect();
                        }
                        onClose();
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        },
        [flatItems, selectedIndex, router, onClose, saveRecent]
    );

    // Handle item click
    const handleItemClick = useCallback(
        (item: CommandItem) => {
            saveRecent(item.id);
            if (item.href) {
                router.push(item.href);
            } else if (item.onSelect) {
                item.onSelect();
            }
            onClose();
        },
        [router, onClose, saveRecent]
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-command-palette]")) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        const selectedElement = listRef.current?.querySelector(
            `[data-index="${selectedIndex}"]`
        );
        selectedElement?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    if (!isOpen) return null;

    let currentIndex = 0;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Palette */}
            <div
                data-command-palette
                className="relative w-full max-w-xl mx-4 bg-card rounded-xl shadow-2xl border overflow-hidden"
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 border-b">
                    <HiMagnifyingGlass className="h-5 w-5 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 text-muted-foreground hover:text-foreground"
                        >
                            <HiXMark className="h-4 w-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground bg-muted rounded">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div
                    ref={listRef}
                    className="max-h-[50vh] overflow-y-auto py-2"
                >
                    {flatItems.length === 0 ? (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                            No results found for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        Object.entries(groupedItems).map(
                            ([category, items]) => (
                                <div key={category}>
                                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {category}
                                    </div>
                                    {items.map((item) => {
                                        const index = currentIndex++;
                                        const isSelected =
                                            index === selectedIndex;

                                        return (
                                            <button
                                                key={item.id}
                                                data-index={index}
                                                onClick={() =>
                                                    handleItemClick(item)
                                                }
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                                    isSelected
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "shrink-0",
                                                        isSelected
                                                            ? "text-primary"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {item.isRecent ? (
                                                        <HiClock className="h-5 w-5" />
                                                    ) : (
                                                        item.icon
                                                    )}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">
                                                        {item.title}
                                                    </div>
                                                    {item.subtitle && (
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {item.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <HiArrowRight className="h-4 w-4 shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-muted rounded">
                                ↑
                            </kbd>
                            <kbd className="px-1.5 py-0.5 bg-muted rounded">
                                ↓
                            </kbd>
                            to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-muted rounded">
                                ↵
                            </kbd>
                            to select
                        </span>
                    </div>
                    <span>
                        {flatItems.length} result
                        {flatItems.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Hook to manage command palette state
export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
    };
}
