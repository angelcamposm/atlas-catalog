<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LifecyclePhase;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class LifecyclePhaseSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            LifecyclePhase::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'color' => $item['color'],
                ],
            );
        });
    }
}
