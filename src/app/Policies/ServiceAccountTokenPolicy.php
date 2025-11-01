<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ServiceAccountToken;
use App\Models\User;

class ServiceAccountTokenPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ServiceAccountToken $serviceAccountToken): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ServiceAccountToken $serviceAccountToken): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ServiceAccountToken $serviceAccountToken): bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ServiceAccountToken $serviceAccountToken): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ServiceAccountToken $serviceAccountToken): bool
    {
        return true;
    }
}
