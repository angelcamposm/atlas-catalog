<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ClusterType;
use App\Models\Vendor;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ClusterTypeSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = Vendor::all(['id', 'name']);

        collect(self::getRows())->each(function ($item) use ($vendors) {

            $vendor = $vendors->where('name', '=', $item['vendor'])->first();

            ClusterType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'icon' => $item['icon'],
                    'is_enabled' => $item['is_enabled'],
                    'vendor_id' => $vendor->id,
                ],
            );
        });
    }
}
