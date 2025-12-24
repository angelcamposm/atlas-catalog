<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\LifecyclePhase;
use Illuminate\Http\Request;

class LifecyclePhaseComponentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, LifecyclePhase $lifecycle): ComponentResourceCollection
    {
        $components = $lifecycle->components()->paginate();

        return new ComponentResourceCollection($components);
    }
}
