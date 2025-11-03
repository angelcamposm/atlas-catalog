<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ComplianceStandard;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ComplianceStandardSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            ComplianceStandard::updateOrCreate(
                ['name' => $item['name']],
                [
                    'country_code' => $item['country'],
                    'description' => $item['description'],
                    'display_name' => $item['display_name'],
                    'focus_area' => $item['focus_area'],
                    'industry' => $item['industry'],
                    'url' => $item['url'],
                ],
            );
        });
    }
}
