# Atlas Catalog - Frontend

A modern Next.js application for visualizing and managing API catalogs with internationalization support.

> 💡 **¿Sólo quieres probar el proyecto?** No hace falta que instales nada localmente. Desde la raíz del repo ejecuta `docker compose -f docker-compose.full.yml up --build` y abre http://localhost:3001. Mira el [README principal](../README.md#-quick-start-recomendado) para el flujo completo.
>
> Esta guía es para desarrollo **local** del frontend (con hot-reload, IDE, tests, etc.).

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [react-icons](https://react-icons.github.io/react-icons/) - Popular icon library with Font Awesome, Hero Icons, Material Design, and more
- **Typography**: [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Internationalization**: [next-intl v4](https://next-intl.dev)
- **API Client**: Custom REST client with TypeScript types
- **Unit Testing**: [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com)
- **E2E Testing**: [Playwright](https://playwright.dev)

## 📁 Project Structure

```text
frontend/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Localized routes
│   │   ├── layout.tsx       # Root layout with i18n
│   │   ├── page.tsx         # Home page
│   │   ├── apis/            # API catalog pages
│   │   ├── api-types/       # API types pages
│   │   └── lifecycles/      # Lifecycle pages
│   └── globals.css          # Global styles & CSS variables
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── home/                # Home page sections
│   ├── forms/               # Form components
│   └── LocaleSwitcher.tsx   # Language switcher
├── lib/
│   ├── api-client.ts        # Base API client
│   ├── api/                 # API endpoint modules
│   └── utils.ts             # Utility functions
├── i18n/
│   ├── config.ts            # i18n configuration
│   ├── routing.ts           # Route definitions
│   └── request.ts           # Server-side i18n config
├── messages/
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
├── types/
│   └── api.ts               # TypeScript API types
├── __tests__/               # Unit tests (Jest)
├── e2e/                     # E2E tests (Playwright)
│   ├── auth/                # Authentication tests
│   ├── infrastructure/      # Clusters, Nodes tests
│   ├── integration/         # Links, APIs tests
│   └── navigation/          # Navigation tests
└── public/                  # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.x or higher
- El **backend Laravel** corriendo y accesible (por defecto en `http://localhost:8080/api`).
    - La forma más simple: `docker compose -f docker-compose.full.yml up -d postgres redis init-db app nginx` desde la raíz del repo.
    - O ejecútalo localmente con `php artisan serve` (ver [README principal](../README.md#desarrollo-local-sin-docker-avanzado)).

### Installation

1. Install pnpm (if not already installed):

```bash
npm install -g pnpm@latest
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` if your backend runs on a different host/port:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

The app will hot-reload as you edit files.

## 🎨 Theme System

Atlas Catalog features a **comprehensive and extensible theme system** powered by `next-themes`.

### Available Themes

- ☀️ **Light** - Clean and bright interface
- 🌙 **Dark** - Easy on the eyes for extended use
- 💻 **System** - Automatically follows your OS preference

### Theme Features

- ✅ Persistent theme selection (saved in localStorage)
- ✅ No flash of unstyled content (FOUC)
- ✅ System preference detection
- ✅ Smooth transitions between themes
- ✅ **Extensible architecture** - Ready for custom themes

### Using Themes

**Quick Toggle:**
Click the theme button in the dashboard top bar to cycle through themes.

**Profile Settings:**
Open your profile modal to select a specific theme with visual previews.

### Adding Custom Themes

The system is designed to support unlimited custom themes. See [`docs/THEMES.md`](./docs/THEMES.md) for:

- Adding new themes
- Customizing colors
- Creating theme variants
- Best practices

**Future themes ready to activate:**

- 🔵 Ocean Blue
- 🟣 Royal Purple
- 🌲 Forest Green
- 🌅 Sunset Orange
- 🎨 Custom themes

## 🎨 UI Components with shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/) - a collection of beautifully designed, accessible components built with Radix UI and Tailwind CSS.

### Adding Components

Components are added on-demand rather than installed as dependencies:

```bash
# Add individual components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add badge

# Add multiple at once
pnpm dlx shadcn@latest add button card badge dialog
```

### Available Components

Components are stored in `components/ui/` and include:

- **Button**: Primary, secondary, outline, ghost variants
- **Card**: Container for grouped content
- **Badge**: Labels and status indicators
- **Dialog**: Modal dialogs
- **Form**: Form fields with validation
- **Input**: Text inputs
- **Select**: Dropdown selects
- And many more...

### Component Configuration

The shadcn configuration is in `components.json`:

```json
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "tailwind": {
        "config": "tailwind.config.ts",
        "css": "app/globals.css",
        "baseColor": "neutral",
        "cssVariables": true
    },
    "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks"
    }
}
```

### Theming

The project uses CSS variables for theming, defined in `app/globals.css`:

```css
@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: 222.2 47.4% 11.2%;
        /* ... more variables */
    }

    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        /* ... dark mode variables */
    }
}
```

## 📝 Typography with Tailwind Typography

Use the `prose` class for beautifully styled content:

```tsx
<article className="prose dark:prose-invert lg:prose-xl">
    <h1>Article Title</h1>
    <p>Your content here...</p>
    <ul>
        <li>Beautiful typography</li>
        <li>Automatic styling</li>
    </ul>
</article>
```

**Prose modifiers:**

- `prose-sm`, `prose-base`, `prose-lg`, `prose-xl`, `prose-2xl` - Size variants
- `dark:prose-invert` - Dark mode support
- `prose-headings:font-bold` - Style specific elements
- `max-w-none` - Remove default max-width

## 🌍 Internationalization (i18n)

The app supports multiple languages using [next-intl v4](https://next-intl.dev).

### Supported Languages

- 🇺🇸 English (`en`)
- 🇪🇸 Spanish (`es`)

### Adding Translations

1. Add translations to `messages/en.json` and `messages/es.json`:

```json
{
    "home": {
        "title": "Welcome to Atlas Catalog",
        "description": "Your API inventory"
    }
}
```

2. Use in components:

```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <h1>{t('title')}</h1>
    <p>{t('description')}</p>
  );
}
```

### Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const t = await getTranslations("home");
    return <h1>{t("title")}</h1>;
}
```

### Adding New Locales

1. Add locale to `i18n/config.ts`:

```typescript
export const locales = ["en", "es", "fr"] as const;
```

2. Create `messages/fr.json` with translations
3. The app will automatically support the new locale

## 🔌 API Integration

### API Client

The custom API client is in `lib/api-client.ts`:

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const response = await apiClient.get("/apis");

// POST request
const data = await apiClient.post("/apis", {
    name: "My API",
    description: "Description",
});
```

### Typed API Modules

API endpoints are organized in `lib/api/`:

```typescript
import { apisApi } from "@/lib/api";

// Get all APIs with pagination
const { data, meta } = await apisApi.getAll(page);

// Get single API
const api = await apisApi.getById(id);

// Create API
const newApi = await apisApi.create(apiData);

// Update API
const updated = await apisApi.update(id, apiData);

// Delete API
await apisApi.delete(id);
```

### TypeScript Types

API types are defined in `types/api.ts`:

```typescript
export interface Api {
    id: number;
    name: string;
    description: string;
    endpoint: string;
    version: string;
    // ... more fields
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        total: number;
        per_page: number;
    };
}
```

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload (puerto 3001)
pnpm dev

# Production build
pnpm build

# Start production server (puerto 3001)
pnpm start

# Run linter
pnpm lint

# TypeScript type checking
pnpm exec tsc --noEmit

# Run unit tests (Jest)
pnpm test
pnpm test:watch

# Run E2E tests (Playwright)
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:headed
pnpm test:e2e:debug
pnpm test:e2e:report
```

### Code Quality

- **ESLint**: Configured for Next.js and TypeScript
- **TypeScript**: Strict mode enabled
- **Prettier**: (Optional) Add for code formatting

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Optional
NODE_ENV=development
```

## 🐳 Docker Support

El frontend forma parte del stack completo orquestado en la raíz del repo. Lo más cómodo es usarlo desde allí:

```bash
# Stack completo (frontend + backend + DB + redis) — modo producción
docker compose -f docker-compose.full.yml up --build

# Stack completo en modo desarrollo (hot-reload)
docker compose -f docker-compose.full-dev.yml up --build
```

Para construir sólo la imagen del frontend:

```bash
docker build -t atlas-frontend:latest -f frontend/Dockerfile ./frontend
```

El `Dockerfile` usa multi-stage builds para imágenes de producción optimizadas. La variable `NEXT_PUBLIC_API_URL` se inyecta en build time vía `--build-arg`.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [next-intl Documentation](https://next-intl.dev)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Follow the project's coding standards
2. Use TypeScript strict mode
3. Add translations for new features
4. Test in both light and dark modes
5. Ensure components are accessible
6. Write unit tests for new API modules
7. Add E2E tests for new user flows

## 🧪 Testing

Atlas Catalog usa **Jest** para tests unitarios/integración y **Playwright** para E2E.

> 📊 **Snapshot actual**
>
> | Suite      | Estado                                 | Cobertura (L / S / B / F)         |
> | ---------- | -------------------------------------- | --------------------------------- |
> | Jest       | 94 suites · **1.402 tests** · ✅ pasan | **76,4% / 73,7% / 72,8% / 68,4%** |
> | Playwright | 48 specs                               | n/a (E2E)                         |

### Unit / Integration tests (Jest)

Ubicados en `__tests__/`. Mockean el cliente HTTP, así que **no necesitan backend ni servidor de Next**.

```bash
# Todos los tests
pnpm test

# Modo watch
pnpm test:watch

# Un test concreto
pnpm test clusters-api

# Con cobertura (reporte en frontend/coverage/)
pnpm test -- --coverage
```

**Cubren:**

- Cliente API y módulos (`lib/api/`)
- Validación con esquemas Zod
- Funciones de utilidad y formatters
- Hooks y contextos (auth, etc.)
- Lógica de componentes

### E2E tests (Playwright)

Ubicados en `e2e/`. Ejecutan flujos completos en un navegador real (Chromium por defecto).

**Prerrequisitos**:

1. Tener el **backend levantado** en `http://localhost:8080` (la URL configurada en `.env.local`):
    ```bash
    # Desde la raíz del repo
    docker compose -f docker-compose.full.yml up -d postgres redis init-db app nginx
    ```
2. Instalar los navegadores de Playwright (sólo la primera vez):
    ```bash
    pnpm exec playwright install --with-deps chromium
    ```

> Playwright arrancará el servidor Next.js automáticamente (`webServer` en `playwright.config.ts`). Si ya lo tienes corriendo en `:3001`, lo reutiliza.

**Comandos**:

```bash
pnpm test:e2e            # headless
pnpm test:e2e:ui         # UI mode (interactivo)
pnpm test:e2e:headed     # navegador visible
pnpm test:e2e:debug      # debug paso a paso
pnpm test:e2e:report     # ver el último reporte HTML
```

Para apuntar a otra URL del frontend (p.ej. la del contenedor):

```bash
E2E_BASE_URL=http://localhost:3001 pnpm test:e2e
```

**Estructura**:

```text
e2e/
├── fixtures.ts              # Utilidades y datos compartidos
├── global-setup.ts          # Auth storage state inicial
├── auth/                    # Login, logout, rutas protegidas
├── infrastructure/          # Clusters, nodes, etc.
├── integration/             # Links, APIs
└── navigation/              # Sidebar, breadcrumbs, idiomas
```

### En CI

```bash
# Lint + types + unit tests + E2E
pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm test:e2e
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
