<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\System;
use Illuminate\Http\Request;

class SystemComponentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, System $system): ComponentResourceCollection
    {
        $components = $system->components()->paginate();

        return new ComponentResourceCollection($components);
    }
}
