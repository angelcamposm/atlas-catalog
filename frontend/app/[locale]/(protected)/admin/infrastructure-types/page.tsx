"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { infrastructureTypesApi } from "@/lib/api/infrastructure-types";

export default function InfrastructureTypesPage() {
    return (
        <TaxonomyManager
            title="Infrastructure Types"
            description="Gestiona los tipos de infraestructura del catálogo"
            api={infrastructureTypesApi}
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
