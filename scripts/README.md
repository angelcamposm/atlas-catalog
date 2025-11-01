# Scripts de Automatización

## 📦 Sistema de Versionado Automático

### Descripción

Este proyecto incluye un sistema de versionado automático que incrementa la versión de la aplicación en cada commit que incluya cambios en el directorio `frontend/`.

### Archivos

#### 1. `bump-version.sh`

Script que incrementa automáticamente el número de parche (patch) en `frontend/package.json`.

**Formato de versión:** `MAJOR.MINOR.PATCH` (ejemplo: `0.1.0` → `0.1.1`)

**Uso manual:**

```bash
./scripts/bump-version.sh
```

**Funcionalidad:**

-   Lee la versión actual de `frontend/package.json`
-   Incrementa el último número (patch) en 1
-   Actualiza `frontend/package.json` con la nueva versión
-   Añade automáticamente el archivo al staging area de git

#### 2. Git Hook `pre-commit`

Hook de git instalado en `.git/hooks/pre-commit` que se ejecuta automáticamente antes de cada commit.

**Comportamiento:**

-   Detecta si hay cambios en el directorio `frontend/`
-   Si hay cambios, ejecuta `bump-version.sh` automáticamente
-   Si no hay cambios en frontend, no hace nada

**Instalación:**
El hook ya está instalado y listo para usar. Si necesitas reinstalarlo:

```bash
cp scripts/bump-version.sh scripts/bump-version.sh
chmod +x .git/hooks/pre-commit
```

### Flujo de Trabajo

1. **Realizar cambios en el código** (especialmente en `frontend/`)
2. **Agregar archivos al staging area:**
    ```bash
    git add .
    ```
3. **Hacer commit:**
    ```bash
    git commit -m "feat: Nueva funcionalidad"
    ```
4. **El sistema automáticamente:**
    - Detecta cambios en frontend
    - Incrementa la versión (ej: 0.1.1 → 0.1.2)
    - Incluye el cambio de versión en el commit
    - Muestra mensaje: `📦 Frontend changes detected, bumping version...`

### Visualización de la Versión

La versión actual se muestra en:

-   **Página de Ajustes** → Sección "System Information"
-   **package.json** → Campo `version`

### Ejemplos

**Cambio automático al hacer commit:**

```bash
$ git add frontend/components/NewComponent.tsx
$ git commit -m "feat: Add new component"
📦 Frontend changes detected, bumping version...
Current version: 0.1.5
New version: 0.1.6
✅ Version bumped from 0.1.5 to 0.1.6
✅ frontend/package.json staged for commit
[frontend abc1234] feat: Add new component
 2 files changed, 50 insertions(+)
```

**Cambio manual de versión:**

```bash
$ ./scripts/bump-version.sh
Current version: 0.1.6
New version: 0.1.7
✅ Version bumped from 0.1.6 to 0.1.7
✅ frontend/package.json staged for commit
```

### Incremento Manual de MAJOR o MINOR

Si necesitas incrementar la versión MAJOR o MINOR manualmente, edita `frontend/package.json`:

-   **MAJOR** (cambios incompatibles): `1.0.0` → `2.0.0`
-   **MINOR** (nuevas funcionalidades): `0.1.0` → `0.2.0`
-   **PATCH** (correcciones): `0.1.0` → `0.1.1` (automático)

### Desactivar el Versionado Automático

Si necesitas hacer un commit sin incrementar la versión:

**Opción 1:** No incluir cambios en `frontend/`:

```bash
git add src/backend/file.php
git commit -m "fix: Backend fix"
# No se incrementa la versión
```

**Opción 2:** Usar `--no-verify`:

```bash
git commit -m "docs: Update README" --no-verify
# Omite el pre-commit hook
```

**Opción 3:** Eliminar temporalmente el hook:

```bash
chmod -x .git/hooks/pre-commit
# Hacer commits sin versionado
chmod +x .git/hooks/pre-commit
```

### Notas

-   El script es compatible con **macOS** y **Linux**
-   La versión se actualiza **solo si hay cambios en frontend/**
-   El cambio de versión se incluye **automáticamente en el commit**
-   La versión se muestra dinámicamente en la interfaz desde `package.json`

### Troubleshooting

**Problema:** El hook no se ejecuta

```bash
# Verificar permisos
ls -la .git/hooks/pre-commit
# Debe mostrar: -rwxr-xr-x

# Dar permisos si no los tiene
chmod +x .git/hooks/pre-commit
```

**Problema:** Error al leer la versión

```bash
# Verificar formato en package.json
grep version frontend/package.json
# Debe mostrar: "version": "0.1.x",
```

---

## 🔧 Otros Scripts

(Añadir documentación de otros scripts aquí según sea necesario)
