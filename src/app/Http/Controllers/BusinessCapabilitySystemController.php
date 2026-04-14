<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessCapabilitySystemRequest;
use App\Http\Requests\UpdateBusinessCapabilitySystemRequest;
use App\Http\Resources\BusinessCapabilitySystemResource;
use App\Http\Resources\BusinessCapabilitySystemResourceCollection;
use App\Http\Resources\SystemResourceCollection;
use App\Models\BusinessCapability;
use App\Models\BusinessCapabilitySystem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BusinessCapabilitySystemController extends Controller
{
    /**
     * List systems for a given business capability.
     */
    public function __invoke(Request $request, BusinessCapability $business_capability): SystemResourceCollection
    {
        $systems = $business_capability->systems()->paginate();

        return new SystemResourceCollection($systems);
    }

    public function index(): BusinessCapabilitySystemResourceCollection
    {
        return new BusinessCapabilitySystemResourceCollection(
            BusinessCapabilitySystem::paginate()
        );
    }

    public function store(StoreBusinessCapabilitySystemRequest $request): \Illuminate\Http\JsonResponse
    {
        $item = BusinessCapabilitySystem::create($request->validated());

        return (new BusinessCapabilitySystemResource($item))->response()->setStatusCode(201);
    }

    public function show(BusinessCapabilitySystem $business_capability_system): BusinessCapabilitySystemResource
    {
        return new BusinessCapabilitySystemResource($business_capability_system);
    }

    public function update(UpdateBusinessCapabilitySystemRequest $request, BusinessCapabilitySystem $business_capability_system): BusinessCapabilitySystemResource
    {
        tap($business_capability_system)->update($request->validated());

        return new BusinessCapabilitySystemResource($business_capability_system);
    }

    public function destroy(BusinessCapabilitySystem $business_capability_system): Response
    {
        $this->authorize('delete', $business_capability_system);

        $business_capability_system->delete();

        return response()->noContent();
    }
}
