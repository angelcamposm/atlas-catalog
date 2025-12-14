<?php

namespace App\Console\Commands;

use App\Enums\DiscoverySource;
use App\Models\BusinessCapability;
use App\Models\Component;
use App\Models\System;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'atlas:generate-fake-data')]
class GenerateFakeDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'atlas:generate-fake-data
        { --Q|quantity=100 : How many records must be generated }
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
        $this->info('Generating fake data...');
        $this->create_clusters_fake_data();
        $this->create_groups_fake_data();
        $this->create_systems_fake_data();

        return self::SUCCESS;
    }

    private function getComponentFactory(): Factory
    {
        return Component::factory()
            ->count(1)
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
            ));
    }

    public function create_systems_fake_data(): void
    {
        $this->info('Creating fake data for systems domain...');

        $components = $this->getComponentFactory();

        System::factory($this->option('quantity'))
            ->has($components, 'components')
            ->has(BusinessCapability::factory(), 'businessCapabilities')
            ->create();
    }

    private function create_clusters_fake_data(): void
    {
        //TODO: implement this method
        $this->info('Creating fake data for clusters domain...');
    }

    private function create_groups_fake_data(): void
    {
        //TODO: implement this method
        $this->info('Creating fake data for groups domain...');
    }
}
