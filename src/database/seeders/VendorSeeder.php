<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

final class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/vendors.php');

        collect($rows)->each(function ($item) {
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
