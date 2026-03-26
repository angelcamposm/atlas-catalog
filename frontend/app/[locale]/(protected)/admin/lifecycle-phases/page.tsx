"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { lifecyclesApi } from "@/lib/api/lifecycles";

export default function LifecyclePhasesPage() {
    return (
        <TaxonomyManager
            title="Lifecycle Phases"
            description="Gestiona las fases del ciclo de vida de los componentes"
            api={lifecyclesApi}
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
