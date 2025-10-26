<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ClusterType;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

final class ClusterTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/cluster_types.php');

        $vendors = Vendor::all(['id', 'name']);

        collect($rows)->each(function ($item) use ($vendors) {

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
