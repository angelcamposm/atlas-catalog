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
        $components = $this->getComponentFactory();

        System::factory($this->option('quantity'))
            ->has($components, 'components')
            ->has(BusinessCapability::factory(), 'businessCapabilities')
            ->create();

        return self::SUCCESS;
    }

    private function getComponentFactory(): Factory
    {
        return Component::factory()
            ->count()
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
}
