<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GroupType;
use Illuminate\Database\Seeder;

final class GroupTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/group_types.php');

        collect($rows)->each(function ($item) {
            GroupType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
