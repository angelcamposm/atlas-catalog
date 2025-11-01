# Atlas Catalog - Design System

## Overview

Atlas Catalog's design system is built on **shadcn/ui** components and follows the **Golden Ratio (φ = 1.618)** principle for harmonious spacing, typography, and layout proportions.

## Core Principles

### 1. Golden Ratio (φ = 1.618)

The golden ratio creates visually pleasing proportions and is used throughout:

-   **Spacing scale**: Based on Fibonacci sequence (8, 13, 21, 34, 55, 89px)
-   **Typography scale**: Follows golden ratio progression
-   **Layout proportions**: Container widths and aspect ratios

### 2. Component-First Architecture

-   All UI components from **shadcn/ui**
-   Customizable through CSS variables
-   Consistent behavior across the application

### 3. Accessibility & UX

-   WCAG 2.1 Level AA compliance
-   Keyboard navigation support
-   Screen reader friendly
-   Responsive design (mobile-first)

## Color System

### Primary - Blue

Professional, trustworthy color for primary actions and branding

```css
--primary: #3b82f6 (blue-500)
--primary-foreground: #ffffff
```

### Secondary - Indigo

Innovation and technology accent

```css
--secondary: #6366f1 (indigo-500)
--secondary-foreground: #ffffff
```

### Accent - Emerald

Success states and positive actions

```css
--accent: #10b981 (emerald-500)
--accent-foreground: #ffffff
```

### Neutral - Gray

Content, borders, and backgrounds

```css
--background: #ffffff (light) / #030712 (dark)
--foreground: #111827 (light) / #f9fafb (dark)
```

## Typography

### Font Sizes (Golden Ratio Scale)

```typescript
xs: 12px (0.75rem)
sm: 14px (0.875rem)
base: 16px (1rem)
lg: 18px (1.125rem)
xl: 21px (1.313rem) // φ ratio from base
2xl: 24px (1.5rem)
3xl: 34px (2.125rem) // Fibonacci
4xl: 55px (3.438rem) // Fibonacci
5xl: 89px (5.563rem) // Fibonacci
```

### Line Heights

```typescript
tight: 1.2;
normal: 1.5;
relaxed: 1.618; // Golden ratio
```

## Spacing System (Fibonacci Sequence)

```typescript
xs: 8px
sm: 13px
md: 21px
lg: 34px
xl: 55px
2xl: 89px
3xl: 144px
```

Use these values for:

-   Padding and margins
-   Gap between elements
-   Section spacing
-   Component internal spacing

## Layout Components

### 1. Navbar (Top Navigation)

**File**: `components/layout/Navbar.tsx`

Features:

-   Fixed position at top
-   Height: 64px (4rem)
-   Glassmorphism effect with `backdrop-blur-xl`
-   Gradient background
-   Responsive mobile menu

Usage:

```tsx
import { Navbar } from "@/components/layout/Navbar";

<Navbar locale="en" />;
```

### 2. Sidebar (App Navigation)

**File**: `components/layout/AppSidebar.tsx`

Features:

-   Based on shadcn/ui Sidebar component
-   Collapsible (icon-only mode)
-   Grouped navigation items
-   Active state indicators
-   Badges for notifications
-   User profile footer

Usage:

```tsx
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

<SidebarProvider>
    <AppSidebar locale="en" />
</SidebarProvider>;
```

### 3. Footer

**File**: `components/layout/Footer.tsx`

Features:

-   Multi-column layout (responsive)
-   Social media links
-   Four link groups (Product, Company, Resources, Legal)
-   Copyright and version info

Usage:

```tsx
import { Footer } from "@/components/layout/Footer";

<Footer locale="en" />;
```

### 4. MainLayout (Complete Layout)

**File**: `components/layout/MainLayout.tsx`

Combines all layout components with proper spacing.

Usage:

```tsx
import { MainLayout } from "@/components/layout/MainLayout";

// Without sidebar (landing pages)
<MainLayout locale="en" showSidebar={false}>
  {children}
</MainLayout>

// With sidebar (dashboard)
<MainLayout locale="en" showSidebar={true}>
  {children}
</MainLayout>
```

## shadcn/ui Components Available

### Installed Components

-   ✅ **Button** - Primary UI actions
-   ✅ **Card** - Content containers
-   ✅ **Badge** - Status indicators
-   ✅ **Sidebar** - Navigation sidebar
-   ✅ **Sheet** - Slide-out panels
-   ✅ **Tooltip** - Contextual help
-   ✅ **Separator** - Visual dividers
-   ✅ **Input** - Form inputs
-   ✅ **Skeleton** - Loading states

### Adding More Components

```bash
# Install specific component
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add form
```

## Dark Mode Support

All components support dark mode through CSS variables.

### Toggle Dark Mode

```tsx
// Add to your root layout or theme provider
<html className="dark">
```

### Dark Mode Colors

Variables automatically switch based on `.dark` class:

```css
.dark {
    --background: #030712;
    --foreground: #f9fafb;
    /* ... other dark variants */
}
```

## Responsive Breakpoints

```typescript
sm: 640px  // Mobile landscape
md: 768px  // Tablet
lg: 1024px // Desktop
xl: 1280px // Large desktop
2xl: 1536px // Extra large
```

### Usage

```tsx
// Tailwind responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Best Practices

### 1. Component Composition

Always use shadcn/ui components as building blocks:

```tsx
// ✅ Good
import { Button } from "@/components/ui/button";
<Button variant="default">Click me</Button>

// ❌ Avoid
<button className="bg-blue-500...">Click me</button>
```

### 2. Spacing Consistency

Use the Fibonacci spacing scale:

```tsx
// ✅ Good
<div className="space-y-8"> {/* 8px = xs */}
<div className="gap-13"> {/* 13px = sm */}
<div className="p-21"> {/* 21px = md */}

// ❌ Avoid arbitrary values
<div className="space-y-[15px]">
```

### 3. Color Usage

Use CSS variables for consistency:

```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">

// ❌ Avoid hard-coded colors
<div className="bg-blue-500 text-white">
```

### 4. Typography Hierarchy

Maintain visual hierarchy:

```tsx
// Headings
<h1 className="text-4xl font-bold"> {/* 55px */}
<h2 className="text-3xl font-semibold"> {/* 34px */}
<h3 className="text-2xl font-semibold"> {/* 24px */}

// Body text
<p className="text-base"> {/* 16px */}
```

## Design Tokens

All design tokens are centralized in:

-   **File**: `lib/design-system.ts`
-   **CSS Variables**: `app/globals.css`

### Accessing in TypeScript

```typescript
import { designSystem } from "@/lib/design-system";

// Use spacing
const padding = designSystem.spacing.md; // 21

// Use colors
const primaryColor = designSystem.colors.primary[500]; // #3b82f6
```

### Accessing in CSS/Tailwind

```css
/* Use CSS variables */
.my-component {
    background: var(--primary);
    padding: var(--spacing-md);
}
```

## File Structure

```
frontend/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   └── layout/          # Layout components
│       ├── Navbar.tsx
│       ├── AppSidebar.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
├── lib/
│   └── design-system.ts # Design tokens
└── app/
    └── globals.css      # CSS variables & theme
```

## Resources

-   [shadcn/ui Documentation](https://ui.shadcn.com)
-   [Tailwind CSS](https://tailwindcss.com)
-   [Radix UI](https://radix-ui.com) (shadcn/ui primitives)
-   [Lucide Icons](https://lucide.dev)

## Version

Design System v1.0.0 - November 2025
