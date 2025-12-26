<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

trait BelongsToUserState
{
    /**
     * Configures the factory to set the 'created_by' attribute using a User factory.
     *
     * @return Factory Returns the modified factory instance with the 'created_by' state applied.
     */
    public function withCreator(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'created_by' => User::factory(),
            ];
        });
    }

    /**
     * Configures the factory to set the 'updated_by' attribute using a User factory.
     *
     * @return Factory Returns the modified factory instance with the 'updated_by' state applied.
     */
    public function withUpdater(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'updated_by' => User::factory(),
            ];
        });
    }
}
