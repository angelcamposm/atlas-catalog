"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { groupTypesApi } from "@/lib/api/groups";

export default function GroupTypesPage() {
    return (
        <TaxonomyManager
            title="Group Types"
            description="Gestiona los tipos de grupos de la plataforma"
            api={groupTypesApi}
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
