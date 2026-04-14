<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\BusinessCapabilitySystem;
use App\Models\User;

class BusinessCapabilitySystemPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, BusinessCapabilitySystem $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, BusinessCapabilitySystem $model): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, BusinessCapabilitySystem $model): bool
    {
        return $user->isAdmin();
    }
}
