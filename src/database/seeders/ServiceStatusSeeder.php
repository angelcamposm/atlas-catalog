<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ServiceStatus;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ServiceStatusSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            ServiceStatus::updateOrCreate(
                ['name' => $item['name']],
                [
                    'allow_deployments' => $item['allow_deployments'],
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                ],
            );
        });
    }
}
