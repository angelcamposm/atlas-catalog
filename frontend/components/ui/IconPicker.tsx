"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";

// Common Font Awesome icons organized by category
export const ICON_OPTIONS = {
    platforms: [
        { value: "fas fa-globe", label: "Globe (Web)", icon: "🌐" },
        { value: "fab fa-apple", label: "Apple (iOS)", icon: "🍎" },
        { value: "fab fa-android", label: "Android", icon: "🤖" },
        { value: "fas fa-desktop", label: "Desktop", icon: "🖥️" },
        { value: "fas fa-mobile-alt", label: "Mobile", icon: "📱" },
        { value: "fas fa-tablet-alt", label: "Tablet", icon: "📲" },
        { value: "fas fa-tv", label: "TV/Display", icon: "📺" },
    ],
    technology: [
        { value: "fas fa-cogs", label: "API/Services", icon: "⚙️" },
        { value: "fas fa-server", label: "Server", icon: "🖥️" },
        { value: "fas fa-database", label: "Database", icon: "🗄️" },
        { value: "fas fa-cloud", label: "Cloud", icon: "☁️" },
        { value: "fas fa-code", label: "Code", icon: "💻" },
        { value: "fas fa-file-code", label: "File Code", icon: "📄" },
        { value: "fas fa-terminal", label: "Terminal", icon: "⌨️" },
        { value: "fab fa-git-alt", label: "Git", icon: "🔀" },
        { value: "fab fa-docker", label: "Docker", icon: "🐳" },
        { value: "fab fa-aws", label: "AWS", icon: "☁️" },
        { value: "fab fa-azure", label: "Azure", icon: "☁️" },
        { value: "fab fa-google", label: "Google Cloud", icon: "☁️" },
    ],
    business: [
        { value: "fas fa-chart-line", label: "Analytics", icon: "📈" },
        { value: "fas fa-tasks", label: "Tasks", icon: "✅" },
        { value: "fas fa-comments", label: "Communication", icon: "💬" },
        { value: "fas fa-users", label: "Users/Team", icon: "👥" },
        { value: "fas fa-building", label: "Enterprise", icon: "🏢" },
        { value: "fas fa-briefcase", label: "Business", icon: "💼" },
        { value: "fas fa-shopping-cart", label: "E-commerce", icon: "🛒" },
    ],
    content: [
        { value: "fas fa-book", label: "Documentation", icon: "📚" },
        { value: "fas fa-file-medical-alt", label: "Reports", icon: "📋" },
        { value: "fas fa-newspaper", label: "News/Content", icon: "📰" },
        { value: "fas fa-images", label: "Media", icon: "🖼️" },
        { value: "fas fa-video", label: "Video", icon: "🎬" },
        { value: "fas fa-music", label: "Audio", icon: "🎵" },
    ],
    security: [
        { value: "fas fa-shield-alt", label: "Security", icon: "🛡️" },
        { value: "fas fa-lock", label: "Lock/Auth", icon: "🔒" },
        { value: "fas fa-key", label: "Key/Credentials", icon: "🔑" },
        { value: "fas fa-user-shield", label: "User Security", icon: "👤" },
    ],
    other: [
        { value: "fas fa-cube", label: "Generic/Module", icon: "📦" },
        { value: "fas fa-puzzle-piece", label: "Plugin/Extension", icon: "🧩" },
        { value: "fas fa-rocket", label: "Launch/Deploy", icon: "🚀" },
        { value: "fas fa-bolt", label: "Fast/Performance", icon: "⚡" },
        { value: "fas fa-star", label: "Featured", icon: "⭐" },
        { value: "fas fa-heart", label: "Favorite", icon: "❤️" },
    ],
};

// Flat list of all icons for easy lookup
export const ALL_ICONS = Object.values(ICON_OPTIONS).flat();

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    allowCustom?: boolean;
    label?: string;
}

export function IconPicker({
    value,
    onChange,
    required = false,
    disabled = false,
    allowCustom = true,
    label = "Icon",
}: IconPickerProps) {
    const [mode, setMode] = useState<"select" | "custom">(
        value && !ALL_ICONS.find((i) => i.value === value) ? "custom" : "select"
    );

    // Find the current icon in the list
    const currentIcon = ALL_ICONS.find((i) => i.value === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="icon">
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
            </Label>

            {allowCustom && (
                <div className="flex gap-2 mb-2">
                    <Button
                        type="button"
                        variant={mode === "select" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMode("select")}
                    >
                        Seleccionar
                    </Button>
                    <Button
                        type="button"
                        variant={mode === "custom" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMode("custom")}
                    >
                        Personalizado
                    </Button>
                </div>
            )}

            {mode === "select" ? (
                <Select
                    value={value}
                    onValueChange={onChange}
                    disabled={disabled}
                    required={required}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un icono">
                            {currentIcon && (
                                <span className="flex items-center gap-2">
                                    <span>{currentIcon.icon}</span>
                                    <span>{currentIcon.label}</span>
                                </span>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {Object.entries(ICON_OPTIONS).map(
                            ([category, icons]) => (
                                <div key={category}>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                        {category}
                                    </div>
                                    {icons.map((iconOption) => (
                                        <SelectItem
                                            key={iconOption.value}
                                            value={iconOption.value}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{iconOption.icon}</span>
                                                <span>{iconOption.label}</span>
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {iconOption.value}
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </div>
                            )
                        )}
                    </SelectContent>
                </Select>
            ) : (
                <div>
                    <Input
                        id="icon-custom"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g., fas fa-rocket"
                        disabled={disabled}
                        required={required}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Introduce una clase de Font Awesome (ej: fas fa-star,
                        fab fa-github)
                    </p>
                </div>
            )}
        </div>
    );
}
