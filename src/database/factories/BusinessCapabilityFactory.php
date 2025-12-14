<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\StrategicValue;
use App\Models\BusinessCapability;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessCapability>
 */
class BusinessCapabilityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<BusinessCapability>
     */
    protected $model = BusinessCapability::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->slug(2),
            'description' => $this->faker->text(250),
            'strategic_value' => $this->faker->randomElement(StrategicValue::cases()),
        ];
    }

    /**
     * Configures the state of the factory to set the strategic value to commodity.
     *
     * @return Factory The modified factory instance with the applied state.
     */
    public function commodity(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'strategic_value' => StrategicValue::Commodity->value,
            ];
        });
    }

    /**
     * Configures the state of the factory to set the strategic value to competitive.
     *
     * @return Factory The modified factory instance with the applied state.
     */
    public function competitive(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'strategic_value' => StrategicValue::Competitive->value,
            ];
        });
    }

    /**
     * Configures the state of the factory to set the strategic value to core.
     *
     * @return Factory The modified factory instance with the applied state.
     */
    public function core(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'strategic_value' => StrategicValue::Core->value,
            ];
        });
    }

    /**
     * Configures the state of the factory to set the strategic value to differentiator.
     *
     * @return Factory The modified factory instance with the applied state.
     */
    public function differentiator(): Factory
    {
        return $this->state(function (array $attributes): array {
            return [
                'strategic_value' => StrategicValue::Differentiator->value,
            ];
        });
    }

    /**
     * Configures the state of the factory to set the strategic value to support.
     *
     * @return Factory The modified factory instance with the applied state.
     */
    public function support(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'strategic_value' => StrategicValue::Support->value,
            ];
        });
    }
}
