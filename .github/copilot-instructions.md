# Copilot Instructions - Atlas Catalog

Este documento define las guías y buenas prácticas para el desarrollo del proyecto Atlas Catalog.
Es un proyecto **open source**, por lo que el código debe ser **simple, documentado y fácil de seguir**.

---

## 🎯 Principios Fundamentales

### 1. Test-Driven Development (TDD)

**SIEMPRE seguir el ciclo TDD:**

1. **Red** - Escribir el test primero (debe fallar)
2. **Green** - Escribir el código mínimo para que pase
3. **Refactor** - Mejorar el código manteniendo los tests verdes

```bash
# Frontend (Jest)
cd frontend && pnpm test -- --watch

# Backend (PHPUnit)
cd src && ./vendor/bin/phpunit
```

### 2. Simplicidad sobre Complejidad

- Código legible > código clever
- Funciones pequeñas con un solo propósito
- Nombres descriptivos (sin abreviaturas crípticas)
- Si necesitas comentar qué hace el código, refactoriza

### 3. Documentación como Ciudadano de Primera Clase

- Docstrings/JSDoc en funciones públicas
- README en cada módulo nuevo
- ADRs para decisiones arquitectónicas (`docs/adr/`)

---

## 🏗️ Arquitectura del Proyecto

```
atlas-catalog/
├── src/                    # Backend Laravel (PHP 8.2+)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── routes/v1/         # API routes versionadas
│   └── tests/
├── frontend/              # Frontend Next.js (TypeScript)
│   ├── app/               # App Router pages
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base reutilizables
│   │   └── catalog/      # Componentes de dominio
│   ├── lib/api/          # Clientes API
│   ├── types/            # TypeScript types
│   └── __tests__/        # Tests Jest
└── docs/                  # Documentación
```

---

## 📝 Estándares de Código

### Frontend (TypeScript/React)

```typescript
// ✅ BIEN: Componente documentado, tipado, simple
/**
 * Sección colapsable reutilizable
 * 
 * @example
 * <CollapsibleSection title="Info" icon={HiInfo}>
 *   <p>Contenido</p>
 * </CollapsibleSection>
 */
interface CollapsibleSectionProps {
    /** Título mostrado en el header */
    title: string;
    /** Icono opcional */
    icon?: ComponentType<{ className?: string }>;
    /** Contenido colapsable */
    children: ReactNode;
}

export function CollapsibleSection({ title, icon: Icon, children }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="border rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)}>
                {Icon && <Icon className="w-5 h-5" />}
                {title}
            </button>
            {isOpen && <div>{children}</div>}
        </div>
    );
}
```

```typescript
// ❌ MAL: Sin tipos, sin documentación, nombres crípticos
export function CS({ t, i, c }) {
    const [o, sO] = useState(false);
    return <div onClick={() => sO(!o)}>{o && c}</div>;
}
```

### Backend (PHP/Laravel)

```php
// ✅ BIEN: Controller limpio, validación, respuestas consistentes
/**
 * Get a specific component by ID or slug.
 *
 * @param Component $component Route model binding
 * @return JsonResponse
 */
public function show(Component $component): JsonResponse
{
    return response()->json([
        'data' => new ComponentResource($component->load(['type', 'lifecycle', 'platform']))
    ]);
}
```

---

## 🧪 Guía de Testing

### Estructura de Tests

```
__tests__/
├── components/           # Tests de componentes React
│   ├── CollapsibleSection.test.tsx
│   └── ComponentDetail.test.tsx
├── api-client.test.ts   # Tests de API client
└── hooks/               # Tests de hooks
```

### Patrón de Test

```typescript
describe("ComponentName", () => {
    describe("Rendering", () => {
        it("should render with required props", () => {});
        it("should render optional elements when provided", () => {});
    });

    describe("Behavior", () => {
        it("should handle user interaction", () => {});
        it("should call callback on event", () => {});
    });

    describe("Edge Cases", () => {
        it("should handle empty data", () => {});
        it("should handle error state", () => {});
    });
});
```

### Mocks

```typescript
// Mocks van al inicio del archivo de test
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-icons/hi2", () => ({
    HiChevronDown: () => <span data-testid="chevron">▼</span>,
}));
```

---

## 🔄 Workflow de Desarrollo

### 1. Antes de empezar

```bash
# Verificar que todo funciona
cd frontend && pnpm test
cd ../src && ./vendor/bin/phpunit

# Crear rama desde frontend (o master si es backend)
git checkout frontend
git pull
git checkout -b feature/nombre-descriptivo
```

### 2. Durante el desarrollo

```bash
# TDD: Tests primero
pnpm test -- --watch __tests__/components/MiComponente.test.tsx

# Verificar tipos
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

### 3. Antes de commit

```bash
# Ejecutar todos los tests
pnpm test

# Verificar TypeScript
pnpm exec tsc --noEmit

# Commit con mensaje descriptivo
git add .
git commit -m "feat(module): descripción clara del cambio"
```

### 4. Convención de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(frontend): add collapsible section component
fix(api): resolve route conflict in components endpoint
docs(readme): update installation instructions
test(components): add tests for ComponentHeader
refactor(models): extract validation to service
```

---

## 🎨 Componentes UI

### Componentes Reutilizables (`components/ui/`)

Crear componentes base que se puedan usar en todo el proyecto:

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `CollapsibleSection` | `ui/collapsible-section.tsx` | Secciones expandibles |
| `Badge` | `ui/Badge.tsx` | Etiquetas de estado |
| `Card` | `ui/Card.tsx` | Contenedores con borde |
| `Button` | `ui/Button.tsx` | Botones estilizados |

### Componentes de Dominio (`components/catalog/`)

Componentes específicos del negocio:

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `ComponentDetailHeader` | `catalog/component-detail/` | Cabecera de detalle |
| `InformationSection` | `catalog/component-detail/` | Info del componente |
| `DependenciesSection` | `catalog/component-detail/` | Dependencias |

---

## 📚 API Guidelines

### Endpoints REST

```
GET    /api/v1/catalog/components          # Listar
GET    /api/v1/catalog/components/{slug}   # Detalle (por slug o ID)
POST   /api/v1/catalog/components          # Crear
PUT    /api/v1/catalog/components/{id}     # Actualizar
DELETE /api/v1/catalog/components/{id}     # Eliminar
```

### Respuestas JSON

```json
// Éxito con datos
{
    "data": { ... },
    "meta": { "page": 1, "total": 100 }
}

// Error
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "El campo name es requerido"
    }
}
```

---

## 🚀 Checklist de PR

Antes de crear un Pull Request, verificar:

- [ ] Tests escritos y pasando (`pnpm test`)
- [ ] TypeScript sin errores (`pnpm exec tsc --noEmit`)
- [ ] Lint sin warnings (`pnpm lint`)
- [ ] Documentación actualizada si es necesario
- [ ] Commit messages siguen convención
- [ ] No hay `console.log` en código de producción
- [ ] Componentes tienen tipos TypeScript completos

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Sigue TDD: tests primero, luego implementación
4. Commit con mensajes descriptivos
5. Push a tu fork
6. Abre un Pull Request

### Primera vez contribuyendo?

Lee el [CONTRIBUTING.md](../CONTRIBUTING.md) y [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md).

---

## 📖 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ADR Template](../docs/adr/)
