"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { HiBars3, HiXMark } from "react-icons/hi2";

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
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200/60 bg-gradient-navbar shadow-lg backdrop-blur-xl dark:border-gray-800/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-blue-indigo shadow-md">
                                <span className="text-xl font-bold text-white">
                                    A
                                </span>
                            </div>
                            <span className="hidden bg-gradient-text-blue-indigo text-xl font-bold sm:inline-block">
                                Atlas Catalog
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-2 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section: Language Switcher + Login */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <LocaleSwitcher />
                        </div>
                        <Button
                            asChild
                            size="default"
                            className="hidden bg-gradient-blue-indigo px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-gradient-blue-indigo-hover hover:shadow-xl sm:inline-flex"
                        >
                            <Link href={`/${locale}/login`}>
                                {common("signIn")}
                            </Link>
                        </Button>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <HiXMark className="h-6 w-6" />
                            ) : (
                                <HiBars3 className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-900/95 md:hidden">
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 space-y-2">
                            <LocaleSwitcher />
                            <Button
                                asChild
                                size="default"
                                className="w-full bg-gradient-blue-indigo px-6 py-3 font-semibold text-white shadow-md hover:bg-gradient-blue-indigo-hover"
                            >
                                <Link href={`/${locale}/login`}>
                                    {common("signIn")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
