"use client";

import { CodeBlock, InlineCode } from "@/components/ui/code-block";
import {
    FlowDiagram,
    createNode,
    createEdge,
} from "@/components/ui/flow-diagram";
import { MermaidDiagram } from "@/components/ui/mermaid-diagram";
import {
    HiOutlineCodeBracket,
    HiOutlineRectangleGroup,
    HiOutlineArrowsRightLeft,
} from "react-icons/hi2";

// Sample code snippets
const typescriptCode = `import { ApiService } from '@atlas/sdk';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export async function getUser(userId: string): Promise<UserProfile> {
  const client = new ApiService({
    baseUrl: process.env.API_URL,
    apiKey: process.env.API_KEY,
  });

  const response = await client.users.get(userId);
  return response.data;
}`;

const pythonCode = `from atlas_sdk import ApiClient
from typing import Optional

class UserService:
    def __init__(self, api_key: str):
        self.client = ApiClient(api_key=api_key)
    
    async def get_user(self, user_id: str) -> Optional[dict]:
        """Fetch a user by their ID."""
        try:
            response = await self.client.users.get(user_id)
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch user: {e}")
            return None`;

const curlCode = `# Get user by ID
curl -X GET "https://api.atlas-catalog.com/v1/users/123" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Create a new API
curl -X POST "https://api.atlas-catalog.com/v1/apis" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Payment Gateway",
    "version": "2.1.0",
    "type": "REST"
  }'`;

// Sample flow diagram data
const flowNodes = [
    createNode(
        "gateway",
        "API Gateway",
        { x: 0, y: 150 },
        { type: "api", status: "healthy", version: "2.1.0" }
    ),
    createNode(
        "auth",
        "Auth Service",
        { x: 250, y: 0 },
        { type: "service", status: "healthy", version: "1.5.0" }
    ),
    createNode(
        "users",
        "User Service",
        { x: 250, y: 150 },
        { type: "service", status: "healthy", version: "3.2.1" }
    ),
    createNode(
        "orders",
        "Order Service",
        { x: 250, y: 300 },
        { type: "service", status: "warning", version: "2.0.0" }
    ),
    createNode(
        "postgres",
        "PostgreSQL",
        { x: 500, y: 75 },
        { type: "database", status: "healthy" }
    ),
    createNode(
        "redis",
        "Redis Cache",
        { x: 500, y: 225 },
        { type: "database", status: "healthy" }
    ),
    createNode(
        "queue",
        "Message Queue",
        { x: 500, y: 375 },
        { type: "queue", status: "healthy" }
    ),
    createNode(
        "ext-payment",
        "Payment Provider",
        { x: 750, y: 300 },
        { type: "external", status: "unknown" }
    ),
];

const flowEdges = [
    createEdge("gateway", "auth", { animated: true }),
    createEdge("gateway", "users"),
    createEdge("gateway", "orders"),
    createEdge("auth", "postgres"),
    createEdge("users", "postgres"),
    createEdge("users", "redis"),
    createEdge("orders", "postgres"),
    createEdge("orders", "queue"),
    createEdge("orders", "ext-payment", {
        animated: true,
        style: { stroke: "#f97316" },
    }),
];

// Mermaid diagrams
const sequenceDiagram = `sequenceDiagram
    participant Client
    participant Gateway
    participant AuthService
    participant UserService
    participant Database

    Client->>Gateway: POST /api/login
    Gateway->>AuthService: Validate credentials
    AuthService->>Database: Query user
    Database-->>AuthService: User data
    AuthService->>AuthService: Generate JWT
    AuthService-->>Gateway: JWT Token
    Gateway-->>Client: 200 OK + Token
    
    Client->>Gateway: GET /api/profile
    Gateway->>AuthService: Verify JWT
    AuthService-->>Gateway: Valid
    Gateway->>UserService: Get profile
    UserService->>Database: Query profile
    Database-->>UserService: Profile data
    UserService-->>Gateway: Profile
    Gateway-->>Client: 200 OK + Profile`;

const architectureDiagram = `flowchart TB
    subgraph Clients
        web[Web App]
        mobile[Mobile App]
        cli[CLI Tool]
    end

    subgraph "API Layer"
        gateway[API Gateway]
        auth[Auth Service]
    end

    subgraph Services
        user[User Service]
        api[API Service]
        catalog[Catalog Service]
    end

    subgraph "Data Layer"
        pg[(PostgreSQL)]
        redis[(Redis)]
        es[(Elasticsearch)]
    end

    web --> gateway
    mobile --> gateway
    cli --> gateway

    gateway --> auth
    gateway --> user
    gateway --> api
    gateway --> catalog

    user --> pg
    api --> pg
    catalog --> pg
    catalog --> es
    auth --> redis`;

const erDiagram = `erDiagram
    API ||--o{ API_VERSION : has
    API ||--|| API_TYPE : has
    API ||--|| LIFECYCLE : has
    API }o--o{ TAG : tagged_with
    
    API {
        uuid id PK
        string name
        string description
        uuid type_id FK
        uuid lifecycle_id FK
        timestamp created_at
    }
    
    API_VERSION {
        uuid id PK
        uuid api_id FK
        string version
        string status
        json spec
    }
    
    API_TYPE {
        uuid id PK
        string name
        string description
    }
    
    LIFECYCLE {
        uuid id PK
        string name
        string color
        int order
    }
    
    TAG {
        uuid id PK
        string name
        string color
    }`;

