<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\Api;
use Illuminate\Http\Request;

class ApiComponentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Api $api): ComponentResourceCollection
    {
        $components = $api->components()->paginate();

        return new ComponentResourceCollection($components);
    }
}
