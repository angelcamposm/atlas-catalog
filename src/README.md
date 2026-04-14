# Atlas Catalog - Backend API

Laravel 11-based RESTful API for managing API catalogs, lifecycles, types, architecture entities, CI/CD resources, and infrastructure metadata. Fully authenticated and authorized with role-based access control.

## 🚀 Tech Stack

- **Framework**: [Laravel 11.x](https://laravel.com)
- **PHP Version**: 8.4+
- **Database**: PostgreSQL (production), SQLite (development)
- **API Style**: RESTful JSON API
- **Authentication**: Laravel Sanctum (token-based, fully implemented)
- **Authorization**: Laravel Policies (RBAC with admin/editor/viewer roles)
- **API Docs**: [Scramble](https://scramble.dedoc.co/) (OpenAPI 3.1)
- **Testing**: PHPUnit 12

## 📁 Project Structure

```
src/
├── app/
│   ├── Console/Commands/      # Artisan commands
│   ├── Enums/                 # PHP 8.1+ enums
│   ├── Http/
│   │   ├── Controllers/       # API Controllers
│   │   ├── Requests/          # Form Request validation
│   │   └── Resources/         # API Resources (JSON transformers)
│   ├── Models/                # Eloquent Models
│   ├── Observers/             # Model Observers
│   ├── Policies/              # Authorization Policies
│   └── Traits/                # Reusable Traits
├── database/
│   ├── data/                  # Seed data files
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── routes/
│   ├── api.php                # API routes (/api/v1/*)
│   └── web.php                # Web routes
└── tests/
    ├── Feature/               # Feature tests
    └── Unit/                  # Unit tests
```

## 🔌 API Endpoints

All endpoints are versioned under `/api/v1/` and require Sanctum token authentication.  
The API exposes **213 operations** across **7 domains** (catalog, architecture, CI/CD, infrastructure, integrations, platform, and tooling).

### Interactive Docs

With the backend running, the full OpenAPI 3.1 spec is browsable at:

```
http://localhost:8080/docs/api
```

The generated spec is also committed at [`public/api.json`](public/api.json) for offline use.

### Domain Overview

| Domain         | Prefix                    | Resources                                                                        |
| -------------- | ------------------------- | -------------------------------------------------------------------------------- |
| Catalog        | `/api/v1/catalog/`        | APIs, API Types, Lifecycles, Platforms, Protocols, Scopes, Specs, Tags, Teams, … |
| Architecture   | `/api/v1/architecture/`   | Business Capabilities, Components, Domains, Entities, Systems                    |
| CI/CD          | `/api/v1/cicd/`           | Deployments, Releases, Service Models, Workflow Jobs, Workflow Runs              |
| Infrastructure | `/api/v1/infrastructure/` | Clusters, Databases, Environments, Service Instances, …                          |
| Integrations   | `/api/v1/integrations/`   | Access Policies, Categories, Data Types, Event Types, Queues                     |
| Platform       | `/api/v1/platform/`       | Programming Languages, Frameworks                                                |
| Tooling        | `/api/v1/tooling/`        | Tools                                                                            |

### Programming Languages (example)

- `GET    /api/v1/programming-languages` - List all languages (paginated)
- `POST   /api/v1/programming-languages` - Create new language
- `GET    /api/v1/programming-languages/{id}` - Get language details
- `PUT    /api/v1/programming-languages/{id}` - Update language
- `DELETE /api/v1/programming-languages/{id}` - Delete language

## 📊 Database Schema

The schema covers 38+ Eloquent models across the 7 API domains. Refer to [`database/migrations/`](database/migrations/) for the full table definitions, or explore the OpenAPI spec at [`public/api.json`](public/api.json) for the request/response shapes of each resource.

## 🔐 Authentication & Authorization

### Authentication (Sanctum)

All `/api/v1/*` routes require a valid Sanctum token:

```http
Authorization: Bearer <token>
```

Tokens are issued via `POST /api/v1/auth/login` and revoked via `POST /api/v1/auth/logout`.

### Authorization (RBAC)

Three roles are supported: **admin**, **editor**, **viewer**.

| Action          | Admin | Editor | Viewer |
| --------------- | ----- | ------ | ------ |
| Read (GET)      | ✅    | ✅     | ✅     |
| Create (POST)   | ✅    | ✅     | ❌     |
| Update (PUT)    | ✅    | ✅     | ❌     |
| Delete (DELETE) | ✅    | ❌     | ❌     |

Authorization is enforced at two layers:

1. **Form Requests** — `authorize()` checks the user's policy before validation runs
2. **Policies** — one `{Model}Policy` per resource, with `create`, `update`, and `delete` rules

## 🔧 Development Setup (Docker)

This backend runs in a Docker container. See the main [README.md](../README.md) for full setup instructions.

### Quick Start

```bash
# From project root
./build/scripts/atlas.sh start

# Backend will be available at:
# http://localhost:8080/api/v1/*
# OpenAPI docs at: http://localhost:8080/docs/api
```

### Environment Variables

Key variables in `.env`:

```env
APP_NAME="Atlas Catalog"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=pgsql
DB_HOST=postgres-dev
DB_PORT=5432
DB_DATABASE=atlas_catalog
DB_USERNAME=atlas_user
DB_PASSWORD=atlas_password
```

## 🧪 Testing

```bash
# Run all tests (from project root)
docker exec -it atlas-app php -d memory_limit=512M vendor/bin/phpunit --no-coverage

# Run a specific feature suite
docker exec -it atlas-app php -d memory_limit=512M vendor/bin/phpunit --no-coverage tests/Feature/CiCd/

# Run with coverage (slower)
docker exec -it atlas-app php -d memory_limit=512M vendor/bin/phpunit --coverage-text
```

## 📝 Code Style

This project follows:

- **PSR-12** coding standards
- **Laravel Pint** for code formatting (config in `pint.json`)
- **PHPStan** for static analysis (planned)

### Conventions

- **Models**: Singular nouns (e.g., `Api`, `ApiType`)
- **Controllers**: Singular with `Controller` suffix (e.g., `ApiController`)
- **Tables**: Plural snake_case (e.g., `apis`, `api_types`)
- **Routes**: Plural resource names (e.g., `/apis`, `/lifecycles`)
- **Observers**: Applied via `#[ObservedBy(Observer::class)]` attribute
- **Form Requests**: Separate `Store{Model}Request` and `Update{Model}Request`
- **API Resources**: Single `{Model}Resource` and `{Model}Collection`

## 🔐 Security

- **CORS**: Configured to allow frontend origin
- **Validation**: All inputs validated via Form Requests
- **Mass Assignment**: Protected via `$fillable` properties
- **Authentication**: Laravel Sanctum (token-based, implemented)
- **Authorization**: Laravel Policies with RBAC (admin/editor/viewer)

## 📖 API Documentation

API documentation is auto-generated by [Scramble](https://scramble.dedoc.co/) from PHPDoc and type annotations:

- **Interactive UI**: `http://localhost:8080/docs/api` (when running)
- **OpenAPI spec**: [`public/api.json`](public/api.json) (213 operations, committed)
- **Routes overview**: `php artisan route:list`

## 🚀 Deployment

This backend is containerized and ready for deployment:

1. **Docker**: Production-ready `Dockerfile` included
2. **Kubernetes**: Manifests available in `iac/` directory
3. **Environment**: Configure `.env` for production settings

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [RESTful API Design](https://restfulapi.net/)

## 🤝 Contributing

Contributions are welcome! Please follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md).

This is an open-source project. Follow TDD: write tests first, then implement. See [`AGENTS.md`](../AGENTS.md) for agent-specific guidelines.

## 📄 License

This project is open-sourced software licensed under the [MIT license](../LICENSE.md).
