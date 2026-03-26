"use client";

import {
    HiOutlineComputerDesktop,
    HiOutlineGlobeAlt,
    HiOutlineHashtag,
} from "react-icons/hi2";
import type { ServiceAccount } from "@/types/api";

/**
 * Tarjeta de resumen de una service account.
 *
 * @example
 * <ServiceAccountDetail account={account} tokensCount={3} />
 */
interface ServiceAccountDetailProps {
    /** Service account a mostrar */
    account: ServiceAccount;
    /** Número de tokens asociados (opcional, se muestra como badge) */
    tokensCount?: number;
}

export function ServiceAccountDetail({
    account,
    tokensCount,
}: ServiceAccountDetailProps) {
    const initial = account.name.charAt(0).toUpperCase();
    const createdDate = new Date(account.created_at).toLocaleDateString(
        "es-ES",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xl font-bold flex-shrink-0">
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {account.name}
                    </h2>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <HiOutlineComputerDesktop
                            data-testid="icon-computer"
                            className="w-4 h-4"
                        />
                        <span>Service Account</span>
                    </div>
                </div>
                {tokensCount !== undefined && (
                    <span className="inline-flex items-center justify-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                        {tokensCount}
                    </span>
                )}
            </div>

            {/* Details */}
            <dl className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                    <HiOutlineHashtag
                        data-testid="icon-hash"
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                    />
                    <dt className="text-gray-500 w-24">ID</dt>
                    <dd className="font-medium text-gray-900">{account.id}</dd>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <HiOutlineGlobeAlt
                        data-testid="icon-globe"
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                    />
                    <dt className="text-gray-500 w-24">Namespace</dt>
                    <dd className="font-medium text-gray-900">
                        {account.namespace ?? (
                            <span className="text-gray-400 italic">
                                Sin namespace
                            </span>
                        )}
                    </dd>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 flex-shrink-0" />
                    <dt className="text-gray-500 w-24">Creada</dt>
                    <dd className="text-gray-700">{createdDate}</dd>
                </div>
            </dl>
        </div>
    );
}
