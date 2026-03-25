"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { CodeBlock } from "@/components/ui/code-block";
import {
    HiOutlineDocumentText,
    HiOutlineTableCells,
    HiOutlineCodeBracket,
    HiOutlineListBullet,
    HiOutlineLink,
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineCheckCircle,
    HiOutlinePhoto,
} from "react-icons/hi2";

// Example markdown content sections
const basicMarkdown = `# Título Principal (H1)

Este es un párrafo de texto normal. Puedes usar **texto en negrita**, *texto en cursiva*, o ***ambos***. También puedes usar ~~texto tachado~~.

## Subtítulo (H2)

Los párrafos se separan con líneas en blanco. Este es otro párrafo con \`código inline\` que se resalta de forma especial.

### Nivel 3 (H3)

#### Nivel 4 (H4)

##### Nivel 5 (H5)
`;

const listsMarkdown = `## Listas

### Lista sin ordenar

- Elemento uno
- Elemento dos
  - Sub-elemento 2.1
  - Sub-elemento 2.2
- Elemento tres

### Lista ordenada

1. Primer paso
2. Segundo paso
3. Tercer paso
   1. Sub-paso 3.1
   2. Sub-paso 3.2

### Lista de tareas (Checkboxes)

- [x] Tarea completada
- [x] Otra tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea pendiente
`;

const tablesMarkdown = `## Tablas

Las tablas se crean con pipes (|) y guiones (-):

| Nombre | Tipo | Estado | Versión |
|--------|------|--------|---------|
| User API | REST | ✅ Activo | 2.1.0 |
| Payment Service | gRPC | ✅ Activo | 1.5.3 |
| Analytics | GraphQL | ⚠️ Beta | 0.9.0 |
| Legacy Auth | SOAP | ❌ Deprecado | 1.0.0 |

### Tabla con alineación

| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
| Texto     | Texto  | Texto   |
| Más texto | Más    | 123.45  |
`;

const codeMarkdown = `## Bloques de Código

### JavaScript

\`\`\`javascript
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000
});

async function fetchUsers() {
  const response = await apiClient.get('/users');
  return response.data;
}
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}
\`\`\`

### Python

\`\`\`python
from dataclasses import dataclass
from typing import List

@dataclass
class User:
    id: str
    name: str
    email: str
    roles: List[str]

async def get_user(user_id: str) -> User:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/api/users/{user_id}")
        return User(**response.json())
\`\`\`

### YAML

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
  labels:
    app: users
spec:
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: users
\`\`\`

### JSON

\`\`\`json
{
  "name": "atlas-catalog",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "next": "^15.0.0"
  }
}
\`\`\`

### Bash / Shell

\`\`\`bash
# Deploy to production
docker build -t my-app:latest .
docker push registry.example.com/my-app:latest
kubectl apply -f k8s/deployment.yaml
\`\`\`
`;

const linksMarkdown = `## Enlaces e Imágenes

### Enlaces

- [Enlace externo a Google](https://google.com)
- [Enlace a la documentación](/docs)
- [Enlace con título](https://github.com "Visitar GitHub")

### Enlaces de referencia

Este es un [enlace de referencia][1] y este es [otro enlace][docs].

[1]: https://example.com
[docs]: https://docs.example.com

### Imágenes

![Logo de Next.js](https://nextjs.org/static/favicon/favicon-32x32.png)

### Auto-enlaces

URLs automáticos: https://atlas-catalog.com

Emails: contact@atlas-catalog.com
`;

const blockquotesMarkdown = `## Blockquotes y Notas

> Esta es una cita simple. Se puede usar para destacar información importante o citar a otras fuentes.

> **Nota importante:** Las citas pueden contener **formato** y \`código\`.
>
> También pueden tener múltiples párrafos.

> 💡 **Tip:** Usa blockquotes para tips y notas importantes en tu documentación.

> ⚠️ **Advertencia:** Ten cuidado con esta operación, puede ser destructiva.

> ❌ **Error:** Este endpoint ha sido deprecado en la versión 2.0.
`;

