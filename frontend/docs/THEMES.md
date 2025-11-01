# Sistema de Temas - Atlas Catalog Frontend

## Descripción General

El sistema de temas de Atlas Catalog está diseñado para ser **extensible y escalable**. Actualmente soporta temas claro y oscuro, pero está preparado para añadir temas personalizados fácilmente.

## Arquitectura

### Componentes Principales

1. **ThemeProvider** (`components/providers/ThemeProvider.tsx`)

    - Wrapper sobre `next-themes`
    - Proporciona contexto de tema a toda la aplicación
    - Configurado en el layout raíz

2. **Theme Configuration** (`lib/theme-config.ts`)

    - Define todos los temas disponibles
    - Configuración centralizada de colores
    - Control de temas activos

3. **ThemeToggle** (`components/theme/ThemeToggle.tsx`)

    - Botón rápido para cambiar entre temas
    - Cicla entre: Light → Dark → System
    - Visible en el Dashboard

4. **ProfileModal** (selector de temas completo)
    - Selector visual de temas
    - Muestra todos los temas activos
    - Integrado en el perfil de usuario

## Temas Actuales

### Activos (Disponibles en UI)

-   ✅ **Light** - Tema claro
-   ✅ **Dark** - Tema oscuro
-   ✅ **System** - Sigue la preferencia del sistema operativo

### Preparados (Listos para activar)

-   🔵 **Ocean Blue** - Tema azul océano
-   🟣 **Royal Purple** - Tema púrpura real

## Cómo Añadir un Nuevo Tema

### 1. Definir el Tema en `lib/theme-config.ts`

```typescript
export const themes: Record<ThemeName, ThemeConfig> = {
    // ... temas existentes

    green: {
        name: "green",
        label: "Forest Green",
        colors: {
            primary: "#10b981",
            secondary: "#059669",
            accent: "#34d399",
            background: "#f0fdf4",
            foreground: "#064e3b",
        },
    },
};
```

### 2. Actualizar el Tipo de Tema

```typescript
export type ThemeName =
    | "light"
    | "dark"
    | "blue"
    | "purple"
    | "green"
    | "system";
```

### 3. Activar el Tema

```typescript
export const activeThemes: ThemeName[] = ["light", "dark", "green", "system"];
```

### 4. Añadir Traducciones

**messages/en.json**:

```json
{
    "profile": {
        "green": "Forest Green"
    }
}
```

**messages/es.json**:

```json
{
    "profile": {
        "green": "Verde Bosque"
    }
}
```

### 5. Añadir Icono en ProfileModal (opcional)

En `components/profile/ProfileModal.tsx`, añade el caso visual:

```tsx
{
    themeName === "green" && (
        <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-green-500 shadow-md" />
    );
}
```

## Uso en Componentes

### Acceder al Tema Actual

```tsx
import { useTheme } from "next-themes";

export function MyComponent() {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            Current theme: {theme}
            <button onClick={() => setTheme("dark")}>Switch to Dark</button>
        </div>
    );
}
```

### Clases de Tailwind con Dark Mode

```tsx
<div className="bg-white dark:bg-gray-900">
    <h1 className="text-gray-900 dark:text-white">Title</h1>
    <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

## Persistencia

El tema seleccionado se guarda automáticamente en `localStorage` gracias a `next-themes`. No necesitas implementar lógica de persistencia adicional.

## Hidratación y SSR

El sistema está optimizado para evitar problemas de hidratación:

-   `suppressHydrationWarning` en el tag `<html>`
-   `ThemeProvider` con `disableTransitionOnChange`
-   `ThemeToggle` espera montaje antes de renderizar

## Variables CSS Personalizadas

Puedes extender el sistema con variables CSS para temas más complejos:

```css
/* globals.css */
:root {
    --color-primary: #3b82f6;
    --color-secondary: #6366f1;
}

.dark {
    --color-primary: #60a5fa;
    --color-secondary: #818cf8;
}

.blue {
    --color-primary: #0ea5e9;
    --color-secondary: #0284c7;
}
```

## Roadmap de Temas

### Próximos Pasos

1. ✅ Implementar temas Light y Dark
2. ⏳ Activar temas Blue y Purple
3. ⏳ Crear temas personalizados por usuario
4. ⏳ Permitir personalización de colores específicos
5. ⏳ Soporte para temas de alto contraste (accesibilidad)
6. ⏳ Temas por contexto (ej: modo presentación, modo lectura)

### Temas Futuros Planificados

-   🌊 Ocean (Azul claro inspirado en el océano)
-   🌲 Forest (Verde oscuro inspirado en bosque)
-   🌅 Sunset (Naranja/Rosa inspirado en atardecer)
-   🌙 Midnight (Azul oscuro/Negro para uso nocturno)
-   🎨 Custom (Permitir al usuario crear su propio tema)

## Mejores Prácticas

1. **Siempre usa clases dark:** en lugar de lógica condicional
2. **Centraliza los colores** en `theme-config.ts`
3. **Usa `activeThemes`** para controlar qué temas se muestran en UI
4. **Mantén las traducciones** sincronizadas al añadir temas
5. **Prueba en ambos modos** (claro y oscuro) al desarrollar componentes

## Troubleshooting

### El tema no cambia

-   Verifica que el componente use `"use client"`
-   Asegúrate de que está dentro del `ThemeProvider`
-   Comprueba que las clases `dark:` estén correctamente aplicadas

### Flash de tema incorrecto al cargar

-   Verifica que `suppressHydrationWarning` esté en `<html>`
-   Usa el patrón de montaje en `ThemeToggle`

### Tema no persiste entre recargas

-   `next-themes` usa `localStorage` automáticamente
-   Verifica que no haya errores en la consola del navegador

## Referencias

-   [next-themes Documentation](https://github.com/pacocoursey/next-themes)
-   [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
-   [Next.js Theming Best Practices](https://nextjs.org/docs/app/building-your-application/styling/css-modules#theming)
