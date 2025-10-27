<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GroupMemberRole;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class GroupMemberRoleSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            GroupMemberRole::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
