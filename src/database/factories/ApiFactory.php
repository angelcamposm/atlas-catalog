<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Api;
use App\Models\ApiAccessPolicy;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Api>
 */
class ApiFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<TModel>
     */
    protected $model = Api::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $adjectives = ['Fast', 'Secure', 'Modern', 'Cloud', 'Smart', 'Advanced', 'Dynamic', 'Real-time', 'Mobile', 'Enterprise'];
        $services = ['Payment', 'Auth', 'Data', 'Analytics', 'Notification', 'Storage', 'Search', 'Report', 'Social', 'Integration'];
        
        $name = $adjectives[array_rand($adjectives)] . ' ' . $services[array_rand($services)] . ' API';
        
        return [
            'name' => $name,
            'description' => 'API for ' . strtolower($name) . ' services',
            'access_policy_id' => ApiAccessPolicy::inRandomOrder()->first()->id,
            'authentication_method_id' => AuthenticationMethod::inRandomOrder()->first()->id,
            'protocol' => 'http',
            'document_specification' => json_encode([
                'title' => $name,
                'description' => 'Documentation for ' . $name,
                'version' => '1.0.0',
            ]),
            'status_id' => ApiStatus::inRandomOrder()->first()->id,
            'type_id' => ApiType::inRandomOrder()->first()->id,
            'url' => 'https://api.example.com/' . strtolower(str_replace(' ', '-', $name)),
            'version' => '1.0.' . rand(0, 99),
        ];
    }
}
