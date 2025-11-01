<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ProgrammingLanguage;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ProgrammingLanguageSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            ProgrammingLanguage::updateOrCreate(
                ['name' => $item['name']],
                [
                    'icon' => $item['icon'],
                    'is_enabled' => $item['is_enabled'],
                    'url' => $item['url'],
                ],
            );
        });
    }
}
