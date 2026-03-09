<?php

use App\Providers\AppServiceProvider;
use App\Providers\HorizonServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\HorizonServiceProvider::class,
    Dedoc\Scramble\ScrambleServiceProvider::class,
];
