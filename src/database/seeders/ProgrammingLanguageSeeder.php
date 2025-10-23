<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ProgrammingLanguage;
use Illuminate\Database\Seeder;

final class ProgrammingLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/programming_languages.php');

        collect($rows)->each(function ($item) {
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
