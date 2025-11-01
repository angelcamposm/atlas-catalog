<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GroupType;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class GroupTypeSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            GroupType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
