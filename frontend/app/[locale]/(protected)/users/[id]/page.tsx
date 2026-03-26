"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi2";
import { usersApi } from "@/lib/api";
import type { User } from "@/types/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { UserDetail } from "@/components/organization/UserDetail";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "en";
    const userId = params?.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUser = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await usersApi.getById(Number(userId));
            setUser(response.data);
        } catch (err) {
            setError("Error loading user");
            console.error("Error loading user:", err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">{error || "User not found"}</p>
                <Button
                    onClick={() => router.push(`/${locale}/users`)}
                    variant="outline"
                >
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={`/${locale}/users`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Users
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <HiOutlinePencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        <HiOutlineTrash className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <UserDetail user={user} />
        </div>
    );
}
