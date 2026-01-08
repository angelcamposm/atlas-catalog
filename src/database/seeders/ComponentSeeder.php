<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Component;
use App\Models\Group;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ComponentSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get default group to assign as owner
        $defaultGroup = Group::first();

        collect(self::getRows())->each(function ($item) use ($defaultGroup) {
            // Get or create owner group
            $owner = Group::where('name', 'Engineering')
                ->orWhere('id', $defaultGroup?->id)
                ->first();

            Component::updateOrCreate(
                ['name' => $item['name']],
                [
                    'display_name' => $item['display_name'],
                    'description' => $item['description'],
                    'is_stateless' => $item['is_stateless'],
                    'owner_id' => $owner?->id,
                    'slug' => $item['name'],
                    'tags' => $item['tags'],
                ],
            );
        });
    }
}
