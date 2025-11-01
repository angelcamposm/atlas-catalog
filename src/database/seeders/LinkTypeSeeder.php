<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LinkType;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class LinkTypeSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            LinkType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                ],
            );
        });
    }
}
