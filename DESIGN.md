# Atlas Catalog · Frontend Design Reference

> Documento de referencia único para el diseño del frontend de **Atlas Catalog**.
> Inspirado en el formato `design.md` de [Stitch (Google)](https://stitch.withgoogle.com/docs/design-md/overview).
> Esta es una vista consolidada y verificada del estado **real** del código en [frontend/](frontend/).

| Campo            | Valor                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| Producto         | Atlas Catalog · Software / Service Catalog (estilo Backstage / Port.io) |
| Stack            | Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4     |
| Componentes base | shadcn/ui · Radix UI · Lucide + react-icons                             |
| Internalización  | next-intl (`en`, `es`) — prefijo de locale obligatorio                  |
| Estado/Tema      | next-themes (modo + tema cromático)                                     |
| Tipografías      | Inter (cuerpo) · Plus Jakarta Sans (display) · JetBrains Mono (código)  |
| Versión actual   | `frontend@0.1.78`                                                       |

---

## 1. Visión y Principios de Diseño

Atlas Catalog es un **portal interno para desarrolladores** que centraliza la información de APIs, componentes, infraestructura, equipos y políticas de seguridad. La UI debe transmitir **claridad técnica, confianza y eficiencia operacional**.

### 1.1 Principios fundamentales

1. **Golden Ratio (φ ≈ 1.618) + Fibonacci**
   Todo el espaciado, la tipografía y las proporciones derivan de `φ` y de la sucesión de Fibonacci (8, 13, 21, 34, 55, 89, 144). Centralizado en [frontend/lib/design-system.ts](frontend/lib/design-system.ts).
2. **Component-First Architecture**
   Toda UI nueva se construye combinando primitivas de [frontend/components/ui/](frontend/components/ui/) (shadcn/ui + Radix). No se usa HTML estilizado a mano salvo en componentes de marketing.
3. **Tokens sobre clases hardcodeadas**
   Colores, radios y espaciados se consumen vía variables CSS (`--primary`, `--muted`, `--radius`, `--spacing-md`…). Evitar `bg-blue-500` o `p-[15px]`.
4. **Accesibilidad WCAG 2.1 AA**
   Navegación por teclado, focus rings visibles (`--ring`), contraste validado en ambas familias de temas y `suppressHydrationWarning` controlado en `<html>`.
5. **Mobile-first y responsive**
   Breakpoints estándar de Tailwind (`sm/md/lg/xl/2xl`). Las pantallas con sidebar degradan a mobile drawer.
6. **TDD + Simplicidad** (alineado con [AGENTS.md](AGENTS.md) y [.github/copilot-instructions.md](.github/copilot-instructions.md))
   Tests en Jest + Testing Library precediendo a la implementación. Funciones pequeñas, nombres descriptivos.

### 1.2 Audiencia y tono

- **Audiencia**: ingenieros de plataforma, arquitectos, SREs, líderes técnicos.
- **Tono UI**: profesional, neutral, denso pero ordenado. Evitar lenguaje marketing dentro del producto autenticado.
- **Excepción**: la landing pública (`/[locale]`) puede usar gradientes y mensajes promocionales.

---

## 2. Tokens del Design System

Fuente única de verdad: [frontend/lib/design-system.ts](frontend/lib/design-system.ts) y las variables CSS de [frontend/app/globals.css](frontend/app/globals.css).

### 2.1 Color

#### Paletas semánticas (modo claro · default)

| Rol            | Variable CSS             | Hex       | Uso                                   |
| -------------- | ------------------------ | --------- | ------------------------------------- |
| Primary        | `--primary`              | `#3b82f6` | CTA, links, estados activos           |
| Secondary      | `--secondary`            | `#6366f1` | Acento secundario, gradientes         |
| Accent         | `--accent`               | `#10b981` | Éxito, positivo                       |
| Destructive    | `--destructive`          | `#ef4444` | Errores, acciones destructivas        |
| Background     | `--background`           | `#ffffff` | Fondo de página                       |
| Foreground     | `--foreground`           | `#334155` | Texto base (slate-700, lectura larga) |
| Muted          | `--muted` / `--muted-fg` | `#f8fafc` | Fondos sutiles, placeholders          |
| Border / Input | `--border` / `--input`   | `#e2e8f0` | Bordes y campos                       |
| Ring (focus)   | `--ring`                 | `#3b82f6` | Outline de focus                      |

#### Jerarquía tipográfica de color (light → dark)

| Token              | Light     | Dark      | Uso                    |
| ------------------ | --------- | --------- | ---------------------- |
| `--text-primary`   | `#0f172a` | `#f8fafc` | Títulos H1/H2          |
| `--text-secondary` | `#1e293b` | `#e2e8f0` | Subtítulos             |
| `--text-body`      | `#334155` | `#cbd5e1` | Texto largo            |
| `--text-muted`     | `#64748b` | `#94a3b8` | Metadatos              |
| `--text-subtle`    | `#94a3b8` | `#64748b` | Placeholders / hints   |
| `--text-disabled`  | `#cbd5e1` | `#475569` | Estados deshabilitados |

#### Charts (Recharts)

`--chart-1`…`--chart-5` mapean a azul · esmeralda · ámbar · rojo · violeta y se ajustan por modo.

### 2.2 Tipografía

Definida en [frontend/app/layout.tsx](frontend/app/layout.tsx).

| Familia        | Variable CSS     | Uso                                        |
| -------------- | ---------------- | ------------------------------------------ |
| Inter          | `--font-inter`   | Texto del cuerpo, UI general               |
| Plus Jakarta   | `--font-display` | Headings, labels, overline (más expresiva) |
| JetBrains Mono | `--font-mono`    | Código, snippets, valores técnicos         |

Escala de tamaños (golden ratio + Fibonacci):

```
xs   12px      lg   18px      3xl  34px
sm   14px      xl   21px      4xl  55px
base 16px      2xl  24px      5xl  89px
```

Line-heights: `tight 1.2` · `normal 1.5` · `relaxed 1.618`.

Clases utilitarias listas en `globals.css`: `.text-heading-1`…`.text-heading-6`, `.text-body-lg/.text-body/.text-body-sm`, `.text-label`, `.text-label-sm`, `.text-caption`, `.text-overline`. Úsalas en lugar de redefinir tamaños inline.

### 2.3 Espaciado (Fibonacci, en px)

| Token | px  | Uso                          |
| ----- | --- | ---------------------------- |
| `xs`  | 8   | Gaps internos pequeños       |
| `sm`  | 13  | Padding de chips/badges      |
| `md`  | 21  | Padding base de cards        |
| `lg`  | 34  | Separación entre secciones   |
| `xl`  | 55  | Padding de página en desktop |
| `2xl` | 89  | Hero / landing               |
| `3xl` | 144 | Separadores macro            |

### 2.4 Border radius

`--radius: 0.75rem (12px)` como base. Variantes derivadas: `--radius-sm 0.5rem` · `--radius-md 0.625rem` · `--radius-lg 0.75rem` · `--radius-xl 1rem`. Avatares y pills usan `rounded-full`.

### 2.5 Sombras (elevación)

`shadows.sm/md/lg/xl/2xl/inner/none` en [frontend/lib/design-system.ts](frontend/lib/design-system.ts). En cards usa `shadow-md`; en modales/popovers `shadow-xl`.

### 2.6 Z-index

```
dropdown 1000 · sticky 1100 · fixed 1200 · modalBackdrop 1300
modal 1400 · popover 1500 · tooltip 1600
```

### 2.7 Transiciones

`fast 150ms` · `base 300ms` · `slow 500ms` · `slower 800ms`. Tema **no** transiciona (`disableTransitionOnChange` en ThemeProvider) para evitar flicker.

### 2.8 Layout (constantes)

| Elemento            | Valor              |
| ------------------- | ------------------ |
| Navbar (desktop)    | `80px`             |
| Navbar (móvil)      | `64px`             |
| Sidebar expandido   | `280px`            |
| Sidebar colapsado   | `80px` (icon-only) |
| IconBar (favoritos) | `64px` fijo        |

Variables CSS: `--navbar-height`, `--sidebar-width`, `--sidebar-width-collapsed`.

### 2.9 Breakpoints

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

---

## 3. Sistema de Temas

Sistema de **dos niveles** definido en [frontend/lib/theme-config.ts](frontend/lib/theme-config.ts) y documentado en [frontend/docs/THEMES.md](frontend/docs/THEMES.md).

1. **Color Mode**: `light` · `dark` · `system`
2. **Color Theme** (variante cromática aplicada como clase en `<html>`):
    - **Light**: `default` · `orange` · `green`
    - **Dark**: `default` · `blue` · `purple`

Provider raíz en [frontend/app/layout.tsx](frontend/app/layout.tsx):

```tsx
<ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    themes={["light", "dark", "blue", "purple", "green", "orange"]}
>
```

Cada tema redefine las mismas variables CSS, por lo que **todos los componentes son tema-agnósticos** mientras consuman tokens (`bg-primary`, `text-foreground`, `border-border`…).

Cómo añadir un tema: ver sección "Cómo Añadir un Nuevo Tema" en [frontend/docs/THEMES.md](frontend/docs/THEMES.md).

---

## 4. Arquitectura de Información

### 4.1 Routing

- App Router con segmento de locale obligatorio: `app/[locale]/...`
- Middleware `next-intl` redirige `/` → `/{defaultLocale}` ([frontend/middleware.ts](frontend/middleware.ts)).
- Dos zonas:
    - **Pública**: `app/[locale]/page.tsx` (landing) y `app/[locale]/login/`.
    - **Protegida**: `app/[locale]/(protected)/...` con su propio `layout.tsx` que monta `MainLayout` con sidebar.

### 4.2 Mapa de secciones (zona protegida)

Detectadas en [frontend/app/[locale]/(protected)/](<frontend/app/[locale]/(protected)/>):

| Grupo              | Rutas principales                                                           |
| ------------------ | --------------------------------------------------------------------------- |
| **Dashboard**      | `/dashboard`                                                                |
| **Architecture**   | `/architecture`, `/lifecycles`, `/types`                                    |
| **Business**       | `/business/capabilities`, `/business/domains`, `/taxonomy/business-tiers`   |
| **Catalog**        | `/apis`, `/components`, `/business/environments`, `/resources`              |
| **CI/CD**          | `/ci-cd/dashboard`, `/ci-cd/releases`, `/ci-cd/servers`, `/ci-cd/workflows` |
| **Infrastructure** | `/infrastructure/clusters`, `/infrastructure/nodes`                         |
| **Organization**   | `/teams`, `/users`                                                          |
| **Security**       | `/security`, `/security/service-accounts`                                   |
| **Operations**     | `/operations`, `/integration`                                               |
| **Personal**       | `/profile`, `/settings`, `/notifications`, `/links`, `/showcase`            |
| **Docs**           | `/documentation`                                                            |

### 4.3 Módulos y permisos

`ModuleSelector` (en el header) cambia entre módulos según permisos del usuario. Ver [frontend/docs/NAVIGATION_STRUCTURE.md](frontend/docs/NAVIGATION_STRUCTURE.md).

| Módulo   | Permiso requerido |
| -------- | ----------------- |
| General  | _público_         |
| Security | `view_security`   |
| Audit    | `view_audit`      |

---

## 5. Layout y Estructura de Pantalla

Composición canónica para páginas autenticadas:

```
┌──────────┬────────────────────────────────────────────────────────────────┐
│ IconBar  │ Header  ▸ SidebarTrigger │ ModuleSelector │ Navbar │ Avatar  │
│ (64px)   │────────────────────────────────────────────────────────────────│
│  ⌂ ★     │                                                                │
│  ◆ ◆     │                                                                │
│  ◆ ◆     │   AppSidebar (280/80px)  │  Main content                        │
│          │   ─ Architecture          │   PageHeader / Breadcrumbs           │
│  ⚙       │   ─ Catalog               │   Sección                            │
│  Avatar  │   ─ Infra · CI/CD …       │   …                                  │
│          │                           │   Footer (opcional)                  │
└──────────┴────────────────────────────────────────────────────────────────┘
```

### 5.1 Componentes de layout

Ubicados en [frontend/components/layout/](frontend/components/layout/):

| Componente                         | Responsabilidad                                                            |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `MainLayout`                       | Contenedor raíz; decide si renderizar con/sin sidebar y footer.            |
| `Navbar`                           | Header público (landing) y barra de marca/idiomas en zona protegida.       |
| `AppSidebar`                       | Navegación contextual del módulo activo (jerárquica con submenús).         |
| `IconBar`                          | Barra izquierda fija (64px) con favoritos del usuario y settings.          |
| `ModuleSelector` + `ModuleContext` | Switch entre módulos y propagación del módulo activo.                      |
| `PageHeader`                       | Título, breadcrumbs y acciones de página.                                  |
| `Footer`                           | Footer multi-columna (público); 4 grupos: Product/Company/Resources/Legal. |
| `CommandPalette`                   | Paleta global tipo `Cmd+K` (montada en MainLayout).                        |
| `RouteProgressBar`                 | Barra de progreso superior para transiciones de ruta.                      |

### 5.2 Reglas de uso

- **Páginas públicas / marketing** → `<MainLayout showSidebar={false} showFooter />`.
- **Páginas autenticadas** → `<MainLayout showSidebar showFooter={false} userPermissions={[…]} />`.
- El header sticky tiene `h-16` (64px), el navbar marketing `h-20` (80px). No mezclar.
- Cualquier nueva página dentro de `(protected)/` hereda automáticamente el layout protegido.

---

## 6. Catálogo de Componentes

> Detalle completo en [frontend/docs/DESIGN_SYSTEM.md](frontend/docs/DESIGN_SYSTEM.md).
> Importa siempre desde `@/components/ui/...` o desde el barrel `@/components/ui` cuando exista.

### 6.1 Primitivas (shadcn/ui + Radix)

`alert-dialog`, `breadcrumbs`, `card`, `collapsible-section`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `switch`, `textarea`, `tooltip`.

### 6.2 Componentes compuestos del producto

| Categoría   | Componente                                                                                        | Uso                                                  |
| ----------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Cards       | `EntityCard`, `EntityCardGrid`                                                                    | Tarjeta de entidad del catálogo (API, componente…)   |
|             | `StatCard`, `StatsGrid`, `QuickStat`                                                              | KPIs de dashboard                                    |
|             | `ScoreCard`, `MiniScoreCard`, `ScoreBadge`                                                        | Scorecards estilo Backstage (`defaultServiceRules`)  |
| Estado      | `StatusIndicator`, `HealthIndicator`, `UptimeIndicator`                                           | Estado de servicios                                  |
|             | `EmptyState` (+ `EmptyList`, `NoSearchResults`, `ErrorState`, `OfflineState`, `ServerErrorState`) | Vacíos / errores                                     |
|             | `LoadingSpinner`, `Skeleton`, `Loading`                                                           | Estados de carga                                     |
| Datos       | `DataTable`                                                                                       | Tabla con paginación/orden                           |
|             | `MetaBlock`                                                                                       | Bloque de metadatos clave/valor                      |
|             | `Highlight`, `code-block`, `markdown-renderer`                                                    | Render de contenido técnico (Prism + react-markdown) |
|             | `mermaid-diagram`, `flow-diagram`, `diagrams/*`                                                   | Diagramas (Mermaid + xyflow)                         |
|             | `swagger-ui`                                                                                      | Vista OpenAPI (swagger-ui-react)                     |
| Navegación  | `Breadcrumbs`, `AutoBreadcrumbs`                                                                  | Migas de pan                                         |
|             | `CommandPalette` + `useCommandPalette`                                                            | Paleta `Cmd+K`                                       |
|             | `slide-panel`, `SlideOver`, `Sheet`                                                               | Paneles laterales / drawers                          |
| Formularios | `Input`, `textarea`, `Select`, `switch`, `Label`, `IconPicker`                                    | Formularios y configuración                          |
| Misceláneos | `Toolbar`, `TypeIcons`, `permission-gate`, `UnderConstruction`                                    | Utilidades transversales                             |

Componentes de dominio (catálogo) en [frontend/components/catalog/](frontend/components/catalog/): `ComponentCard`, `ComponentList`, `ComponentsToolbar`, `ServiceModelList`, y `component-detail/*`.

### 6.3 Convenciones de API de componente

- Props tipadas con `interface` documentada con JSDoc; cada prop con descripción.
- Variantes a través de `class-variance-authority` (CVA).
- Composición preferida sobre props booleanas explosivas.
- Iconos: tipar como `ComponentType<{ className?: string }>`. Familias permitidas: `react-icons/hi2`, `react-icons/fa`, `lucide-react`.
- Internalización: nunca strings hardcodeados; usar `useTranslations(namespace)` de `next-intl`.

---

## 7. Patrones de Interacción

- **Hover**: cambio sutil de fondo (`hover:bg-accent`) y `transition-all`.
- **Focus**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
- **Active state nav**: fondo `bg-primary` + `text-primary-foreground` + `shadow-lg shadow-primary/50` (ver `IconBar`).
- **Disabled**: `opacity-50 pointer-events-none` y color `--text-disabled`.
- **Submenús**: `expandedItems: Set<string>` controlado en `AppSidebar`; chevron rota con `transition-transform`.
- **Notificaciones**: badge rojo absoluto sobre el icono de campana (top-right del header).
- **Loading**:
    - Tabular → `Skeleton`.
    - Operacional → `LoadingSpinner` o `animate-indeterminate` (definida en `globals.css`).
    - Infrastructure striped progress → utilidades `.bg-stripes` + `.animate-stripes`.

### Animación

- Librerías: `framer-motion` para entradas elaboradas, `tw-animate-css` para utilidades base, `mermaid` para diagramas.
- Mantener animaciones por debajo de `slow` (500 ms) salvo onboarding.

---

## 8. Internacionalización (i18n)

- Locales soportados: `en`, `es` (defaultLocale `en`). Definidos en [frontend/i18n/config.ts](frontend/i18n/config.ts).
- `localePrefix: "always"` → todas las rutas viven bajo `/[locale]/...`.
- Traducciones por namespace en [frontend/messages/en.json](frontend/messages/en.json) y [frontend/messages/es.json](frontend/messages/es.json).
- Dentro de componentes cliente: `const t = useTranslations("namespace")`.
- Server components: `getTranslations({ locale, namespace })`.
- Componente `LocaleSwitcher` en el navbar para cambio en caliente.

---

## 9. Accesibilidad (A11y)

- WCAG 2.1 AA como objetivo.
- Todas las primitivas heredan accesibilidad de Radix (focus trap en dialogs, aria roles correctos).
- Iconos decorativos → `aria-hidden`. Iconos significativos → `aria-label` o texto `sr-only`.
- Contraste verificado para los 6 temas; los temas con tinte (`orange`, `green`, `blue`, `purple`) usan tokens propios para mantener AA.
- Soporte completo de teclado: `Tab`, `Shift+Tab`, `Esc` para cerrar dialogs/sheets, `Cmd/Ctrl+K` para Command Palette.
- Reduced motion: respetar `prefers-reduced-motion` cuando se añadan animaciones complejas.

---

## 10. Performance

- React 19 + Next 16 con **App Router** y Server Components por defecto.
- `"use client"` sólo donde haya estado/efectos/interacción.
- Fuentes con `next/font` (`display: "swap"`).
- Imágenes: `next/image` siempre que sea posible.
- Code-splitting natural por ruta; los componentes pesados (Mermaid, Swagger UI, xyflow, recharts) se aíslan en componentes cliente y, cuando aplica, se cargan dinámicamente con `next/dynamic`.
- `disableTransitionOnChange` en ThemeProvider evita repintados en cambio de tema.

---

## 11. Estructura de Carpetas (frontend)

```
frontend/
├── app/
│   ├── layout.tsx                # Fonts + ThemeProvider raíz
│   ├── globals.css               # Tokens CSS + utilidades
│   ├── apis/                     # (legacy / pública si aplica)
│   └── [locale]/
│       ├── layout.tsx            # next-intl + AppProviders
│       ├── page.tsx              # Landing
│       ├── login/
│       └── (protected)/
│           ├── layout.tsx        # MainLayout(showSidebar)
│           ├── dashboard/
│           ├── apis/  components/  architecture/
│           ├── business/  catalog/  ci-cd/
│           ├── infrastructure/  operations/  integration/
│           ├── teams/  users/  security/
│           ├── notifications/  profile/  settings/
│           ├── documentation/  showcase/  links/
│           └── taxonomy/  types/  resources/  lifecycles/  admin/
├── components/
│   ├── ui/                       # Primitivas shadcn/ui + compuestas
│   ├── layout/                   # Navbar, AppSidebar, IconBar, MainLayout, …
│   ├── providers/                # AppProviders, ThemeProvider
│   ├── theme/                    # ThemeToggle y selectores
│   ├── catalog/                  # Dominio: catálogo de componentes/APIs
│   ├── apis/  architecture/  business/  charts/
│   ├── ci-cd/  compliance/  components/  dashboard/
│   ├── home/  infrastructure/  integration/  lifecycles/
│   ├── operations/  organization/  platform/  profile/
│   ├── resources/  security/  teams/  technology/
│   ├── auth/  admin/  users/  api-types/
│   └── LocaleSwitcher.tsx
├── lib/
│   ├── design-system.ts          # Tokens TS
│   ├── theme-config.ts           # Color modes + color themes
│   ├── api-client.ts  api/       # Cliente HTTP versionado
│   ├── auth-context.tsx          # Auth en cliente
│   ├── formatters.ts  validators.ts  utils.ts  utils/  icons/
├── hooks/                        # use-mobile, use-resource, use-theme-settings, useAuth, useGlobalSearch
├── i18n/                         # config, routing, request
├── messages/                     # en.json, es.json
├── types/                        # api.ts, xyflow.d.ts
├── docs/                         # Documentación viva del frontend
├── public/                       # Assets estáticos
└── __tests__/  e2e/              # Jest + Playwright
```

---

## 12. Convenciones de Código

Resumen alineado con [.github/copilot-instructions.md](.github/copilot-instructions.md).

- **TDD obligatorio**: test en Jest + Testing Library antes de la implementación.
- Estructura `describe → Rendering / Behavior / Edge Cases`.
- `pnpm test`, `pnpm test:watch`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test:e2e` (Playwright).
- TypeScript estricto: nada de `any` salvo justificación explícita.
- Sin `console.log` en producción.
- Mensajes de commit Conventional: `feat(frontend): …`, `fix(ui): …`, `test(components): …`.
- Estilo: Tailwind v4 con tokens. Evitar valores arbitrarios `[15px]`.
- Iconos: una sola familia por componente (preferir `react-icons/hi2` para UI, `lucide-react` para layout).

---

## 13. Validaciones y API

- Cliente API en [frontend/lib/api-client.ts](frontend/lib/api-client.ts) (versionado `v1`).
- Validación de payloads con `zod` (campo a campo, tipado inferido).
- Hooks de datos en [frontend/hooks/](frontend/hooks/) (p. ej. `use-resource`, `useGlobalSearch`).
- Respuestas estandarizadas:

```jsonc
// Éxito
{ "data": { … }, "meta": { "page": 1, "total": 100 } }
// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "…" } }
```

---

## 14. Documentación complementaria

| Documento                                                                                   | Contenido                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [frontend/docs/DESIGN_SYSTEM.md](frontend/docs/DESIGN_SYSTEM.md)                            | Tokens y guidelines del DS                  |
| [frontend/docs/THEMES.md](frontend/docs/THEMES.md)                                          | Sistema de temas, cómo añadir uno           |
| [frontend/docs/NAVIGATION_STRUCTURE.md](frontend/docs/NAVIGATION_STRUCTURE.md)              | IconBar, ModuleSelector, AppSidebar         |
| [frontend/docs/AUTH_DASHBOARD.md](frontend/docs/AUTH_DASHBOARD.md)                          | Login + dashboard                           |
| [frontend/docs/SAFARI_COMPATIBILITY.md](frontend/docs/SAFARI_COMPATIBILITY.md)              | Compatibilidad Safari (gradientes, bg-clip) |
| [frontend/docs/TYPE_USAGE_GUIDE.md](frontend/docs/TYPE_USAGE_GUIDE.md)                      | Tipado y uso de `types/api.ts`              |
| [frontend/docs/API_DEPENDENCIES.md](frontend/docs/API_DEPENDENCIES.md)                      | Dependencias entre vistas y endpoints       |
| [frontend/docs/SCHEMA_COMPARISON.md](frontend/docs/SCHEMA_COMPARISON.md)                    | Diffs de schema entre versiones             |
| [AGENTS.md](AGENTS.md) · [.github/copilot-instructions.md](.github/copilot-instructions.md) | Reglas de trabajo para agentes / copilots   |

---

## 15. Checklist para nuevas pantallas

1. ¿Tengo el test (Jest) escrito antes del componente?
2. ¿Uso primitivas de [components/ui/](frontend/components/ui/) y tokens en lugar de clases hardcoded?
3. ¿La pantalla está bajo `app/[locale]/(protected)/` si requiere sesión?
4. ¿Strings traducidos en `messages/en.json` y `messages/es.json`?
5. ¿Estados manejados: loading (`Skeleton`), vacío (`EmptyState`), error (`ErrorState`)?
6. ¿Funciona en `light`, `dark` y al menos un tema cromático (p. ej. `blue`)?
7. ¿Navegación accesible por teclado y `aria-*` correctos?
8. ¿Probada en mobile (≤ `sm`) y desktop (`lg`+)?
9. `pnpm test`, `pnpm exec tsc --noEmit` y `pnpm lint` en verde.
10. Commit con prefijo Conventional y referencia al issue de `bd`.

---

_Última actualización: 21 de abril de 2026 · `frontend@0.1.78`._
