<?php

use App\Providers\AppServiceProvider;
use App\Providers\HorizonServiceProvider;
use Dedoc\Scramble\ScrambleServiceProvider;

return [
    AppServiceProvider::class,
    HorizonServiceProvider::class,
    ScrambleServiceProvider::class,
];
