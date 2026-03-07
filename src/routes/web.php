<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Scramble Documentation Routes
include_once __DIR__.'/../vendor/dedoc/scramble/routes/web.php';
