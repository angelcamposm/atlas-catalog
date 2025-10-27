<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class FrameworkSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = ProgrammingLanguage::all(['id', 'name'])->collect();

        collect(self::getRows())->each(function ($item) use ($languages) {

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
