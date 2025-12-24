<?php

declare(strict_types=1);

namespace Database\Seeders;
use App\Models\Api;
use App\Models\ApiAccessPolicy;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
use App\Models\Category;
use App\Models\Group;
use App\Models\GroupType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->create_initial_user();
        $this->run_base_seeders();
        $this->create_sample_groups();
        $this->create_sample_data();
    }

    private function create_initial_user(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ],
        );
    }

    private function run_base_seeders(): void
    {
        // First-level models
        $this->call([
            ApiStatusSeeder::class,
            ApiTypeSeeder::class,
            AuthenticationMethodSeeder::class,
            BusinessCapabilitySeeder::class,
            BusinessDomainSeeder::class,
            BusinessTierSeeder::class,
            CategorySeeder::class,
            ComplianceStandardSeeder::class,
            EnvironmentSeeder::class,
            GroupMemberRoleSeeder::class,
            GroupTypeSeeder::class,
            InfrastructureTypeSeeder::class,
            LifecyclePhaseSeeder::class,
            PlatformSeeder::class,
            ProgrammingLanguageSeeder::class,
            ServiceStatusSeeder::class,
            VendorSeeder::class,
        ]);

        // Second-level models (models that depend on another model)
        $this->call([
            ClusterTypeSeeder::class,
            FrameworkSeeder::class,
        ]);
    }

    /**
     * Creates sample groups for development environments.
     */
    private function create_sample_groups(): void
    {
        if (app()->isProduction()) {
            return;
        }

        $teamType = GroupType::where('name', 'Team')->first();
        $platformType = GroupType::where('name', 'Platform Team')->first();
        $productType = GroupType::where('name', 'Product Area')->first();

        if (!$teamType) {
            return;
        }

        $groups = [
            // Platform Teams
            [
                'name' => 'platform-core',
                'description' => 'Core platform infrastructure and shared services',
                'email' => 'platform-core@atlas.dev',
                'label' => 'Platform Core',
                'icon' => 'server',
                'type_id' => $platformType?->id ?? $teamType->id,
            ],
            [
                'name' => 'platform-security',
                'description' => 'Security, authentication and authorization services',
                'email' => 'security@atlas.dev',
                'label' => 'Security Team',
                'icon' => 'shield',
                'type_id' => $platformType?->id ?? $teamType->id,
            ],
            // Product Teams
            [
                'name' => 'team-payments',
                'description' => 'Payment processing and billing services',
                'email' => 'payments@atlas.dev',
                'label' => 'Payments Team',
                'icon' => 'credit-card',
                'type_id' => $teamType->id,
            ],
            [
                'name' => 'team-orders',
                'description' => 'Order management and fulfillment',
                'email' => 'orders@atlas.dev',
                'label' => 'Orders Team',
                'icon' => 'shopping-cart',
                'type_id' => $teamType->id,
            ],
            [
                'name' => 'team-users',
                'description' => 'User management and profiles',
                'email' => 'users@atlas.dev',
                'label' => 'Users Team',
                'icon' => 'users',
                'type_id' => $teamType->id,
            ],
            [
                'name' => 'team-analytics',
                'description' => 'Analytics, reporting and data insights',
                'email' => 'analytics@atlas.dev',
                'label' => 'Analytics Team',
                'icon' => 'chart-bar',
                'type_id' => $teamType->id,
            ],
            [
                'name' => 'team-notifications',
                'description' => 'Notification and communication services',
                'email' => 'notifications@atlas.dev',
                'label' => 'Notifications Team',
                'icon' => 'bell',
                'type_id' => $teamType->id,
            ],
            [
                'name' => 'team-inventory',
                'description' => 'Inventory and stock management',
                'email' => 'inventory@atlas.dev',
                'label' => 'Inventory Team',
                'icon' => 'archive',
                'type_id' => $teamType->id,
            ],
        ];

        foreach ($groups as $groupData) {
            Group::firstOrCreate(
                ['name' => $groupData['name']],
                $groupData
            );
        }

        if (app()->runningInConsole()) {
            $this->command->info('Created ' . count($groups) . ' sample groups.');
        }
    }

    /**
     * Creates sample API data for development environments by reusing existing relations.
     */
    private function create_sample_data(): void
    {
        if (app()->isProduction()) {
            return;
        }

        // Reuse existing related models to avoid creating new ones for each API.
        $accessPolicies = ApiAccessPolicy::all();
        $statuses = ApiStatus::all();
        $types = ApiType::all();
        $authMethods = AuthenticationMethod::all();
        $categories = Category::all();

        // Ensure base seeders have run and we have data to link.
        if ($accessPolicies->isEmpty() || $statuses->isEmpty() || $types->isEmpty() || $authMethods->isEmpty()) {
            if (app()->runningInConsole()) {
                $this->command->warn('One or more base tables are empty. Skipping API sample data creation.');
            }
            return;
        }

        // Get specific statuses for variety
        $publishedStatus = $statuses->firstWhere('name', 'Published') ?? $statuses->first();
        $draftStatus = $statuses->firstWhere('name', 'Draft') ?? $statuses->first();
        $deprecatedStatus = $statuses->firstWhere('name', 'Deprecated') ?? $statuses->first();

        // Get specific types for variety
        $restType = $types->firstWhere('name', 'REST') ?? $types->first();
        $graphqlType = $types->firstWhere('name', 'GraphQL') ?? $types->first();
        $grpcType = $types->firstWhere('name', 'gRPC') ?? $types->first();
        $webhookType = $types->firstWhere('name', 'Webhooks') ?? $types->first();

        // Get specific access policies
        $publicPolicy = $accessPolicies->firstWhere('name', 'Public API') ?? $accessPolicies->first();
        $internalPolicy = $accessPolicies->firstWhere('name', 'Internal API') ?? $accessPolicies->first();
        $partnerPolicy = $accessPolicies->firstWhere('name', 'Partner API') ?? $accessPolicies->first();

        // Get specific auth methods
        $oauth = $authMethods->firstWhere('name', 'OAuth 2.0') ?? $authMethods->first();
        $apiKey = $authMethods->firstWhere('name', 'API Key') ?? $authMethods->first();
        $jwt = $authMethods->firstWhere('name', 'JWT Bearer Token') ?? $authMethods->first();

        // Get categories
        $authCategory = $categories->firstWhere('name', 'Authentication & Authorization');
        $paymentsCategory = $categories->firstWhere('name', 'Payments & Billing');
        $userCategory = $categories->firstWhere('name', 'User Management');
        $notifCategory = $categories->firstWhere('name', 'Notifications');
        $analyticsCategory = $categories->firstWhere('name', 'Analytics & Monitoring');
        $ecommerceCategory = $categories->firstWhere('name', 'E-commerce');
        $searchCategory = $categories->firstWhere('name', 'Search');

        $sampleApis = [
            // Published REST APIs
            [
                'name' => 'users-api',
                'display_name' => 'Users API',
                'description' => 'API RESTful para gestión completa de usuarios. Permite crear, actualizar, eliminar y consultar perfiles de usuario con soporte para roles y permisos.',
                'version' => '2.3.0',
                'protocol' => 'https',
                'url' => 'https://api.atlas-catalog.com/v2/users',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => $userCategory?->id,
            ],
            [
                'name' => 'orders-api',
                'display_name' => 'Orders API',
                'description' => 'API para gestión del ciclo de vida completo de pedidos. Incluye creación, seguimiento, modificación y cancelación de órdenes.',
                'version' => '3.1.0',
                'protocol' => 'https',
                'url' => 'https://api.atlas-catalog.com/v3/orders',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $ecommerceCategory?->id,
            ],
            [
                'name' => 'products-catalog-api',
                'display_name' => 'Product Catalog API',
                'description' => 'Catálogo completo de productos con búsqueda avanzada, filtros, categorización y gestión de inventario en tiempo real.',
                'version' => '4.0.0',
                'protocol' => 'https',
                'url' => 'https://api.atlas-catalog.com/v4/products',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $publicPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $ecommerceCategory?->id,
            ],
            [
                'name' => 'payments-gateway',
                'display_name' => 'Payments Gateway API',
                'description' => 'Gateway de pagos unificado con soporte para múltiples procesadores (Stripe, PayPal, Adyen). Maneja transacciones, reembolsos y suscripciones.',
                'version' => '2.0.0',
                'protocol' => 'https',
                'url' => 'https://payments.atlas-catalog.com/v2',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $partnerPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => $paymentsCategory?->id,
            ],
            // GraphQL APIs
            [
                'name' => 'analytics-graphql',
                'display_name' => 'Analytics GraphQL API',
                'description' => 'API GraphQL para consultas flexibles de datos analíticos. Permite agregaciones personalizadas, métricas en tiempo real y dashboards dinámicos.',
                'version' => '1.5.0',
                'protocol' => 'https',
                'url' => 'https://analytics.atlas-catalog.com/graphql',
                'type_id' => $graphqlType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $analyticsCategory?->id,
            ],
            [
                'name' => 'content-graphql',
                'display_name' => 'Content Management GraphQL',
                'description' => 'API GraphQL para gestión de contenido headless. Soporta múltiples tipos de contenido, localización y versionado.',
                'version' => '2.1.0',
                'protocol' => 'https',
                'url' => 'https://content.atlas-catalog.com/graphql',
                'type_id' => $graphqlType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => null,
            ],
            // gRPC Services
            [
                'name' => 'inventory-grpc',
                'display_name' => 'Inventory gRPC Service',
                'description' => 'Servicio gRPC de alto rendimiento para gestión de inventario en tiempo real. Optimizado para operaciones de alta frecuencia.',
                'version' => '1.0.0',
                'protocol' => 'https',
                'url' => 'grpc://inventory.atlas-catalog.com:443',
                'type_id' => $grpcType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $ecommerceCategory?->id,
            ],
            [
                'name' => 'search-grpc',
                'display_name' => 'Search gRPC Service',
                'description' => 'Motor de búsqueda distribuido con soporte para búsqueda full-text, facetas y sugerencias en tiempo real.',
                'version' => '2.0.0',
                'protocol' => 'https',
                'url' => 'grpc://search.atlas-catalog.com:443',
                'type_id' => $grpcType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $searchCategory?->id,
            ],
            // Webhooks
            [
                'name' => 'notifications-webhooks',
                'display_name' => 'Notifications Webhooks',
                'description' => 'Sistema de webhooks para notificaciones en tiempo real. Soporta eventos de pedidos, usuarios, pagos y más.',
                'version' => '1.2.0',
                'protocol' => 'https',
                'url' => 'https://webhooks.atlas-catalog.com/v1',
                'type_id' => $webhookType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $partnerPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $notifCategory?->id,
            ],
            // Auth API
            [
                'name' => 'auth-api',
                'display_name' => 'Authentication API',
                'description' => 'API de autenticación centralizada con soporte para OAuth 2.0, OIDC, SAML y MFA. Gestión de sesiones y tokens.',
                'version' => '3.0.0',
                'protocol' => 'https',
                'url' => 'https://auth.atlas-catalog.com/v3',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $publicPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => $authCategory?->id,
            ],
            // Draft APIs
            [
                'name' => 'ai-recommendations',
                'display_name' => 'AI Recommendations API',
                'description' => 'API experimental de recomendaciones basada en machine learning. Proporciona sugerencias personalizadas de productos.',
                'version' => '0.5.0-beta',
                'protocol' => 'https',
                'url' => 'https://ai.atlas-catalog.com/recommendations/beta',
                'type_id' => $restType->id,
                'status_id' => $draftStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $analyticsCategory?->id,
            ],
            [
                'name' => 'chat-api',
                'display_name' => 'Chat API',
                'description' => 'API de mensajería en tiempo real para comunicación entre usuarios. En desarrollo activo.',
                'version' => '0.2.0-alpha',
                'protocol' => 'https',
                'url' => 'https://chat.atlas-catalog.com/alpha',
                'type_id' => $restType->id,
                'status_id' => $draftStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => $notifCategory?->id,
            ],
            // Deprecated APIs
            [
                'name' => 'legacy-users-v1',
                'display_name' => 'Users API v1 (Legacy)',
                'description' => 'Versión legacy del API de usuarios. Usar users-api v2.x en su lugar.',
                'version' => '1.9.0',
                'protocol' => 'https',
                'url' => 'https://api.atlas-catalog.com/v1/users',
                'type_id' => $restType->id,
                'status_id' => $deprecatedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $userCategory?->id,
                'deprecated_at' => now()->subMonths(3),
                'deprecation_reason' => 'Migrar a Users API v2.x para mejor rendimiento y nuevas funcionalidades.',
            ],
            [
                'name' => 'payments-v1',
                'display_name' => 'Payments API v1 (Deprecated)',
                'description' => 'API de pagos legacy. Migrar a Payments Gateway API v2.',
                'version' => '1.5.0',
                'protocol' => 'https',
                'url' => 'https://api.atlas-catalog.com/v1/payments',
                'type_id' => $restType->id,
                'status_id' => $deprecatedStatus->id,
                'access_policy_id' => $partnerPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $paymentsCategory?->id,
                'deprecated_at' => now()->subMonths(6),
                'deprecation_reason' => 'Esta API será desactivada el 2025-06-01. Usar Payments Gateway API v2.',
            ],
            // More REST APIs for variety
            [
                'name' => 'shipping-api',
                'display_name' => 'Shipping API',
                'description' => 'API para gestión de envíos con integración de múltiples carriers (FedEx, UPS, DHL). Tracking en tiempo real.',
                'version' => '2.2.0',
                'protocol' => 'https',
                'url' => 'https://shipping.atlas-catalog.com/v2',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $partnerPolicy->id,
                'authentication_method_id' => $oauth->id,
                'category_id' => $ecommerceCategory?->id,
            ],
            [
                'name' => 'reports-api',
                'display_name' => 'Reports API',
                'description' => 'API para generación y gestión de reportes. Soporta múltiples formatos (PDF, Excel, CSV) y programación.',
                'version' => '1.8.0',
                'protocol' => 'https',
                'url' => 'https://reports.atlas-catalog.com/v1',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => $analyticsCategory?->id,
            ],
            [
                'name' => 'email-service',
                'display_name' => 'Email Service API',
                'description' => 'Servicio de envío de emails transaccionales y marketing. Templates, tracking y analytics.',
                'version' => '3.0.0',
                'protocol' => 'https',
                'url' => 'https://email.atlas-catalog.com/v3',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $notifCategory?->id,
            ],
            [
                'name' => 'files-storage-api',
                'display_name' => 'File Storage API',
                'description' => 'API para almacenamiento y gestión de archivos. Soporta uploads multipart, CDN y transformaciones de imagen.',
                'version' => '2.0.0',
                'protocol' => 'https',
                'url' => 'https://files.atlas-catalog.com/v2',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $internalPolicy->id,
                'authentication_method_id' => $jwt->id,
                'category_id' => null,
            ],
            [
                'name' => 'geolocation-api',
                'display_name' => 'Geolocation API',
                'description' => 'API de geolocalización con geocoding, rutas y búsqueda de lugares cercanos.',
                'version' => '1.5.0',
                'protocol' => 'https',
                'url' => 'https://geo.atlas-catalog.com/v1',
                'type_id' => $restType->id,
                'status_id' => $publishedStatus->id,
                'access_policy_id' => $publicPolicy->id,
                'authentication_method_id' => $apiKey->id,
                'category_id' => $categories->firstWhere('name', 'Geolocation & Maps')?->id,
            ],
        ];

        $openApiSpec = <<<'YAML'
openapi: 3.0.3
info:
  title: %s
  version: %s
  description: |
    %s
servers:
  - url: %s
    description: Production
paths:
  /:
    get:
      summary: List resources
      responses:
        '200':
          description: Successful response
    post:
      summary: Create resource
      responses:
        '201':
          description: Created
YAML;

        foreach ($sampleApis as $apiData) {
            $spec = sprintf(
                $openApiSpec,
                $apiData['display_name'],
                $apiData['version'],
                $apiData['description'],
                $apiData['url']
            );
            $apiData['document_specification'] = $spec;

            Api::firstOrCreate(
                ['name' => $apiData['name']],
                $apiData
            );
        }

        if (app()->runningInConsole()) {
            $this->command->info('Created ' . count($sampleApis) . ' sample APIs.');
        }
    }
}
