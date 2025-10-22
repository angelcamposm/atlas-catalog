<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AuthenticationMethod;
use Illuminate\Database\Seeder;

final class AuthenticationMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/authentication_methods.php');

        collect($rows)->each(function ($item) {
            AuthenticationMethod::updateOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']],
            );
        });
    }
}
