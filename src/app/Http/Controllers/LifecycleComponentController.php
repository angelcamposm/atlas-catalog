<?php

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\Lifecycle;
use Illuminate\Http\Request;

class LifecycleComponentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Lifecycle $lifecycle): ComponentResourceCollection
    {
        $components = $lifecycle->components()->paginate();

        return new ComponentResourceCollection($components);
    }
}
