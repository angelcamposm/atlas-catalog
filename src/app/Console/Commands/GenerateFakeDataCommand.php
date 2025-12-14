<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'atlas:generate-fake-data')]
class GenerateFakeDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'atlas:generate-fake-data';

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

        $this->call(GenerateClustersFakeDataCommand::class, ['--quantity' => 10]);
        $this->call(GenerateGroupsFakeDataCommand::class, ['--quantity' => 10]);
        $this->call(GenerateSystemsFakeDataCommand::class, ['--quantity' => 10]);

        return self::SUCCESS;
    }
}
