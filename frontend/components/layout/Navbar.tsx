"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    locale: string;
}

export function Navbar({ locale }: NavbarProps) {
    const t = useTranslations("nav");
    const common = useTranslations("common");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "#features", label: t("features") },
        { href: "#how-it-works", label: t("howItWorks") },
        { href: "#testimonials", label: t("testimonials") },
        { href: `/${locale}/apis`, label: t("catalog") },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center space-x-2"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-lg font-bold">A</span>
                            </div>
                            <span className="hidden text-xl font-bold sm:inline-block">
                                Atlas Catalog
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section: Language Switcher + Login */}
                    <div className="flex items-center space-x-4">
                        <LocaleSwitcher />
                        <Button asChild size="sm">
                            <Link href={`/${locale}/login`}>
                                {common("login")}
                            </Link>
                        </Button>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 border-t border-border px-4 pb-3 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
