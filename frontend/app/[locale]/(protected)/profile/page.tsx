"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineCog6Tooth,
    HiOutlineCamera,
    HiOutlineBuildingOffice2,
    HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

// Simulated user data - in a real app this would come from auth context or API
const mockUser = {
    id: 1,
    name: "Usuario Demo",
    email: "demo@atlas-catalog.com",
    email_verified_at: "2024-01-15T10:30:00Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    avatar: null,
    role: "Administrator",
    // Groups the user belongs to
    groups: [
        { id: 1, name: "platform-team", label: "Platform Team", icon: "server" },
        { id: 2, name: "security-team", label: "Security Team", icon: "shield" },
    ],
    // Stats
    stats: {
        apisOwned: 5,
        componentsOwned: 12,
        teamsJoined: 2,
    },
};

export default function ProfilePage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [user] = useState(mockUser);
    const [profileImage, setProfileImage] = useState<string | null>(user.avatar);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getIconColor = (icon: string | null) => {
        const colors: Record<string, string> = {
            server: "bg-blue-500",
            shield: "bg-purple-500",
            "credit-card": "bg-green-500",
            "shopping-cart": "bg-orange-500",
            users: "bg-indigo-500",
            default: "bg-gray-500",
        };
        return colors[icon || "default"] || colors.default;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    return (
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="Mi Perfil"
                subtitle="Información de tu cuenta y preferencias"
                actions={
                    <Link href={`/${locale}/settings`}>
                        <Button variant="outline" className="gap-2">
                            <HiOutlineCog6Tooth className="h-4 w-4" />
                            Configuración
                        </Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="relative mb-4">
                                <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={user.name}
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 rounded-full bg-background border p-2 shadow-md hover:bg-muted transition-colors"
                                >
                                    <HiOutlineCamera className="h-4 w-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Name & Role */}
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <Badge variant="secondary" className="mt-2">
                                {user.role}
                            </Badge>

                            {/* Contact Info */}
                            <div className="mt-4 w-full space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <HiOutlineEnvelope className="h-4 w-4" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.email_verified_at && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <HiOutlineShieldCheck className="h-4 w-4" />
                                        <span>Email verificado</span>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="mt-4 flex items-center gap-2">
                                <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    user.is_active ? "bg-green-500" : "bg-gray-400"
                                )} />
                                <span className="text-sm text-muted-foreground">
                                    {user.is_active ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-500/10 p-3">
                                        <HiOutlineClipboardDocumentList className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{user.stats.apisOwned}</p>
                                        <p className="text-sm text-muted-foreground">APIs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-500/10 p-3">
                                        <HiOutlineBuildingOffice2 className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{user.stats.componentsOwned}</p>
                                        <p className="text-sm text-muted-foreground">Componentes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-500/10 p-3">
                                        <HiOutlineUserGroup className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{user.stats.teamsJoined}</p>
                                        <p className="text-sm text-muted-foreground">Equipos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Teams Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineUserGroup className="h-5 w-5" />
                                Mis Equipos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.groups.length > 0 ? (
                                <div className="space-y-3">
                                    {user.groups.map((group) => (
                                        <Link
                                            key={group.id}
                                            href={`/${locale}/teams/${group.id}`}
                                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <div
                                                className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                                    getIconColor(group.icon)
                                                )}
                                            >
                                                <span className="text-lg font-bold">
                                                    {(group.label || group.name).charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {group.label || group.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    @{group.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No perteneces a ningún equipo todavía
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineUser className="h-5 w-5" />
                                Información de la Cuenta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        ID de Usuario
                                    </p>
                                    <p className="font-mono">{user.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Miembro desde
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineCalendar className="h-4 w-4" />
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email verificado
                                    </p>
                                    <p>{formatDate(user.email_verified_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Estado
                                    </p>
                                    <Badge variant={user.is_active ? "success" : "secondary"}>
                                        {user.is_active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
