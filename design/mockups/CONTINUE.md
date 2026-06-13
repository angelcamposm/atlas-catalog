# Atlas Catalog — Mockups · Guía de continuación

Esta carpeta contiene los **mockups HTML estáticos** del frontend de Atlas Catalog.
Objetivo: un mockup navegable de **toda** la app, todas las pantallas con el **mismo
design system** (tipografía, espaciado, jerarquía, consistencia).

> Si eres un modelo continuando este trabajo: **NO inventes estilos nuevos**. Reutiliza
> SIEMPRE las clases de `assets/atlas.css` y el shell de `assets/app.js`. Copia una
> pantalla existente del mismo patrón y cámbiale el contenido. Eso es todo.

---

## 1. Reglas de oro (no negociables)

1. **Una sola hoja de estilos**: `assets/atlas.css`. Nunca añadas CSS nuevo en una
   página salvo micro-ajustes de layout con `style="..."` usando variables (`var(--sp-md)`).
   Si necesitas un componente nuevo y reutilizable, añádelo a `atlas.css`, no inline.
2. **Shell compartido**: cada página termina con `<script src="assets/app.js"></script>`
   y usa `<body data-active="ID">`. El sidebar + topbar se inyectan solos. El `ID` debe
   coincidir con el `id` del item en `NAV` (en `app.js`) para que se marque como activo.
3. **Tokens, nunca valores crudos**. Colores, espacios, radios y tipos salen de variables:
   - Espaciado (Fibonacci): `--sp-xs 8` · `--sp-sm 13` · `--sp-md 21` · `--sp-lg 34` · `--sp-xl 55`
   - Radios: `--r-sm 6` · `--r-md 12` · `--r-lg 16` · `--r-xl 24`
   - Texto: `--text-primary` (títulos) · `--text-body` · `--text-muted` · `--text-subtle`
   - Marca: `--color-primary #1b84ff` · `--color-accent #17c653` (éxito) ·
     `--color-warning #f6b100` · `--color-destructive #f8285a`
   - Fuentes: `Inter` (UI) y `JetBrains Mono` (usar clase `.mono` para versiones, IDs, rutas).
4. **Jerarquía tipográfica fija** (ya en CSS): `h1` 24/700 · `h2` 18/600 · `h3` 15/600 ·
   body 16. No cambies tamaños a mano.
5. **Toda pantalla empieza con `.page-head`** (breadcrumbs + h1 + `.sub` + `.actions`).
6. **Navegación real**: cada enlace a una pantalla existente debe apuntar a su `.html`.
   Al crear una pantalla, **actualiza su `href` en `app.js`** (cambia `'#'` por el archivo).
7. **Datos verosímiles y coherentes** entre pantallas (mismos equipos, componentes,
   versiones, clústeres que ya aparecen en otras páginas).
8. **Iconos: SOLO Google Material Symbols. PROHIBIDOS los emojis y los glyphs unicode**
   (✓, ⚙, →, etc.). Ver sección "Iconos".
9. **Theming: nunca pongas un color crudo (`#hex`) para superficies/texto/bordes.**
   Usa variables (`var(--card)`, `var(--text-muted)`…) para que el modo oscuro funcione.
   Ver sección "Theming".

---

## 1b. Iconos (Material Symbols)

Todos los iconos son **Google Material Symbols (Rounded)**, cargados en `atlas.css`.
Se escriben con la clase helper `.mi` y el **nombre (ligature)** del icono como texto:

```html
<span class="mi">search</span>          <!-- tamaño normal (20px) -->
<span class="mi sm">edit</span>          <!-- 16px, para celdas/inline -->
<span class="mi lg">rocket_launch</span>  <!-- 24px -->
```

- Catálogo de nombres: https://fonts.google.com/icons (estilo **Rounded**).
- **Nunca** uses un emoji ni un símbolo unicode como icono. Si necesitas uno, busca su
  nombre Material y usa `<span class="mi">nombre</span>`.
- Los iconos del sidebar/topbar salen del campo `ico` en `NAV` (en `app.js`): ahí el valor
  es directamente el nombre Material.
- En `placeholder=""` de inputs **no** se pueden meter iconos (es texto plano): déjalos sin icono.
- Equivalencias ya usadas: buscar→`search`, menú fila→`more_horiz`, paginación→`chevron_left`/
  `chevron_right`, editar→`edit`, borrar→`delete`, copiar→`content_copy`, ver más→`arrow_forward`,
  orden→`arrow_drop_up`/`arrow_drop_down`, ok→`check`, branch→`account_tree`.

---

## 1c. Theming (claro / oscuro / multi-tema)

- El tema activo vive en `<html data-theme="light|dark">`, lo gestiona `app.js`
  (botón en el topbar) y se **persiste en `localStorage`** (`atlas-theme`).
- **Light** es el tema por defecto en `:root`. **Dark** está en `[data-theme="dark"]` (atlas.css).
- Para **añadir un tema nuevo** (feature futura): copia el bloque `[data-theme="dark"]` en
  `atlas.css`, renómbralo (p.ej. `[data-theme="ocean"]`), ajusta los valores, y añade el id
  al array `THEMES` en `app.js`. No hace falta tocar las pantallas.
- Por eso la regla #9: cualquier color de superficie/texto/borde DEBE venir de una variable.
  Los colores de marca/estado (primary, accent, warning, destructive) sí son fijos y válidos.

---

## 2. Anatomía de una página (plantilla base)

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>TÍTULO · Atlas Catalog</title>
<link rel="stylesheet" href="assets/atlas.css">
</head>
<body data-active="NAV_ID">

