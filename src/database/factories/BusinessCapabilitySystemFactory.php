<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\BusinessCapability;
use App\Models\BusinessCapabilitySystem;
use App\Models\System;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessCapabilitySystem>
 */
class BusinessCapabilitySystemFactory extends Factory
{
    protected $model = BusinessCapabilitySystem::class;

    public function definition(): array
    {
        return [
            'business_capability_id' => BusinessCapability::factory(),
            'system_id' => System::factory(),
        ];
    }
}
