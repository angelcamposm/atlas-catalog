"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { clusterTypesApi } from "@/lib/api/infrastructure";

export default function ClusterTypesPage() {
    return (
        <TaxonomyManager
            title="Cluster Types"
            description="Gestiona los tipos de clústeres de infraestructura"
            api={clusterTypesApi}
            columns={[
                { key: "name", label: "Nombre" },
            ]}
            formFields={[
                { name: "name", label: "Nombre", type: "text", required: true },
            ]}
        />
    );
}
