# Estructura de Navegación - Atlas Catalog

## 📐 Arquitectura de la UI

### 1. **Barra Lateral Izquierda (IconBar)** - Favoritos del Usuario

La barra lateral izquierda muestra los **favoritos personalizados del usuario** y se mantiene **siempre visible**.

#### Características:
- ✅ **Ancho fijo**: 64px (w-16)
- ✅ **Solo iconos**: Vista compacta
- ✅ **Siempre visible**: No se oculta nunca
- ✅ **Contenido**:
  - Logo de la aplicación (parte superior)
  - Botón para expandir/contraer sidebar derecho
  - Indicador de favoritos (★)
  - Lista de páginas favoritas del usuario
  - Separador
  - Enlace a Configuración
  - Avatar del usuario (parte inferior)

#### Props:
```typescript
interface IconBarProps {
    locale: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    userFavorites?: FavoriteItem[];
}

interface FavoriteItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
    category?: string; // Categoría que se muestra en el tooltip
}
```

#### Favoritos por Defecto:
```typescript
const defaultFavorites = [
    { id: "home", icon: HiHome, href: "/dashboard", label: "Inicio" },
    { id: "apis", icon: HiSquares2X2, href: "/apis", label: "APIs" },
    { id: "infrastructure", icon: HiServer, href: "/infrastructure", label: "Infraestructura" },
    { id: "analytics", icon: HiChartBar, href: "/analytics", label: "Analítica" },
];
```

#### Personalización:
Los favoritos se pueden cargar desde:
- Base de datos del usuario
- LocalStorage/Cookies
- API de preferencias del usuario

---

### 2. **Selector de Módulos (ModuleSelector)** - Parte Superior

Componente ubicado en la **parte superior** que permite cambiar entre diferentes módulos según los permisos del usuario.

#### Características:
- ✅ **Ubicación**: Header principal, junto al SidebarTrigger
- ✅ **Control de acceso**: Muestra solo módulos permitidos por permisos
- ✅ **Módulos disponibles**:
  - **General**: Vista principal del catálogo (sin restricciones)
  - **Seguridad**: Gestión de seguridad y accesos (requiere `view_security`)
  - **Auditoría**: Registro y seguimiento de eventos (requiere `view_audit`)

#### Props:
```typescript
interface ModuleSelectorProps {
    userPermissions?: string[];
}

interface Module {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    requiredPermission?: string;
}
```

#### Ejemplo de Uso:
```tsx
<ModuleSelector 
    userPermissions={["view_security", "view_audit"]} 
/>
```

#### Lógica de Filtrado:
```typescript
const availableModules = allModules.filter((module) => {
    if (!module.requiredPermission) return true; // Módulo público
    return userPermissions.includes(module.requiredPermission);
});
```

---

### 3. **Sidebar Derecho (AppSidebar)** - Navegación Contextual

Barra lateral derecha que muestra la **navegación del módulo activo**.

#### Características:
- ✅ **Colapsable**: Se puede expandir/contraer con el botón en IconBar
- ✅ **Contenido dinámico**: Cambia según el módulo activo
- ✅ **Navegación jerárquica**: Menús y submenús organizados

---

## 🔧 Integración en MainLayout

```tsx
<MainLayout
    locale={locale}
    showSidebar={true}
    userPermissions={["view_security", "view_audit"]}
>
    {/* Contenido de la página */}
</MainLayout>
```

### Estructura Visual:

```
┌─────────────────────────────────────────────────────────────────┐
│ [IconBar]  [Header: ModuleSelector | Navbar]                    │
├──────┬────────────────────────────────────────────────────────┬─┤
│      │                                                        │ │
│  ★   │                                                        │S│
│ [H]  │                                                        │i│
│ [A]  │           CONTENIDO PRINCIPAL                          │d│
│ [I]  │                                                        │e│
│ [C]  │                                                        │b│
│      │                                                        │a│
│ ───  │                                                        │r│
│ [⚙]  │                                                        │ │
│ [U]  │                                                        │ │
│      │                                                        │ │
└──────┴────────────────────────────────────────────────────────┴─┘
     64px                                                    var
```

**Leyenda:**
- `[IconBar]`: Barra izquierda con favoritos (64px fijo)
- `[Header]`: Barra superior con ModuleSelector y Navbar
- `★`: Indicador de favoritos
- `[H], [A], [I], [C]`: Iconos de favoritos del usuario
- `───`: Separador
- `[⚙]`: Configuración
- `[U]`: Avatar del usuario
- `[Sidebar]`: Navegación contextual (colapsable)

---

## 🎯 Flujo de Usuario

### Cambio de Módulo:
1. Usuario hace clic en el **ModuleSelector** (parte superior)
2. Se muestran solo los módulos para los que tiene permisos
3. Al seleccionar un módulo:
   - Se actualiza el estado global del módulo activo
   - El **Sidebar** derecho carga la navegación del módulo
   - Se puede redirigir a la página principal del módulo

### Navegación por Favoritos:
1. Usuario hace clic en un icono de la **IconBar** izquierda
2. Navegación inmediata a la página favorita
3. No requiere abrir menús ni sidebars

### Personalización de Favoritos:
1. Usuario entra a **Configuración** (icono ⚙ en IconBar)
2. Sección "Favoritos" permite:
   - Agregar/quitar páginas de favoritos
   - Reordenar favoritos (drag & drop)
   - Resetear a favoritos por defecto

---

## 🔐 Sistema de Permisos

### Permisos de Módulos:
```typescript
const modulePermissions = {
    general: null,           // Sin restricción
    security: "view_security",
    audit: "view_audit",
};
```

### Verificación de Acceso:
```typescript
function canAccessModule(module: Module, userPermissions: string[]): boolean {
    if (!module.requiredPermission) return true;
    return userPermissions.includes(module.requiredPermission);
}
```

---

## 📝 TODO: Futuras Mejoras

- [ ] **Gestión de Favoritos**: API para guardar/cargar favoritos del usuario
- [ ] **Drag & Drop**: Reordenar favoritos en la IconBar
- [ ] **Módulos Dinámicos**: Cargar módulos desde configuración backend
- [ ] **Badges**: Mostrar notificaciones en iconos de favoritos
- [ ] **Búsqueda Rápida**: Comando rápido (Cmd+K) para buscar páginas
- [ ] **Temas por Módulo**: Colores personalizados por módulo
- [ ] **Historial de Navegación**: Acceso rápido a páginas recientes

---

## 🧩 Componentes Relacionados

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| `IconBar` | `components/layout/IconBar.tsx` | Barra izquierda con favoritos |
| `ModuleSelector` | `components/layout/ModuleSelector.tsx` | Selector de módulos (header) |
| `AppSidebar` | `components/layout/AppSidebar.tsx` | Navegación contextual derecha |
| `MainLayout` | `components/layout/MainLayout.tsx` | Layout principal con integración |

---

## 📚 Referencias

- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Next.js App Router](https://nextjs.org/docs/app)