<div class="page-head">
  <div>
    <div class="breadcrumbs">Grupo / <b>Pantalla</b></div>
    <h1>Pantalla</h1>
    <div class="sub">Frase corta que explica la pantalla.</div>
  </div>
  <div class="actions"><button class="btn btn-primary">+ Nuevo …</button></div>
</div>

<!-- contenido: elige un patrón de la sección 3 -->

<script src="assets/app.js"></script>
</body>
</html>
```

---

## 3. Patrones reutilizables (copia de estos archivos)

| Patrón | Cuándo usarlo | Copiar de |
|---|---|---|
| **Tabla + toolbar + paginación** | listas tabulares (la mayoría) | `deployments-list.html`, `releases-list.html`, `apis-list.html` |
| **Tabla con health-bar** | listas con estado de salud por fila | `systems-list.html`, `domains-list.html` |
| **Grid de tarjetas** | inventario visual (infra) | `clusters-list.html`, `environments-list.html` |
| **Stats + tabs + tabla** | gobernanza / resúmenes | `compliance.html`, `security.html`, `workflows-list.html` |
| **Detalle (tabs + stats + kv sidebar)** | páginas de detalle | `api-detail.html`, `component-detail.html` |
| **Stat cards (KPIs)** | fila de métricas arriba | `dashboard.html` |

### Snippets clave

- **Fila de KPIs**: `<div class="grid cols-4"> … <div class="card stat"><span class="label">…</span><span class="value" style="font-size:24px">…</span></div> … </div>`
- **Toolbar**: `<div class="toolbar"><input class="input" placeholder="⌕ …"><select class="select">…</select><button class="btn btn-ghost" style="margin-left:auto">Clear filters</button></div>`
- **Badges de estado** (siempre con `<span class="dot"></span>`):
  `badge-green` activo/ok · `badge-amber` warning · `badge-red` error/deprecated ·
  `badge-blue` info/staging · `badge-indigo` production/internal · `badge-gray` neutro.
- **Health bar**: `<div class="health-bar"><i></i><i></i><i class="warn"></i><i class="err"></i><i class="off"></i></div>` (5 segmentos; clases `warn`/`err`/`off`).
- **Tabs**: `<div class="tabs"><a class="tab active">…</a><a class="tab">…</a></div>`
- **Celda principal de tabla**: `<td><div class="cell-main"><a href="…">nombre</a></div><div class="cell-sub">descripción</div></td>`
- **Avatar en celda**: `<div style="display:flex;align-items:center;gap:8px"><div class="avatar sm">XX</div>Nombre</div>`
- **Paginación**: copia el bloque `.pagination` de `deployments-list.html`.

---

## 4. Estado actual

### ✅ Hechas
dashboard · login · design-system · apis-list · api-detail · components-list ·
component-detail · systems-list · domains-list · clusters-list · environments-list ·
deployments-list · releases-list · workflows-list · compliance · security · users-list · settings

### ⬜ Pendientes (con patrón a usar)

| Pantalla | `data-active` / NAV id | Patrón | Notas de contenido |
|---|---|---|---|
| Resources | `resources` | Tabla + toolbar | Tipo (DB, bucket, queue, cache…), proveedor, sistema, entorno, estado. |
| Links | `links` | Tabla + toolbar | Título, URL, tipo (docs, dashboard, runbook), entidad asociada, owner. |
| Capabilities | `capabilities` | Tabla health-bar (como systems) | Capacidad, dominio, sistemas, madurez, owner, health. |
| Entities | `entities` | Tabla health-bar | Entidad de negocio, dominio, sistema dueño, nº atributos, estado. |
| Nodes | `nodes` | Tarjetas (como clusters) o tabla | Nodo, clúster, rol, CPU/mem, pods, estado. |
| CI Servers | `ci-servers` | Tabla + toolbar | Servidor, tipo (GH Actions, GitLab, Jenkins), URL, workflows, estado. |
| Metrics | `metrics` | Dashboard (KPIs + tarjetas) | KPIs de plataforma + secciones tipo dashboard. Sin librerías de chart: usa barras/sparklines simples con divs. |
| Groups | `groups` | Tabla (como users) | Grupo, descripción, nº miembros, rol por defecto, owner. |
| Resource detail / Cluster detail | — | Detalle (como component-detail) | Solo si sobra tiempo. |
| Create/Edit form | — | `.card` + `.field` (ver `settings.html`) | Modal o página completa con campos `.field`. |

> Al terminar cada pantalla: (1) cambia su `href` en `app.js` de `'#'` al archivo,
> (2) muévela de "Pending" a "App screens" en `index.html`.

---

## 5. Checklist de QA por pantalla (antes de darla por hecha)

- [ ] `<body data-active="…">` correcto y resaltado en el sidebar.
- [ ] Empieza con `.page-head` (breadcrumbs + h1 + sub + actions).
- [ ] Cero CSS nuevo inline salvo layout con `var(--…)`.
- [ ] Enlaces de la tabla apuntan a su detalle (o `#` si aún no existe).
- [ ] Badges de estado usan `<span class="dot"></span>` y el color semántico correcto.
- [ ] **Cero emojis / glyphs unicode**: todos los iconos son `<span class="mi">nombre</span>`.
- [ ] **Cero colores crudos** en superficies/texto/bordes: solo `var(--…)` (se ve bien en dark).
- [ ] Datos coherentes con el resto de pantallas (equipos, versiones, clústeres).
- [ ] Incluye `<script src="assets/app.js"></script>` al final.
- [ ] Abre en el navegador y se navega desde `index.html` y desde el sidebar.

---

## 6. Cómo previsualizar

Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
cd design/mockups && python3 -m http.server 8080
# http://localhost:8080
```
