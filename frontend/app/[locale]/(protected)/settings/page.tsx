"use client";

import { use, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
    HiCog6Tooth,
    HiMoon,
    HiSun,
    HiBell,
    HiComputerDesktop,
    HiLanguage,
} from "react-icons/hi2";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import packageJson from "@/package.json";

export default function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const t = useTranslations("settings");
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [weeklyDigest, setWeeklyDigest] = useState(true);

    const themes = [
        { value: "light", label: t("theme.light"), icon: HiSun },
        { value: "dark", label: t("theme.dark"), icon: HiMoon },
        { value: "system", label: t("theme.system"), icon: HiComputerDesktop },
    ];

    const languages = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "es", name: "Español", flag: "🇪🇸" },
    ];

    const handleLanguageChange = (langCode: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${langCode}`);
        router.push(newPath);
    };

    return (
        <div className="container mx-auto space-y-6 p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <HiCog6Tooth className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("description")}
                    </p>
                </div>
            </div>

            {/* Theme Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiSun className="h-5 w-5" />
                        {t("appearance.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("appearance.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-base mb-3 block">
                            {t("appearance.themeLabel")}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                const isActive = theme === themeOption.value;

                                return (
                                    <button
                                        key={themeOption.value}
                                        onClick={() =>
                                            setTheme(themeOption.value)
                                        }
                                        className={`
                                            flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                                            ${
                                                isActive
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                                            }
                                        `}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                        <span
                                            className={`font-medium ${
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {themeOption.label}
                                        </span>
                                        {isActive && (
                                            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {theme === "system"
                                ? t("appearance.systemNote")
                                : t("appearance.currentTheme", {
                                      theme: theme || "system",
                                  })}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiLanguage className="h-5 w-5" />
                        {t("language.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("language.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-base mb-3 block">
                            {t("language.label")}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {languages.map((lang) => {
                                const isActive = locale === lang.code;

                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() =>
                                            handleLanguageChange(lang.code)
                                        }
                                        className={`
                                            flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                                            ${
                                                isActive
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                                            }
                                        `}
                                    >
                                        <span className="text-2xl">
                                            {lang.flag}
                                        </span>
                                        <div className="flex-1 text-left">
                                            <div
                                                className={`font-medium ${
                                                    isActive
                                                        ? "text-primary"
                                                        : "text-foreground"
                                                }`}
                                            >
                                                {lang.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {lang.code.toUpperCase()}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {t("language.current", {
                                language:
                                    languages.find((l) => l.code === locale)
                                        ?.name || locale,
                            })}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card className="opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiBell className="h-5 w-5" />
                        {t("notifications.title")}
                        <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full font-normal">
                            {t("comingSoon")}
                        </span>
                    </CardTitle>
                    <CardDescription>
                        {t("notifications.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="email-notifications"
                                className="text-base"
                            >
                                {t("notifications.email.title")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("notifications.email.description")}
                            </p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            disabled
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="push-notifications"
                                className="text-base"
                            >
                                {t("notifications.push.title")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("notifications.push.description")}
                            </p>
                        </div>
                        <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                            disabled
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="weekly-digest"
                                className="text-base"
                            >
                                {t("notifications.digest.title")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("notifications.digest.description")}
                            </p>
                        </div>
                        <Switch
                            id="weekly-digest"
                            checked={weeklyDigest}
                            onCheckedChange={setWeeklyDigest}
                            disabled
                        />
                    </div>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiComputerDesktop className="h-5 w-5" />
                        {t("system.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">
                            {t("system.version")}
                        </span>
                        <span className="font-medium">
                            {packageJson.version}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">
                            {t("system.environment")}
                        </span>
                        <span className="font-medium">
                            {process.env.NODE_ENV}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">
                            {t("system.currentTheme")}
                        </span>
                        <span className="font-medium capitalize">
                            {theme || "system"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
