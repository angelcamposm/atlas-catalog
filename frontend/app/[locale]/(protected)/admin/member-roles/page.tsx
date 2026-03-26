"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { groupMemberRolesApi } from "@/lib/api/groups";

export default function MemberRolesPage() {
    return (
        <TaxonomyManager
            title="Member Roles"
            description="Gestiona los roles de los miembros de los grupos"
            api={groupMemberRolesApi}
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
