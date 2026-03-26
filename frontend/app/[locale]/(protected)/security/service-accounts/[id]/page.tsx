"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { serviceAccountsApi, serviceAccountTokensApi } from "@/lib/api";
import { ServiceAccountDetail } from "@/components/security/ServiceAccountDetail";
import { TokenList } from "@/components/security/TokenList";
import type { ServiceAccount, ServiceAccountToken } from "@/types/api";

export default function ServiceAccountDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();

    const [account, setAccount] = useState<ServiceAccount | null>(null);
    const [tokens, setTokens] = useState<ServiceAccountToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [accountResponse, tokensResponse] = await Promise.all([
                serviceAccountsApi.getById(parseInt(id)),
                serviceAccountTokensApi.getAll(),
            ]);

            setAccount(accountResponse.data);
            // Filter tokens belonging to this service account
            const filtered = tokensResponse.data.filter(
                (t) => t.service_account_id === parseInt(id),
            );
            setTokens(filtered);
        } catch (err) {
            console.error("Error loading service account:", err);
            setError("Error al cargar la service account");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleGenerateToken = async () => {
        if (!account) return;
        try {
            const response = await serviceAccountTokensApi.create({
                service_account_id: account.id,
                name: `token-${Date.now()}`,
            });
            setTokens((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error generating token:", err);
            alert("Error al generar el token");
        }
    };

    const handleDeleteToken = async (tokenId: number) => {
        if (!confirm("¿Eliminar este token?")) return;
        try {
            await serviceAccountTokensApi.delete(tokenId);
            setTokens((prev) => prev.filter((t) => t.id !== tokenId));
        } catch (err) {
            console.error("Error deleting token:", err);
            alert("Error al eliminar el token");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                    <p className="text-gray-500 text-sm">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !account) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/security/service-accounts`}>
                        <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <HiArrowLeft className="w-4 h-4" />
                            Volver
                        </button>
                    </Link>
                </div>
                <p className="text-red-600">
                    {error ?? "Service account no encontrada"}
                </p>
                <button
                    onClick={loadData}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link
                    href={`/${locale}/security/service-accounts`}
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Service Accounts
                </Link>
                <span>/</span>
                <span className="text-gray-900">{account.name}</span>
            </div>

            {/* Service Account Detail */}
            <ServiceAccountDetail account={account} tokensCount={tokens.length} />

            {/* Tokens Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <TokenList
                    tokens={tokens}
                    onGenerate={handleGenerateToken}
                    onDelete={handleDeleteToken}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() =>
                        router.push(`/${locale}/security/service-accounts`)
                    }
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Volver a la lista
                </button>
            </div>
        </div>
    );
}
