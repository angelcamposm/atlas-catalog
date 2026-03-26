"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { linkTypesApi } from "@/lib/api/integration";

export default function LinkCategoriesPage() {
    return (
        <TaxonomyManager
            title="Link Categories"
            description="Gestiona las categorías de enlaces del catálogo"
            api={linkTypesApi}
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
