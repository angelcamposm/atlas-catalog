<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use Illuminate\Database\Seeder;

final class FrameworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/frameworks.php');

        $languages = ProgrammingLanguage::all(['id', 'name'])->collect();

        collect($rows)->each(function ($item) use ($languages) {

            $language = $languages->where('name', $item['language_name'])->first();

            Framework::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                    'is_enabled' => $item['is_enabled'],
                    'language_id' => $language->id,
                    'url' => $item['url'],
                ],
            );
        });
    }
}
