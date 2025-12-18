<?php

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\BusinessDomain;
use Illuminate\Http\Request;

class BusinessDomainComponentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BusinessDomain $businessDomain): ComponentResourceCollection
    {
        $components = $businessDomain->components()->paginate();

        return new ComponentResourceCollection($components);
    }
}
