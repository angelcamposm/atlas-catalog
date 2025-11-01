"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useThemeSettings } from "@/hooks/use-theme-settings";
import { lightThemes, darkThemes } from "@/lib/theme-config";
import {
    HiCog6Tooth,
    HiMoon,
    HiSun,
    HiBell,
    HiComputerDesktop,
    HiLanguage,
    HiSparkles,
    HiFire,
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

    const {
        colorMode,
        lightTheme,
        darkTheme,
        activeMode,
        setColorMode,
        setLightTheme,
        setDarkTheme,
    } = useThemeSettings();

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [weeklyDigest, setWeeklyDigest] = useState(true);

    const colorModes = [
        { value: "light" as const, label: t("colorMode.light"), icon: HiSun },
        { value: "dark" as const, label: t("colorMode.dark"), icon: HiMoon },
        {
            value: "system" as const,
            label: t("colorMode.system"),
            icon: HiComputerDesktop,
        },
    ];

    const lightThemeOptions = [
        {
            value: "default" as const,
            label: t("lightTheme.default"),
            icon: HiSun,
        },
        {
            value: "orange" as const,
            label: t("lightTheme.orange"),
            icon: HiFire,
        },
        {
            value: "green" as const,
            label: t("lightTheme.green"),
            icon: HiSparkles,
        },
    ];

    const darkThemeOptions = [
        {
            value: "default" as const,
            label: t("darkTheme.default"),
            icon: HiMoon,
        },
        {
            value: "blue" as const,
            label: t("darkTheme.blue"),
            icon: HiSparkles,
        },
        {
            value: "purple" as const,
            label: t("darkTheme.purple"),
            icon: HiSparkles,
        },
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
                <CardContent className="space-y-6">
                    {/* Color Mode Selection */}
                    <div>
                        <Label className="text-base mb-3 block">
                            {t("appearance.colorModeLabel")}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {colorModes.map((mode) => {
                                const Icon = mode.icon;
                                const isActive = colorMode === mode.value;

                                return (
                                    <button
                                        key={mode.value}
                                        onClick={() => setColorMode(mode.value)}
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
                                            {mode.label}
                                        </span>
                                        {isActive && (
                                            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {colorMode === "system"
                                ? t("appearance.systemNote")
                                : t("appearance.currentMode", {
                                      mode: colorMode,
                                  })}
                        </p>
                    </div>

                    {/* Light Theme Selection - Only show if light or system (and system resolves to light) */}
                    {(colorMode === "light" ||
                        (colorMode === "system" && activeMode === "light")) && (
                        <div>
                            <Label className="text-base mb-3 block">
                                {t("appearance.lightThemeLabel")}
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {lightThemeOptions.map((themeOption) => {
                                    const Icon = themeOption.icon;
                                    const isActive =
                                        lightTheme === themeOption.value;

                                    return (
                                        <button
                                            key={themeOption.value}
                                            onClick={() =>
                                                setLightTheme(themeOption.value)
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
                        </div>
                    )}

                    {/* Dark Theme Selection - Only show if dark or system (and system resolves to dark) */}
                    {(colorMode === "dark" ||
                        (colorMode === "system" && activeMode === "dark")) && (
                        <div>
                            <Label className="text-base mb-3 block">
                                {t("appearance.darkThemeLabel")}
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {darkThemeOptions.map((themeOption) => {
                                    const Icon = themeOption.icon;
                                    const isActive =
                                        darkTheme === themeOption.value;

                                    return (
                                        <button
                                            key={themeOption.value}
                                            onClick={() =>
                                                setDarkTheme(themeOption.value)
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
                        </div>
                    )}
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
                            {colorMode}{" "}
                            {activeMode === "light" &&
                                lightTheme !== "default" &&
                                `(${lightTheme})`}
                            {activeMode === "dark" &&
                                darkTheme !== "default" &&
                                `(${darkTheme})`}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
