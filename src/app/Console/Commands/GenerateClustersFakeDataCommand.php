<?php

namespace App\Console\Commands;

use App\Enums\NodeRole;
use App\Models\Cluster;
use App\Models\ClusterType;
use App\Models\InfrastructureType;
use App\Models\LifecyclePhase;
use App\Models\Node;
use App\Models\ServiceAccount;
use App\Models\ServiceAccountToken;
use App\Models\Vendor;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'fake:clusters')]
class GenerateClustersFakeDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fake:clusters
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
        $this->info('Creating fake data for clusters domain...');

        $quantity = $this->option('quantity');

        $progressBar = $this->output->createProgressBar($quantity);

        $progressBar->start();

        for ($i = 0; $i < $quantity; $i++) {

            $master_nodes = $this->getNodeFactory(fake()->numberBetween(2, 5));
            $worker_nodes = $this->getNodeFactory(fake()->numberBetween(3, 20));

            $service_account = $this->getServiceAccountFactory(rand(1, 3));

            Cluster::factory()
                ->count(1)
                ->for(
                    factory: ClusterType::factory()
                        ->state(new Sequence(
                            ['is_enabled' => true],
                            ['is_enabled' => false],
                        ))
                        ->for(Vendor::factory()),
                    relationship: 'type'
                )
                ->for(InfrastructureType::factory(), 'infrastructureType')
                ->for(LifecyclePhase::factory(), 'lifecycle')
                ->has($service_account, 'serviceAccounts')
                ->hasAttached($worker_nodes, ['role' => NodeRole::Worker], 'nodes')
                ->hasAttached($master_nodes, ['role' => NodeRole::Master], 'nodes')
                ->create();

            $progressBar->advance();
        }

        $this->output->newLine();

        return self::SUCCESS;
    }

    /**
     * Creates and returns a Node factory instance with a defined quantity and state.
     *
     * @param  int  $quantity  The number of Node instances to create. Defaults to 3.
     *
     * @return Factory The configured Node factory instance.
     */
    private function getNodeFactory(int $quantity = 3): Factory
    {
        return Node::factory()
            ->count($quantity)
            ->state([
                'os_version' => fake()->semver()
            ]);
    }

    /**
     * Creates and returns a ServiceAccount factory instance with a specified quantity and associated tokens.
     *
     * @param  int  $quantity  The number of ServiceAccount instances to create. Defaults to 1.
     *
     * @return Factory The configured ServiceAccount factory instance.
     */
    private function getServiceAccountFactory(int $quantity = 1): Factory
    {
        $tokens = ServiceAccountToken::factory()->count(1);

        return ServiceAccount::factory()
            ->count($quantity)
            ->has($tokens, 'tokens');
    }
}
