<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->run_base_seeders();
        $this->create_initial_user();
    }

    private function run_base_seeders(): void
    {
        if (app()->runningInConsole()) {
            $this->call([
                ApiStatusSeeder::class,
            ]);
        }
    }

    private function create_initial_user(): void
    {
        if (app()->runningInConsole()) {
            User::firstOrCreate(
                ['email' => 'admin@example.com'],
                [
                    'name' => 'Admin User',
                    'password' => bcrypt('password'),
                ],
            );
        }
    }
}
