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

        $this->call('make:migration', ['name' => 'create_'.Str::snake($model).'_table','--create' => Str::plural($model)]);
        // Model
        $this->call('make:model', ['name' => $model]);
        // Controller
        $this->call('make:controller', ['name' => $model.'Controller','--api' => true, '--model' => $model]);
        // Form Requests
        $this->call('make:request', ['name' => 'Store'.$model.'Request']);
        $this->call('make:request', ['name' => 'Update'.$model.'Request']);
        // Resource
        $this->call('make:resource', ['name' => $model.'Resource']);
        // Observer
        $this->call('make:observer', ['name' => $model.'Observer','--model' => $model]);
        // Policy
        $this->call('make:policy', ['name' => $model.'Policy','--model' => $model]);

        if ($this->confirm('Do you want to create a seeder?', false)) {
            $this->call('make:seeder', ['name' => $model.'Seeder']);
        }

        if ($this->confirm('Do you want to create a factory?', false)) {
            $this->call('make:factory', ['name' => $model.'Factory', '--model' => $model]);
        }
    }
}
