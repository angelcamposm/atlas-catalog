# Atlas Catalog - Backend API

Laravel 11-based RESTful API for managing API catalogs, lifecycles, types, and metadata.

## ⚠️ IMPORTANT: READ-ONLY

**This backend is STABLE and READ-ONLY**

-   No modifications should be made to this codebase
-   All active development is focused on the Next.js frontend
-   This API serves as a stable data source at `/api/v1/*` endpoints
-   Frontend must adapt to the existing API responses

## 🚀 Tech Stack

-   **Framework**: [Laravel 11.x](https://laravel.com)
-   **PHP Version**: 8.2+
-   **Database**: PostgreSQL (production), SQLite (development)
-   **API Style**: RESTful JSON API
-   **Authentication**: Laravel Sanctum (planned)
-   **Testing**: PHPUnit

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

All endpoints are versioned under `/api/v1/`:

### APIs

-   `GET    /api/v1/apis` - List all APIs (paginated)
-   `POST   /api/v1/apis` - Create new API
-   `GET    /api/v1/apis/{id}` - Get API details
-   `PUT    /api/v1/apis/{id}` - Update API
-   `DELETE /api/v1/apis/{id}` - Delete API

### API Types

-   `GET    /api/v1/api-types` - List all API types
-   `POST   /api/v1/api-types` - Create new type
-   `GET    /api/v1/api-types/{id}` - Get type details
-   `PUT    /api/v1/api-types/{id}` - Update type
-   `DELETE /api/v1/api-types/{id}` - Delete type

### Lifecycles

-   `GET    /api/v1/lifecycles` - List all lifecycles
-   `POST   /api/v1/lifecycles` - Create new lifecycle
-   `GET    /api/v1/lifecycles/{id}` - Get lifecycle details
-   `PUT    /api/v1/lifecycles/{id}` - Update lifecycle
-   `DELETE /api/v1/lifecycles/{id}` - Delete lifecycle

### Programming Languages

-   `GET    /api/v1/programming-languages` - List all languages
-   `POST   /api/v1/programming-languages` - Create new language
-   `GET    /api/v1/programming-languages/{id}` - Get language details
-   `PUT    /api/v1/programming-languages/{id}` - Update language
-   `DELETE /api/v1/programming-languages/{id}` - Delete language

## 📊 Database Schema

### Core Models

#### APIs (`apis` table)

-   `id` - Primary key
-   `name` - API name
-   `description` - API description
-   `version` - API version
-   `endpoint` - API endpoint URL
-   `api_type_id` - Foreign key to API types
-   `lifecycle_id` - Foreign key to lifecycles
-   `programming_language_id` - Foreign key to programming languages
-   `business_domain_category` - Business domain classification
-   `discovery_source` - How the API was discovered
-   `created_by` / `updated_by` - User tracking (nullable)
-   `created_at` / `updated_at` - Timestamps

#### API Types (`api_types` table)

-   `id` - Primary key
-   `name` - Type name (REST, GraphQL, SOAP, etc.)
-   `description` - Type description
-   `created_by` / `updated_by` - User tracking (nullable)
-   `created_at` / `updated_at` - Timestamps

#### Lifecycles (`lifecycles` table)

-   `id` - Primary key
-   `name` - Lifecycle name
-   `description` - Lifecycle description
-   `approval_required` - Boolean flag
-   `created_by` / `updated_by` - User tracking (nullable)
-   `created_at` / `updated_at` - Timestamps

#### Programming Languages (`programming_languages` table)

-   `id` - Primary key
-   `name` - Language name
-   `description` - Language description
-   `created_by` / `updated_by` - User tracking (nullable)
-   `created_at` / `updated_at` - Timestamps

## 🔧 Development Setup (Docker)

This backend runs in a Docker container. See the main [README.md](../README.md) for full setup instructions.

### Quick Start

```bash
# From project root
./build/scripts/atlas.sh start

# Backend will be available at:
# http://localhost:8080/api/v1/*
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
# Run all tests
docker exec -it atlas-backend-dev php artisan test

# Run specific test suite
docker exec -it atlas-backend-dev php artisan test --testsuite=Feature

# Run with coverage
docker exec -it atlas-backend-dev php artisan test --coverage
```

## 📝 Code Style

This project follows:

-   **PSR-12** coding standards
-   **Laravel Pint** for code formatting (config in `pint.json`)
-   **PHPStan** for static analysis (planned)

### Conventions

-   **Models**: Singular nouns (e.g., `Api`, `ApiType`)
-   **Controllers**: Singular with `Controller` suffix (e.g., `ApiController`)
-   **Tables**: Plural snake_case (e.g., `apis`, `api_types`)
-   **Routes**: Plural resource names (e.g., `/apis`, `/lifecycles`)
-   **Observers**: Applied via `#[ObservedBy(Observer::class)]` attribute
-   **Form Requests**: Separate `Store{Model}Request` and `Update{Model}Request`
-   **API Resources**: Single `{Model}Resource` and `{Model}Collection`

## 🔐 Security

-   **CORS**: Configured to allow frontend origin
-   **Validation**: All inputs validated via Form Requests
-   **Mass Assignment**: Protected via `$fillable` properties
-   **Authentication**: Laravel Sanctum (to be implemented)

## 📖 API Documentation

API documentation is available via:

-   Routes: `php artisan route:list`
-   Inline via API Resources
-   Swagger/OpenAPI (planned)

## 🚀 Deployment

This backend is containerized and ready for deployment:

1. **Docker**: Production-ready `Dockerfile` included
2. **Kubernetes**: Manifests available in `iac/` directory
3. **Environment**: Configure `.env` for production settings

## 📚 Additional Resources

-   [Laravel Documentation](https://laravel.com/docs)
-   [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
-   [RESTful API Design](https://restfulapi.net/)

## 🤝 Contributing

**Note**: This backend is currently in READ-ONLY mode. No contributions are being accepted at this time. All development efforts are focused on the Next.js frontend.

## 📄 License

This project is open-sourced software licensed under the [MIT license](../LICENSE.md).
