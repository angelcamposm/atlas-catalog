# E2E tests against the real backend

The specs in this folder exercise the **deployed** stack — they hit the
real Laravel backend and a real Postgres instance through `nginx`.
There is **no network mocking**.

## Running

1.  Bring up the full stack:

    ```bash
    docker compose -f docker-compose.full.yml up -d
    ```

    Verify both endpoints respond:

    ```bash
    curl -s -o /dev/null -w "backend:%{http_code}\n" \
        http://localhost:8080/api/v1/catalog/apis
    curl -s -o /dev/null -w "frontend:%{http_code}\n" \
        http://localhost:3001/es/login
    ```

2.  In `frontend/`, run only the real specs:

    ```bash
    pnpm test:e2e:real
    ```

The Playwright `globalSetup` will:

    - Verify the backend is reachable (and **fail fast** otherwise).
    - Log in as `admin@example.com` / `password`.
    - Persist the authenticated browser storage state at
      `e2e/.auth/admin.json` so individual tests don't need to log in.

## Environment variables

| Variable              | Default                 | Purpose                                               |
| --------------------- | ----------------------- | ----------------------------------------------------- |
| `E2E_BASE_URL`        | `http://localhost:3001` | Frontend URL                                          |
| `E2E_API_URL`         | `http://localhost:8080` | Backend URL (used by `globalSetup` and specs)         |
| `E2E_ADMIN_EMAIL`     | `admin@example.com`     | Credentials for the seeded admin user                 |
| `E2E_ADMIN_PASSWORD`  | `password`              | "                                                     |
| `E2E_REQUIRE_BACKEND` | `1`                     | Set to `0` to allow smoke-only runs without a backend |

## Smoke mode

Setting `E2E_REQUIRE_BACKEND=0` skips authentication and persists an empty
storage state. Real specs use the helper in [`_real-test.ts`](_real-test.ts)
which auto-skips when no authenticated session is available, so the suite
won't crash in CI environments without a live backend.

## Adding new real specs

1.  Place the file in `e2e/real/` with the suffix `.real.spec.ts`.
2.  Import `test, expect` from `./_real-test` (which reuses the
    captured admin storage state and auto-skips in smoke mode).
3.  Use absolute URLs built from `process.env.E2E_BASE_URL` /
    `E2E_API_URL` so the same spec runs against any environment.
