<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateResourcesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $model = $this->ask('Model name?');

        if ($model == Str::singular($model)) {
            $model = Str::singular($model);
        }

        $arguments = ['name' => $model];

        // Controller
        $arguments['--controller'] = true;
        $arguments['--api'] = true;
        $arguments['--requests'] = true;

        // Database
        $arguments['--migration'] = true;

        if ($this->confirm('Do you want to create a seeder?', false)) {
            $arguments['--seed'] = true;
        }

        if ($this->confirm('Do you want to create a factory?', false)) {
            $arguments['--factory'] = true;
        }

        $arguments['--policy'] = true;

        $this->call('make:model', $arguments);

        // Resource
        $this->call('make:resource', ['name' => $model.'Resource']);
        $this->call('make:resource', ['name' => $model.'ResourceCollection', '--collection' => true]);

        // Observer
        $this->call('make:observer', ['name' => $model.'Observer','--model' => $model]);
    }
}
