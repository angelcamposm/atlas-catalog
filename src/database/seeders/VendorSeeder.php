<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Vendor;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class VendorSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            Vendor::updateOrCreate(
                ['name' => $item['name']],
                [
                    'icon' => $item['icon'],
                    'url' => $item['url'],
                ],
            );
        });
    }
}
