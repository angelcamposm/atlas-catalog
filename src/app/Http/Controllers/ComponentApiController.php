<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ApiResourceCollection;
use App\Models\Component;
use Illuminate\Http\Request;

class ComponentApiController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Component $component): ApiResourceCollection
    {
        $apis = $component->apis()->paginate();

        return new ApiResourceCollection($apis);
    }
}
