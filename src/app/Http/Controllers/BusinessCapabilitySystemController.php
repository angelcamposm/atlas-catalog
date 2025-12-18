<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\BusinessCapabilityResourceCollection;
use App\Models\BusinessCapability;
use Illuminate\Http\Request;

class BusinessCapabilitySystemController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BusinessCapability $businessCapability): BusinessCapabilityResourceCollection
    {
        $components = $businessCapability->systems()->paginate();

        return new BusinessCapabilityResourceCollection($components);
    }
}
