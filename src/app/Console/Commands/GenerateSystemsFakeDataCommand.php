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
use App\Models\Lifecycle;
use App\Models\Platform;
use App\Models\ServiceStatus;
use App\Models\System;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
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
        { --Q|quantity=10 : How many records must be generated }
        ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate fake data for testing purposes';

    /**
     * The console command help text.
     *
     * @var string
     */
    protected $help = 'Generate fake data for testing purposes';

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
        $this->info('Creating fake data for systems domain...');

        System::factory()
            ->count($this->option('quantity'))
            ->has(Component::factory()
                ->count(rand(1, 9))
                ->for(BusinessDomain::factory(), 'businessDomain')
                ->for(BusinessTier::factory(), 'tier')
                ->for(Lifecycle::factory(), 'lifecycle')
                ->for(Platform::factory(), 'platform')
                ->for(ServiceStatus::factory(), 'status')
                ->has(Entity::factory()
                    ->count(rand(1, 3))
                    ->has(EntityAttribute::factory()
                        ->count(rand(1, 3)),
                        'attributes'
                    ),
                    'entities'
                )
                ->hasAttached(Api::factory()
                    ->count(1),
                    ['relationship' => Relationship::ProvidesApi]
                )
                ->hasAttached(Api::factory()
                    ->count(rand(1, 5)),
                    ['relationship' => Relationship::ConsumesApi]
                )
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
                )),
                'components'
            )
            ->for(Group::factory(), 'owner')
            ->has(BusinessCapability::factory(), 'businessCapabilities')
            ->create();

        return self::SUCCESS;
    }
}