const horizontalRuleMarkdown = `## Separadores

El contenido de arriba...

---

...está separado del contenido de abajo con una línea horizontal.

***

También puedes usar asteriscos o guiones bajos.
`;

const completeApiDoc = `# API de Usuarios

Documentación completa de la API de gestión de usuarios del catálogo Atlas.

## Descripción General

La API de Usuarios permite gestionar usuarios, perfiles y permisos dentro del sistema. Todos los endpoints requieren autenticación JWT.

## Base URL

\`\`\`
https://api.atlas-catalog.com/v1
\`\`\`

## Autenticación

Todas las peticiones requieren un token JWT en el header:

\`\`\`bash
Authorization: Bearer <your-jwt-token>
\`\`\`

## Endpoints

### Listar Usuarios

\`\`\`http
GET /users
\`\`\`

**Query Parameters:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| page | number | Número de página (default: 1) |
| limit | number | Elementos por página (default: 20) |
| search | string | Búsqueda por nombre o email |
| role | string | Filtrar por rol |

**Ejemplo de respuesta:**

\`\`\`json
{
  "data": [
    {
      "id": "usr_123",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["admin", "developer"],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
\`\`\`

### Crear Usuario

\`\`\`http
POST /users
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "roles": ["developer"]
}
\`\`\`

> **Nota:** La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.

### Obtener Usuario

\`\`\`http
GET /users/:id
\`\`\`

### Actualizar Usuario

\`\`\`http
PUT /users/:id
\`\`\`

### Eliminar Usuario

\`\`\`http
DELETE /users/:id
\`\`\`

> ⚠️ **Advertencia:** Esta operación es irreversible. Solo usuarios con rol \`admin\` pueden ejecutarla.

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos suficientes |
| 404 | Not Found - Usuario no encontrado |
| 422 | Validation Error - Error de validación |
| 429 | Too Many Requests - Rate limit excedido |

## Rate Limiting

- **Autenticados:** 1000 requests/hora
- **No autenticados:** 100 requests/hora

## Changelog

- **v2.1.0** - Añadido filtro por rol
- **v2.0.0** - Breaking changes en formato de respuesta
- **v1.5.0** - Añadido endpoint de búsqueda
- **v1.0.0** - Release inicial

---

*Última actualización: Diciembre 2024*
`;

// Component code example
const usageCode = `import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

// Uso básico
<MarkdownRenderer content={markdownString} />

// Con clase personalizada
<MarkdownRenderer 
  content={markdownString} 
  className="max-w-3xl mx-auto"
/>

// Ejemplo con contenido dinámico
const [content, setContent] = useState("");

<textarea 
  value={content} 
  onChange={(e) => setContent(e.target.value)} 
/>
<MarkdownRenderer content={content} />`;

type TabId =
    | "basic"
    | "lists"
    | "tables"
    | "code"
    | "links"
    | "quotes"
    | "complete"
    | "editor";

interface Tab {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
    { id: "basic", label: "Texto Básico", icon: HiOutlineDocumentText },
    { id: "lists", label: "Listas", icon: HiOutlineListBullet },
    { id: "tables", label: "Tablas", icon: HiOutlineTableCells },
    { id: "code", label: "Código", icon: HiOutlineCodeBracket },
    { id: "links", label: "Enlaces", icon: HiOutlineLink },
    { id: "quotes", label: "Citas", icon: HiOutlineChatBubbleBottomCenterText },
    { id: "complete", label: "Doc Completa", icon: HiOutlineCheckCircle },
    { id: "editor", label: "Editor Live", icon: HiOutlinePhoto },
];

