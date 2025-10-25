<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Environment;
use Illuminate\Database\Seeder;

final class EnvironmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/environments.php');

        collect($rows)->each(function ($item) {
            Environment::updateOrCreate(
                ['name' => $item['name']],
                [
                    'abbr' => $item['abbr'],
                    'approval_required' => $item['approval_required'],
                    'description' => $item['description'],
                    'display_in_matrix' => $item['display_in_matrix'],
                    'sort_order' => $item['sort_order'],
                ],
            );
        });
    }
}
