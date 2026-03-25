"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    FaGithub,
    FaTwitter,
    FaLinkedin,
    FaDiscord,
    FaYoutube,
} from "react-icons/fa";
import {
    HiEnvelope,
    HiPhone,
    HiMapPin,
    HiDocumentText,
    HiBolt,
    HiShieldCheck,
    HiCube,
    HiChartBar,
    HiUserGroup,
    HiNewspaper,
    HiBriefcase,
    HiQuestionMarkCircle,
    HiAcademicCap,
} from "react-icons/hi2";

interface FooterProps {
    locale: string;
}

export function Footer({ locale }: FooterProps) {
    const t = useTranslations("footer");
    const common = useTranslations("common");

    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            {
                label: t("product.features"),
                href: "#features",
                icon: HiBolt,
            },
            {
                label: t("product.pricing"),
                href: `/${locale}/pricing`,
                icon: HiChartBar,
            },
            {
                label: t("product.documentation"),
                href: `/${locale}/docs`,
                icon: HiDocumentText,
            },
            {
                label: t("product.apiCatalog"),
                href: `/${locale}/dashboard`,
                icon: HiCube,
            },
        ],
        company: [
            {
                label: t("company.about"),
                href: `/${locale}/about`,
                icon: HiUserGroup,
            },
            {
                label: t("company.blog"),
                href: `/${locale}/blog`,
                icon: HiNewspaper,
            },
            {
                label: t("company.careers"),
                href: `/${locale}/careers`,
                icon: HiBriefcase,
            },
            {
                label: t("company.contact"),
                href: `/${locale}/contact`,
                icon: HiEnvelope,
            },
        ],
        resources: [
            {
                label: t("resources.guides"),
                href: `/${locale}/guides`,
                icon: HiAcademicCap,
            },
            {
                label: t("resources.help"),
                href: `/${locale}/help`,
                icon: HiQuestionMarkCircle,
            },
            {
                label: t("resources.community"),
                href: `/${locale}/community`,
                icon: HiUserGroup,
            },
            {
                label: t("resources.status"),
                href: `/${locale}/status`,
                icon: HiShieldCheck,
            },
        ],
        legal: [
            {
                label: t("legal.privacy"),
                href: `/${locale}/privacy`,
                icon: HiShieldCheck,
            },
            {
                label: t("legal.terms"),
                href: `/${locale}/terms`,
                icon: HiDocumentText,
            },
            {
                label: t("legal.cookies"),
                href: `/${locale}/cookies`,
                icon: HiDocumentText,
            },
            {
                label: t("legal.license"),
                href: `/${locale}/license`,
                icon: HiDocumentText,
            },
        ],
    };

    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com/angelcamposm/atlas-catalog",
            icon: FaGithub,
            color: "hover:text-gray-900 dark:hover:text-white",
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: FaTwitter,
            color: "hover:text-[#1DA1F2]",
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com",
            icon: FaLinkedin,
            color: "hover:text-[#0A66C2]",
        },
        {
            name: "Discord",
            href: "https://discord.com",
            icon: FaDiscord,
            color: "hover:text-[#5865F2]",
        },
        {
            name: "YouTube",
            href: "https://youtube.com",
            icon: FaYoutube,
            color: "hover:text-[#FF0000]",
        },
    ];

    const contactInfo = [
        {
            icon: HiEnvelope,
            label: "contact@atlascatalog.com",
            href: "mailto:contact@atlascatalog.com",
        },
        {
            icon: HiPhone,
            label: "+1 (555) 123-4567",
            href: "tel:+15551234567",
        },
        {
            icon: HiMapPin,
            label: "San Francisco, CA",
            href: "#",
        },
    ];

    return (
        <footer className="border-t border-gray-200 bg-linear-to-b from-white to-gray-50 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid gap-8 lg:grid-cols-6">
                    {/* Brand Column - Takes 2 columns */}
                    <div className="space-y-6 lg:col-span-2">
                        <Link
                            href={`/${locale}`}
                            className="group inline-flex items-center space-x-3 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue-indigo shadow-lg transition-transform group-hover:scale-105">
                                <span className="text-2xl font-bold text-white">
                                    A
                                </span>
                            </div>
                            <span className="bg-gradient-text-blue-indigo text-2xl font-bold">
                                Atlas Catalog
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {t("tagline")}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            {contactInfo.map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <a
                                        key={index}
                                        href={contact.href}
                                        className="group flex items-center space-x-3 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                    >
                                        <Icon className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                        <span>{contact.label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4 pt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`rounded-lg bg-gray-100 p-2.5 text-gray-600 transition-all hover:scale-110 hover:shadow-md dark:bg-gray-800 dark:text-gray-400 ${social.color}`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
                        {/* Product */}
                        <div>
                            <h3 className="mb-5 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                                <HiCube className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>{t("product.title")}</span>
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <Icon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="mb-5 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                                <HiUserGroup className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>{t("company.title")}</span>
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <Icon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="mb-5 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                                <HiAcademicCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>{t("resources.title")}</span>
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <Icon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="mb-5 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                                <HiShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>{t("legal.title")}</span>
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <Icon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 rounded-2xl bg-gradient-blue-indigo p-8 shadow-xl">
                    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                        <div className="flex-1">
                            <h3 className="mb-2 text-xl font-bold text-white">
                                {t("newsletter.title")}
                            </h3>
                            <p className="text-sm text-blue-100">
                                {t("newsletter.description")}
                            </p>
                        </div>
                        <div className="flex w-full max-w-md gap-2 md:w-auto">
                            <input
                                type="email"
                                placeholder={t("newsletter.placeholder")}
                                className="flex-1 rounded-lg border-0 bg-white/90 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                            />
                            <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700">
                                {t("newsletter.subscribe")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="flex items-center gap-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            <span>© {currentYear} Atlas Catalog.</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                {common("builtWith", { heart: "" })}
                                <span className="text-red-500">❤️</span>
                            </span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Version 1.0.0
                            </span>
                            <span>•</span>
                            <a
                                href={`/${locale}/changelog`}
                                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                {t("changelog")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
