"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineCube } from "react-icons/hi2";
import { componentsApi } from "@/lib/api/components";
import type { UpdateComponentData } from "@/lib/api/components";
import { useResourceDetail } from "@/hooks/use-resource";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ComponentEditPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const id = params?.id as string;

    const { data: component, loading } = useResourceDetail(
        componentsApi.getBySlug,
        id,
    );

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Pre-populate the form once after data loads
    useEffect(() => {
        if (component) {
            setName(component.name ?? "");
            setSlug(component.slug ?? "");
            setDescription(component.description ?? "");
        }
    }, [component]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!component) return;
        setSubmitting(true);
        try {
            const payload: UpdateComponentData = {
                name,
                slug,
                description: description || undefined,
            };
            const response = await componentsApi.update(component.id, payload);
            router.push(
                `/${locale}/components/${response.data.slug || response.data.id}`,
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div
                role="status"
                aria-label="Cargando..."
                className="flex items-center justify-center min-h-[300px]"
            >
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <PageHeader
                title="Editar componente"
                subtitle="Modifica los datos del componente"
                icon={HiOutlineCube}
            />

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                    >
                        Nombre
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="slug"
                        className="block text-sm font-medium mb-1"
                    >
                        Slug
                    </label>
                    <input
                        id="slug"
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1"
                    >
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded hover:bg-muted"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
