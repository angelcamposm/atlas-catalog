"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apisApi } from "@/lib/api/apis";
import type { ApiResponse } from "@/types/api";
import { EditApiForm } from "@/components/apis";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

export default function EditApiPage() {
    const params = useParams();
    const idParam = params?.id;
    const apiId = typeof idParam === "string" ? parseInt(idParam, 10) : NaN;

    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isFinite(apiId)) {
            setError("Identificador de API no válido.");
            setLoading(false);
            return;
        }

        const loadApi = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apisApi.getById(apiId);
                setData(response);
            } catch (err) {
                console.error("Error loading API:", err);
                setError("No se ha podido cargar esta API.");
            } finally {
                setLoading(false);
            }
        };

        void loadApi();
    }, [apiId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Cargando API...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <HiOutlineExclamationCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Error al cargar la API
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {error ?? "No se ha encontrado la API solicitada."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <EditApiForm api={data.data} />
            </div>
        </div>
    );
}