export default function DiagramsShowcasePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Componentes de Visualización
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Componentes reutilizables para mostrar código, diagramas
                        de flujo y arquitecturas.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                {/* Code Block Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <HiOutlineCodeBracket className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl font-semibold text-foreground">
                            Code Block
                        </h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Componente para mostrar código con syntax highlighting,
                        números de línea y botón de copiar. Soporta múltiples
                        lenguajes y temas claro/oscuro.
                    </p>

                    <div className="grid gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                TypeScript
                            </h3>
                            <CodeBlock
                                code={typescriptCode}
                                language="typescript"
                                title="user-service.ts"
                                highlightLines={[7, 8, 9]}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                Python
                            </h3>
                            <CodeBlock
                                code={pythonCode}
                                language="python"
                                title="user_service.py"
                                theme="dark"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                cURL / Bash
                            </h3>
                            <CodeBlock
                                code={curlCode}
                                language="bash"
                                title="api-examples.sh"
                                showLineNumbers={false}
                            />
                        </div>

                        <div className="p-4 bg-card rounded-lg border border-border">
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                Inline Code
                            </h3>
                            <p className="text-muted-foreground">
                                También puedes usar{" "}
                                <InlineCode>código inline</InlineCode> para
                                referencias rápidas como{" "}
                                <InlineCode>npm install</InlineCode> o nombres
                                de funciones como{" "}
                                <InlineCode>getUser()</InlineCode>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Flow Diagram Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <HiOutlineRectangleGroup className="w-8 h-8 text-accent" />
                        <h2 className="text-2xl font-semibold text-foreground">
                            Flow Diagram (React Flow)
                        </h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Diagrama interactivo de flujo construido con React Flow.
                        Soporta nodos personalizados para servicios, bases de
                        datos, colas y APIs externas. Los nodos son
                        arrastrables.
                    </p>

                    <FlowDiagram
                        nodes={flowNodes}
                        edges={flowEdges}
                        height="600px"
                        onNodeClick={(node) =>
                            console.log("Clicked node:", node)
                        }
                    />

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                type: "service",
                                label: "Service",
                                color: "blue",
                            },
                            {
                                type: "database",
                                label: "Database",
                                color: "purple",
                            },
                            { type: "queue", label: "Queue", color: "orange" },
                            {
                                type: "api",
                                label: "API Gateway",
                                color: "green",
                            },
                            {
                                type: "external",
                                label: "External",
                                color: "gray",
                            },
                            { type: "event", label: "Event", color: "yellow" },
                        ].map((item) => (
                            <div
                                key={item.type}
                                className="flex items-center gap-2 p-2 bg-card rounded border border-border"
                            >
                                <div
                                    className={`w-3 h-3 rounded bg-${item.color}-500`}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mermaid Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <HiOutlineArrowsRightLeft className="w-8 h-8 text-secondary" />
                        <h2 className="text-2xl font-semibold text-foreground">
                            Mermaid Diagrams
                        </h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Diagramas generados con Mermaid.js. Ideales para
                        diagramas de secuencia, arquitectura, ER y más. Se
                        pueden definir en formato texto.
                    </p>

                    <div className="grid gap-8">
                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                Diagrama de Secuencia
                            </h3>
                            <MermaidDiagram
                                chart={sequenceDiagram}
                                title="Flujo de Autenticación"
                                showSource
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                Arquitectura del Sistema
                            </h3>
                            <MermaidDiagram
                                chart={architectureDiagram}
                                title="Microservices Architecture"
                                showSource
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-3">
                                Diagrama Entidad-Relación
                            </h3>
                            <MermaidDiagram
                                chart={erDiagram}
                                title="API Catalog Schema"
                                showSource
                            />
                        </div>
                    </div>
                </section>

                {/* Usage Examples */}
                <section className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Uso de los Componentes
                    </h2>

                    <CodeBlock
                        code={`// Importar componentes
import { CodeBlock, InlineCode } from "@/components/ui/code-block";
import { FlowDiagram, createNode, createEdge } from "@/components/ui/flow-diagram";
import { MermaidDiagram } from "@/components/ui/mermaid-diagram";

// Usar CodeBlock
<CodeBlock
  code={myCode}
  language="typescript"
  title="example.ts"
  highlightLines={[5, 6, 7]}
  theme="dark"
/>

// Crear FlowDiagram
const nodes = [
  createNode("api", "API Gateway", { x: 0, y: 0 }, { type: "api" }),
  createNode("db", "Database", { x: 200, y: 0 }, { type: "database" }),
];
const edges = [createEdge("api", "db")];

<FlowDiagram nodes={nodes} edges={edges} height="400px" />

// Usar MermaidDiagram
<MermaidDiagram
  chart={\`
    sequenceDiagram
      Client->>Server: Request
      Server-->>Client: Response
  \`}
  title="Simple Flow"
  showSource
/>`}
                        language="tsx"
                        title="usage-example.tsx"
                        theme="dark"
                    />
                </section>
            </div>
        </div>
    );
}
