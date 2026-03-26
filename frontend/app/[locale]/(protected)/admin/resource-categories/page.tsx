"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { resourceCategoriesApi } from "@/lib/api/resources";

export default function ResourceCategoriesPage() {
    return (
        <TaxonomyManager
            title="Resource Categories"
            description="Gestiona las categorías de recursos del catálogo"
            api={resourceCategoriesApi}
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