export default function MarkdownShowcasePage() {
    const [activeTab, setActiveTab] = useState<TabId>("basic");
    const [editorContent, setEditorContent] = useState(`# Prueba el Editor

Escribe tu **markdown** aquí y mira el resultado en tiempo real.

## Características

- Soporte para **negrita** y *cursiva*
- \`código inline\`
- Listas y tablas
- Y mucho más...

\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`
`);

    const getTabContent = () => {
        switch (activeTab) {
            case "basic":
                return basicMarkdown;
            case "lists":
                return listsMarkdown;
            case "tables":
                return tablesMarkdown;
            case "code":
                return codeMarkdown;
            case "links":
                return linksMarkdown;
            case "quotes":
                return blockquotesMarkdown + horizontalRuleMarkdown;
            case "complete":
                return completeApiDoc;
            case "editor":
                return editorContent;
            default:
                return basicMarkdown;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineDocumentText className="w-10 h-10 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">
                            Markdown Renderer
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Componente para renderizar contenido Markdown con
                        soporte completo para GitHub Flavored Markdown, syntax
                        highlighting y estilos responsivos.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 bg-card p-2 rounded-lg border border-border">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area - Side by side or stacked */}
                <div className="space-y-6">
                    {/* Source / Editor Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineCodeBracket className="w-5 h-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold text-foreground">
                                {activeTab === "editor"
                                    ? "Editor"
                                    : "Código Fuente (Markdown)"}
                            </h2>
                        </div>
                        {activeTab === "editor" ? (
                            <textarea
                                value={editorContent}
                                onChange={(e) =>
                                    setEditorContent(e.target.value)
                                }
                                className="w-full h-[300px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                placeholder="Escribe tu markdown aquí..."
                            />
                        ) : (
                            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                                <div className="p-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-2 text-xs text-gray-400">
                                        example.md
                                    </span>
                                </div>
                                <pre className="p-4 overflow-auto max-h-[300px] text-sm text-gray-300 font-mono whitespace-pre-wrap">
                                    {getTabContent()}
                                </pre>
                            </div>
                        )}
                    </section>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 border-t border-border" />
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                            Vista Previa
                        </span>
                        <div className="flex-1 border-t border-border" />
                    </div>

                    {/* Preview Section - Clean, integrated look */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-foreground">
                                    Renderizado
                                </h2>
                            </div>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                GitHub Flavored Markdown
                            </span>
                        </div>

                        {/* Preview content - flows naturally */}
                        <article
                            className="prose prose-slate dark:prose-invert max-w-none 
                            bg-card 
                            rounded-xl p-8 
                            border border-border
                            shadow-sm"
                        >
                            <MarkdownRenderer content={getTabContent()} />
                        </article>
                    </section>
                </div>

                {/* Usage Section */}
                <div className="mt-12 bg-card rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Cómo Usar el Componente
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        El componente{" "}
                        <code className="px-1.5 py-0.5 bg-muted rounded text-primary">
                            MarkdownRenderer
                        </code>{" "}
                        acepta una prop{" "}
                        <code className="px-1.5 py-0.5 bg-muted rounded text-primary">
                            content
                        </code>{" "}
                        con el texto en formato Markdown.
                    </p>
                    <CodeBlock
                        code={usageCode}
                        language="tsx"
                        title="Como usar MarkdownRenderer"
                        theme="dark"
                    />
                </div>

                {/* Features Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: "GitHub Flavored Markdown",
                            description:
                                "Soporte completo para tablas, checkboxes, strikethrough y más",
                            icon: "📝",
                        },
                        {
                            title: "Syntax Highlighting",
                            description:
                                "Resaltado de código en múltiples lenguajes con Prism",
                            icon: "🎨",
                        },
                        {
                            title: "Dark Mode",
                            description:
                                "Estilos adaptados automáticamente al tema oscuro",
                            icon: "🌙",
                        },
                        {
                            title: "Auto-linking Headers",
                            description:
                                "Los headings tienen enlaces ancla para compartir secciones",
                            icon: "🔗",
                        },
                        {
                            title: "Responsive Tables",
                            description:
                                "Las tablas son scrolleables en móviles",
                            icon: "📱",
                        },
                        {
                            title: "Copy Code Button",
                            description:
                                "Los bloques de código incluyen botón de copiar",
                            icon: "📋",
                        },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-card rounded-lg border border-border p-4"
                        >
                            <div className="text-2xl mb-2">{feature.icon}</div>
                            <h3 className="font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
