<?php

/**
 * Script B.3 – Wires Form Request authorize() to existing Policies.
 *
 * For each Store* request: check 'create' on the model class.
 * For each Update* request: check 'update' on the route-bound instance.
 *
 * Run from the project root:
 *   php scripts/wire-authorization.php
 */

declare(strict_types=1);

$requestsDir = '/var/www/html/app/Http/Requests';

/**
 * Mapping: Request class name => [model_class, route_param_name]
 *
 * route_param_name is null for Store requests.
 * For Update requests with a shared Form Request (StoreCategoryRequest), the
 * 'role_only' flag triggers a direct role check instead of a policy can() call.
 */
$mapping = [
    // ── Architecture domain ─────────────────────────────────────────────────
    'StoreBusinessCapabilityRequest'  => ['BusinessCapability', null],
    'UpdateBusinessCapabilityRequest' => ['BusinessCapability', 'business_capability'],
    'StoreBusinessDomainRequest'      => ['BusinessDomain', null],
    'UpdateBusinessDomainRequest'     => ['BusinessDomain', 'business_domain'],
    'StoreBusinessTierRequest'        => ['BusinessTier', null],
    'UpdateBusinessTierRequest'       => ['BusinessTier', 'business_tier'],
    'StoreEntityRequest'              => ['Entity', null],
    'UpdateEntityRequest'             => ['Entity', 'entity'],
    'StoreEntityAttributeRequest'     => ['EntityAttribute', null],
    'UpdateEntityAttributeRequest'    => ['EntityAttribute', 'attribute'],
    'StoreLifecyclePhaseRequest'      => ['LifecyclePhase', null],
    'UpdateLifecyclePhaseRequest'     => ['LifecyclePhase', 'lifecycle'],
    'StoreSystemRequest'              => ['System', null],
    'UpdateSystemRequest'             => ['System', 'system'],

    // ── Catalog domain ───────────────────────────────────────────────────────
    'StoreApiRequest'                 => ['Api', null],
    'UpdateApiRequest'                => ['Api', 'api'],
    'StoreApiStatusRequest'           => ['ApiStatus', null],
    'UpdateApiStatusRequest'          => ['ApiStatus', 'status'],
    'StoreApiTypeRequest'             => ['ApiType', null],
    'UpdateApiTypeRequest'            => ['ApiType', 'api_type'],
    // StoreCategoryRequest / UpdateCategoryRequest are shared across
    // ApiCategoryController, LinkCategoryController, ResourceCategoryController.
    // All underlying policies use the same isAdmin()||isEditor() rule, so we
    // do a direct role check to avoid coupling to a specific model class.
    'StoreCategoryRequest'            => ['Category', null],           // uses can('create', Category::class)
    'UpdateCategoryRequest'           => ['Category', null, 'role_only' => true], // direct role check
    'StoreComponentTypeRequest'       => ['ComponentType', null],
    'UpdateComponentTypeRequest'      => ['ComponentType', 'component_type'],
    'StoreEnvironmentRequest'         => ['Environment', null],
    'UpdateEnvironmentRequest'        => ['Environment', 'environment'],
    'StoreFrameworkRequest'           => ['Framework', null],
    'UpdateFrameworkRequest'          => ['Framework', 'framework'],
    'StoreLinkRequest'                => ['Link', null],
    'UpdateLinkRequest'               => ['Link', 'link'],
    'StorePlatformRequest'            => ['Platform', null],
    'UpdatePlatformRequest'           => ['Platform', 'platform'],
    'StoreProgrammingLanguageRequest' => ['ProgrammingLanguage', null],
    'UpdateProgrammingLanguageRequest'=> ['ProgrammingLanguage', 'programming_language'],
    'StoreResourceRequest'            => ['Resource', null],
    'UpdateResourceRequest'           => ['Resource', 'resource'],
    'StoreServiceModelRequest'        => ['ServiceModel', null],
    'UpdateServiceModelRequest'       => ['ServiceModel', 'service_model'],

    // ── CI/CD domain ─────────────────────────────────────────────────────────
    'StoreDeploymentRequest'          => ['Deployment', null],
    'UpdateDeploymentRequest'         => ['Deployment', 'deployment'],
    'StoreReleaseRequest'             => ['Release', null],
    'UpdateReleaseRequest'            => ['Release', 'release'],
    'StoreReleaseArtifactRequest'     => ['ReleaseArtifact', null],
    'UpdateReleaseArtifactRequest'    => ['ReleaseArtifact', 'artifact'],
    'StoreWorkflowJobRequest'         => ['WorkflowJob', null],
    'UpdateWorkflowJobRequest'        => ['WorkflowJob', 'job'],
    'StoreWorkflowRunRequest'         => ['WorkflowRun', null],
    'UpdateWorkflowRunRequest'        => ['WorkflowRun', 'run'],

    // ── Compliance domain ────────────────────────────────────────────────────
    'StoreComplianceStandardRequest'  => ['ComplianceStandard', null],
    'UpdateComplianceStandardRequest' => ['ComplianceStandard', 'compliance_standard'],

    // ── Infrastructure domain ────────────────────────────────────────────────
    'StoreClusterRequest'             => ['Cluster', null],
    'UpdateClusterRequest'            => ['Cluster', 'cluster'],
    'StoreClusterTypeRequest'         => ['ClusterType', null],
    'UpdateClusterTypeRequest'        => ['ClusterType', 'type'],
    'StoreInfrastructureTypeRequest'  => ['InfrastructureType', null],
    'UpdateInfrastructureTypeRequest' => ['InfrastructureType', 'infrastructure_type'],
    'StoreNodeRequest'                => ['Node', null],
    'UpdateNodeRequest'               => ['Node', 'node'],
    'StoreVendorRequest'              => ['Vendor', null],
    'UpdateVendorRequest'             => ['Vendor', 'vendor'],

    // ── Operations domain ────────────────────────────────────────────────────
    'StoreServiceStatusRequest'       => ['ServiceStatus', null],
    'UpdateServiceStatusRequest'      => ['ServiceStatus', 'service_status'],

    // ── Organization domain ──────────────────────────────────────────────────
    'StoreGroupRequest'               => ['Group', null],
    'UpdateGroupRequest'              => ['Group', 'group'],
    'StoreGroupMemberRoleRequest'     => ['GroupMemberRole', null],
    'UpdateGroupMemberRoleRequest'    => ['GroupMemberRole', 'member_role'],
    'StoreGroupTypeRequest'           => ['GroupType', null],
    'UpdateGroupTypeRequest'          => ['GroupType', 'type'],
    'StoreUserRequest'                => ['User', null],
    'UpdateUserRequest'               => ['User', 'user'],

    // ── Security domain ──────────────────────────────────────────────────────
    'StoreAuthenticationMethodRequest'  => ['AuthenticationMethod', null],
    'UpdateAuthenticationMethodRequest' => ['AuthenticationMethod', 'authentication_method'],
    'StoreServiceAccountRequest'        => ['ServiceAccount', null],
    'UpdateServiceAccountRequest'       => ['ServiceAccount', 'service_account'],
    'StoreServiceAccountTokenRequest'   => ['ServiceAccountToken', null],
    'UpdateServiceAccountTokenRequest'  => ['ServiceAccountToken', 'token'],
];

