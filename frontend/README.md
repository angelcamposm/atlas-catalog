# Atlas Catalog - Frontend

A modern Next.js application for visualizing and managing API catalogs with internationalization support.

## 🚀 Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org) with App Router
-   **Language**: TypeScript (strict mode)
-   **UI Library**: [React 19](https://react.dev)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
-   **Components**: [shadcn/ui](https://ui.shadcn.com)
-   **Icons**: [react-icons](https://react-icons.github.io/react-icons/) - Popular icon library with Font Awesome, Hero Icons, Material Design, and more
-   **Typography**: [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
-   **Internationalization**: [next-intl v4](https://next-intl.dev)
-   **API Client**: Custom REST client with TypeScript types
-   **Unit Testing**: [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com)
-   **E2E Testing**: [Playwright](https://playwright.dev)

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

-   Node.js 20.x or higher
-   pnpm 10.x or higher

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

Edit `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
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

-   ☀️ **Light** - Clean and bright interface
-   🌙 **Dark** - Easy on the eyes for extended use
-   💻 **System** - Automatically follows your OS preference

### Theme Features

-   ✅ Persistent theme selection (saved in localStorage)
-   ✅ No flash of unstyled content (FOUC)
-   ✅ System preference detection
-   ✅ Smooth transitions between themes
-   ✅ **Extensible architecture** - Ready for custom themes

### Using Themes

**Quick Toggle:**
Click the theme button in the dashboard top bar to cycle through themes.

**Profile Settings:**
Open your profile modal to select a specific theme with visual previews.

### Adding Custom Themes

The system is designed to support unlimited custom themes. See [`docs/THEMES.md`](./docs/THEMES.md) for:

-   Adding new themes
-   Customizing colors
-   Creating theme variants
-   Best practices

**Future themes ready to activate:**

-   🔵 Ocean Blue
-   🟣 Royal Purple
-   🌲 Forest Green
-   🌅 Sunset Orange
-   🎨 Custom themes

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

-   **Button**: Primary, secondary, outline, ghost variants
-   **Card**: Container for grouped content
-   **Badge**: Labels and status indicators
-   **Dialog**: Modal dialogs
-   **Form**: Form fields with validation
-   **Input**: Text inputs
-   **Select**: Dropdown selects
-   And many more...

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

-   `prose-sm`, `prose-base`, `prose-lg`, `prose-xl`, `prose-2xl` - Size variants
-   `dark:prose-invert` - Dark mode support
-   `prose-headings:font-bold` - Style specific elements
-   `max-w-none` - Remove default max-width

## 🌍 Internationalization (i18n)

The app supports multiple languages using [next-intl v4](https://next-intl.dev).

### Supported Languages

-   🇺🇸 English (`en`)
-   🇪🇸 Spanish (`es`)

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
# Development server with hot reload
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Run type checking
pnpm type-check

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

### Code Quality

-   **ESLint**: Configured for Next.js and TypeScript
-   **TypeScript**: Strict mode enabled
-   **Prettier**: (Optional) Add for code formatting

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Optional
NODE_ENV=development
```

## 🐳 Docker Support

### Development

```bash
docker-compose -f docker-compose.dev.yml up frontend
```

### Production

```bash
docker-compose up frontend
```

The Dockerfile uses multi-stage builds for optimized production images.

## 📚 Additional Resources

-   [Next.js Documentation](https://nextjs.org/docs)
-   [shadcn/ui Documentation](https://ui.shadcn.com)
-   [Tailwind CSS Documentation](https://tailwindcss.com)
-   [next-intl Documentation](https://next-intl.dev)
-   [React Documentation](https://react.dev)

## 🤝 Contributing

1. Follow the project's coding standards
2. Use TypeScript strict mode
3. Add translations for new features
4. Test in both light and dark modes
5. Ensure components are accessible
6. Write unit tests for new API modules
7. Add E2E tests for new user flows

## 🧪 Testing

Atlas Catalog uses a comprehensive testing strategy with **Jest** for unit tests and **Playwright** for E2E tests.

### Unit Tests (Jest)

Unit tests are located in `__tests__/` and test API modules, utilities, and component logic.

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test clusters-api
```

**Test coverage includes:**

-   API client and modules (`lib/api/`)
-   Zod schema validation
-   Utility functions

### E2E Tests (Playwright)

E2E tests are located in `e2e/` and test complete user flows in a real browser.

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run E2E tests with UI mode (interactive)
pnpm test:e2e:ui

# Run E2E tests in headed browser
pnpm test:e2e:headed

# Debug E2E tests
pnpm test:e2e:debug

# View test report
pnpm test:e2e:report
```

**E2E test structure:**

```text
e2e/
├── fixtures.ts              # Shared test utilities & data
├── auth/
│   └── login.spec.ts        # Authentication flows
├── infrastructure/
│   └── clusters.spec.ts     # Cluster CRUD operations
├── integration/
│   └── links.spec.ts        # Links & APIs CRUD
└── navigation/
    └── sidebar.spec.ts      # Navigation & routing
```

**E2E tests cover:**

-   🔐 Authentication (login, logout, protected routes)
-   📋 CRUD operations (Clusters, Links, APIs)
-   🧭 Navigation (sidebar, breadcrumbs, language switching)
-   ✅ Form validation
-   📱 Responsive behavior

### Running Tests in CI

```bash
# Run all tests
pnpm test && pnpm test:e2e
```

Playwright is configured to start the dev server automatically when running E2E tests.

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
