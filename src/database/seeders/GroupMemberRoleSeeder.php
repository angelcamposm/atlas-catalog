<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GroupMemberRole;
use Illuminate\Database\Seeder;

final class GroupMemberRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/group_member_roles.php');

        collect($rows)->each(function ($item) {
            GroupMemberRole::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
