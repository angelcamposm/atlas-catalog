"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { componentTypesApi } from "@/lib/api/components";

export default function ComponentTypesPage() {
    return (
        <TaxonomyManager
            title="Component Types"
            description="Gestiona los tipos de componentes del catálogo"
            api={componentTypesApi}
            columns={[
                { key: "name", label: "Nombre" },
                { key: "description", label: "Descripción" },
            ]}
            formFields={[
                { name: "name", label: "Nombre", type: "text", required: true },
                { name: "description", label: "Descripción", type: "textarea" },
            ]}
        />
    );
}
