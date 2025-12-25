<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\DiscoverySource;
use App\Enums\Relationship;
use App\Models\Api;
use App\Models\BusinessCapability;
use App\Models\BusinessDomain;
use App\Models\BusinessTier;
use App\Models\Component;
use App\Models\Entity;
use App\Models\EntityAttribute;
use App\Models\Group;
use App\Models\Platform;
use App\Models\ServiceStatus;
use App\Models\System;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'fake:systems')]
class GenerateSystemsFakeDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fake:systems
        { --Q|quantity=10 : How many systems must be generated }
        ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate realistic fake data for systems, components, and their relationships';

    /**
     * Indicates whether the command should be shown in the Artisan command list.
     *
     * @var bool
     */
    protected $hidden = true;

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $quantity = (int) $this->option('quantity');
        $this->info("Creating fake data for $quantity systems...");

        // 1. Ensure we have a pool of reference data to share across systems
        // This prevents creating a unique BusinessDomain/Group/etc for every single component
        $domains = $this->getOrCreatePool(BusinessDomain::class, 5);
        $tiers = $this->getOrCreatePool(BusinessTier::class, 3);
        $platforms = $this->getOrCreatePool(Platform::class, 5);
        $statuses = $this->getOrCreatePool(ServiceStatus::class, 4);
        $groups = $this->getOrCreatePool(Group::class, 10);
        $capabilities = $this->getOrCreatePool(BusinessCapability::class, 10);

        $bar = $this->output->createProgressBar($quantity);
        $bar->start();

        $createdComponents = new Collection();

        for ($i = 0; $i < $quantity; $i++) {

            /** @var System $system */
            $system = System::factory()
                ->for($groups->random(), 'owner')
                ->hasAttached($capabilities->random(rand(1, 3)), [], 'businessCapabilities')
                ->create();

            // Create Components for this System
            $components = Component::factory()
                ->count(rand(1, 5))
                ->hasAttached($system) // Associate with the system via Many-to-Many
                ->for($domains->random(), 'domain') // Correct relationship name from model: businessDomain
                ->for($tiers->random(), 'tier')
                ->for($platforms->random(), 'platform')
                ->for($statuses->random(), 'status')
                ->for($groups->random(), 'owner') // Components might be owned by different teams than the system
                ->has(Entity::factory()
                    ->count(rand(0, 3))
                    ->has(EntityAttribute::factory()->count(rand(1, 5)), 'attributes'),
                    'entities'
                )
                // Create APIs provided by this component
                ->hasAttached(Api::factory()->count(rand(0, 2)), ['relationship' => Relationship::ProvidesApi])
                ->state(new Sequence(
                    ['discovery_source' => DiscoverySource::Manual],
                    ['discovery_source' => DiscoverySource::Pipeline],
                    ['discovery_source' => DiscoverySource::Scan],
                ))
                ->state(new Sequence(
                    ['is_stateless' => true],
                    ['is_stateless' => false],
                ))
                ->state(new Sequence(
                    ['is_exposed' => true],
                    ['is_exposed' => false],
                ))
                ->create();

            $createdComponents = $createdComponents->merge($components);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        // 2. Interlink Components (ConsumesApi)
        // Now that we have a pool of components with APIs, let's make them consume each other's APIs
        $this->info('Linking components to consume existing APIs...');

        // Get all APIs that were just created (or exist)
        $availableApis = Api::inRandomOrder()->limit(50)->get();

        if ($availableApis->isNotEmpty()) {
            $createdComponents->each(function (Component $component) use ($availableApis) {
                // 50% chance a component consumes APIs
                if (rand(0, 1)) {
                    $apisToConsume = $availableApis->random(rand(1, min(3, $availableApis->count())));

                    // Filter out APIs provided by this component itself (optional, but realistic)
                    // For simplicity, we'll just attach.
                    $component->apis()->attach($apisToConsume, ['relationship' => Relationship::ConsumesApi]);
                }
            });
        }

        $this->info('Done!');

        return self::SUCCESS;
    }

    /**
     * Get existing records or create a pool of them if few exist.
     *
     * @param class-string<Model>  $modelClass
     * @param int                  $count
     *
     * @return Collection
     */
    private function getOrCreatePool(string $modelClass, int $count): Collection
    {
        $existing = $modelClass::inRandomOrder()->limit($count)->get();

        if ($existing->count() < $count) {
            $needed = $count - $existing->count();
            $new = $modelClass::factory()->count($needed)->create();
            $existing = $existing->merge($new);
        }

        return $existing;
    }
}
