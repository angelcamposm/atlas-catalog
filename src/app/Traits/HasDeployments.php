<?php

declare(strict_types=1);

namespace App\Traits;

use App\Enums\DeploymentStatus;
use App\Models\Deployment;
use App\Models\Environment;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasDeployments
{
    /**
     * Get the deployments for the model.
     */
    public function deployments(): HasMany
    {
        return $this->hasMany(Deployment::class);
    }

    /**
     * Get the current successful deployment for a specific environment.
     */
    public function currentDeployment(Environment $environment): ?Deployment
    {
        return $this->deployments()
            ->where('environment_id', $environment->id)
            ->where('status', DeploymentStatus::Success)
            ->latest('ended_at')
            ->first();
    }

    /**
     * Get the last failed deployment.
     */
    public function lastFailedDeployment(): ?Deployment
    {
        return $this->deployments()
            ->where('status', DeploymentStatus::Failed)
            ->latest('ended_at')
            ->first();
    }
}
