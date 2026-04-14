<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ComplianceRequirement;
use App\Models\User;

class ComplianceRequirementPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ComplianceRequirement $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, ComplianceRequirement $model): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, ComplianceRequirement $model): bool
    {
        return $user->isAdmin();
    }
}
