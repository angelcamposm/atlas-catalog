"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { apiStatusesApi } from "@/lib/api/api-extended";

export default function ApiStatusesPage() {
    return (
        <TaxonomyManager
            title="API Statuses"
            description="Gestiona los estados de las APIs del catálogo"
            api={apiStatusesApi}
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
