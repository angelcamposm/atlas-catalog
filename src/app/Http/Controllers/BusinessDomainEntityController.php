<?php

namespace App\Http\Controllers;

use App\Http\Resources\EntityResourceCollection;
use App\Models\BusinessDomain;
use Illuminate\Http\Request;

class BusinessDomainEntityController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BusinessDomain $businessDomain): EntityResourceCollection
    {
        $components = $businessDomain->entities()->paginate();

        return new EntityResourceCollection($components);
    }
}
