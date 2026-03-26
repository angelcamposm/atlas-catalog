"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { apiTypesApi } from "@/lib/api/api-types";

export default function ApiTypesPage() {
    return (
        <TaxonomyManager
            title="API Types"
            description="Gestiona los tipos de APIs disponibles en el catálogo"
            api={apiTypesApi}
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
