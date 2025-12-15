<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EntityType;
use App\Models\EntityAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EntityAttribute>
 */
class EntityAttributeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<EntityAttribute>
     */
    protected $model = EntityAttribute::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->slug(3),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(EntityType::cases()),
        ];
    }

    /**
     * Configures the factory state to set the entity type to 'Array'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Array(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Array->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Boolean'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Boolean(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Boolean->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Date'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Date(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Date->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'DateTime'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function dateTime(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::DateTime->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Decimal'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function decimal(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Decimal->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Integer'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Integer(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Integer->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Object'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Object(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Object->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'String'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function String(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::String->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'Time'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function Time(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::Time->value
        ]);
    }

    /**
     * Configures the factory state to set the entity type to 'UUID'.
     *
     * @return Factory Returns the current factory instance with the updated state.
     */
    public function UUID(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => EntityType::UUID->value
        ]);
    }
}
