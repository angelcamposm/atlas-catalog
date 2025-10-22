<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Lifecycle;
use Illuminate\Database\Seeder;

final class LifecycleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/lifecycles.php');

        collect($rows)->each(function ($item) {
            Lifecycle::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'color' => $item['color'],
                ],
            );
        });
    }
}
