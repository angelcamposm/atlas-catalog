<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\GroupMemberRole;
use App\Models\GroupType;
use App\Models\User;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'fake:groups')]
class GenerateGroupsFakeDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fake:groups
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
        $this->info('Creating fake data for groups domain...');

        $quantity = (int) $this->option('quantity');

        $progressBar = $this->output->createProgressBar($quantity);

        $progressBar->start();

        for ($i = 0; $i < $quantity; $i++) {

            Group::factory()
                ->count($quantity)
                ->for(GroupType::factory(), 'type')
                ->hasAttached(User::factory()
                    ->count(rand(1, 10)),
                    [
                        'is_active' => true,
                        'role_id' => GroupMemberRole::factory()->create()->id,
                    ],
                    'members'
                )
                ->create();

            $progressBar->advance();
        }

        $this->output->newLine();

        return self::SUCCESS;
    }
}
