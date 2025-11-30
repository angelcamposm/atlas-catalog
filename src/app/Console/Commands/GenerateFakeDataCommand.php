<?php

namespace App\Console\Commands;

use App\Models\Component;
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
        $this->generateComponents();

        return self::SUCCESS;
    }

    private function generateComponents(): void
    {
        //TODO: Expand this method to generate relationships, etc...

        Component::factory($this->option('quantity'))
            ->create();
    }
}