$updated = 0;
$skipped = 0;
$errors  = 0;

foreach ($mapping as $className => $config) {
    [$modelClass, $routeParam] = $config;
    $roleOnly = $config['role_only'] ?? false;

    $file = $requestsDir . '/' . $className . '.php';

    if (! file_exists($file)) {
        echo "[SKIP]    $className – file not found\n";
        $skipped++;
        continue;
    }

    $content = file_get_contents($file);

    // Skip if authorize() is already non-trivial (not just "return true;")
    if (! str_contains($content, 'return true;')) {
        echo "[SKIP]    $className – already has custom authorize()\n";
        $skipped++;
        continue;
    }

    $namespace = 'App\\Models\\' . $modelClass;

    // ── Build the new authorize() body ──────────────────────────────────────
    if ($roleOnly) {
        // Shared request across multiple model types: direct role check
        $newAuthorize = <<<'PHP'
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && ($user->isAdmin() || $user->isEditor());
    }
PHP;
    } elseif ($routeParam === null) {
        // Store request: check create policy on model class
        $newAuthorize = <<<PHP
    public function authorize(): bool
    {
        return \$this->user()?->can('create', {$modelClass}::class) ?? false;
    }
PHP;
    } else {
        // Update request: check update policy on route-bound instance
        $newAuthorize = <<<PHP
    public function authorize(): bool
    {
        return \$this->user()?->can('update', \$this->route('{$routeParam}')) ?? false;
    }
PHP;
    }

    // ── Replace the old authorize() method ──────────────────────────────────
    $pattern = '/(\s*)public function authorize\(\): bool\s*\{\s*return true;\s*\}/';
    $newContent = preg_replace($pattern, "\n" . $newAuthorize, $content, 1, $count);

    if ($count === 0) {
        echo "[ERROR]   $className – could not locate authorize() pattern\n";
        $errors++;
        continue;
    }

    // ── Ensure the model use-import exists (skip for role_only) ─────────────
    if (! $roleOnly) {
        $useStatement = "use {$namespace};";

        if (! str_contains($newContent, $useStatement)) {
            // Insert after the last existing "use " line
            $newContent = preg_replace(
                '/(use [^\n]+;\n)(?!use )/',
                '$1' . $useStatement . "\n",
                $newContent,
                1
            );
        }
    }

    file_put_contents($file, $newContent);
    echo "[UPDATED] $className\n";
    $updated++;
}

echo "\n";
echo "Done.  Updated: $updated  |  Skipped: $skipped  |  Errors: $errors\n";
