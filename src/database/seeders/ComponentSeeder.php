<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessDomain;
use App\Models\BusinessTier;
use App\Models\Component;
use App\Models\Group;
use App\Models\LifecyclePhase;
use App\Models\Platform;
use App\Models\ServiceStatus;
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

        // Get related data for assignment
        $platforms = Platform::pluck('id')->toArray();
        $tiers = BusinessTier::pluck('id')->toArray();
        $domains = BusinessDomain::pluck('id')->toArray();
        $lifecycles = LifecyclePhase::pluck('id')->toArray();
        $statuses = ServiceStatus::pluck('id')->toArray();

        collect(self::getRows())->each(function ($item, $index) use ($defaultGroup, $platforms, $tiers, $domains, $lifecycles, $statuses) {
            // Get or create owner group
            $owner = Group::where('name', 'Engineering')
                ->orWhere('id', $defaultGroup?->id)
                ->first();

            // Assign relations based on index to distribute variety
            $platformId = ! empty($platforms) ? $platforms[$index % count($platforms)] : null;
            $tierId = ! empty($tiers) ? $tiers[$index % count($tiers)] : null;
            $domainId = ! empty($domains) ? $domains[$index % count($domains)] : null;
            $lifecycleId = ! empty($lifecycles) ? $lifecycles[$index % count($lifecycles)] : null;
            $statusId = ! empty($statuses) ? $statuses[$index % count($statuses)] : null;

            Component::updateOrCreate(
                ['name' => $item['name']],
                [
                    'display_name' => $item['display_name'],
                    'description' => $item['description'],
                    'is_stateless' => $item['is_stateless'],
                    'owner_id' => $owner?->id,
                    'slug' => $item['name'],
                    'tags' => $item['tags'],
                    // Assign relations
                    'platform_id' => $platformId,
                    'tier_id' => $tierId,
                    'domain_id' => $domainId,
                    'lifecycle_id' => $lifecycleId,
                    'status_id' => $statusId,
                ],
            );
        });
    }
}
