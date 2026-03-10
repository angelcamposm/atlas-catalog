<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessCapabilitySystemRequest;
use App\Http\Requests\UpdateBusinessCapabilitySystemRequest;
use App\Http\Resources\BusinessCapabilitySystemResource;
use App\Http\Resources\BusinessCapabilitySystemResourceCollection;
use App\Models\BusinessCapabilitySystem;
use Illuminate\Http\Response;

class BusinessCapabilitySystemController extends Controller
{
    public function index(): BusinessCapabilitySystemResourceCollection
    {
        return new BusinessCapabilitySystemResourceCollection(
            BusinessCapabilitySystem::paginate()
        );
    }

    public function store(StoreBusinessCapabilitySystemRequest $request): BusinessCapabilitySystemResource
    {
        $item = BusinessCapabilitySystem::create($request->validated());

        return (new BusinessCapabilitySystemResource($item))->response()->setStatusCode(201);
    }

    public function show(BusinessCapabilitySystem $businessCapabilitySystem): BusinessCapabilitySystemResource
    {
        return new BusinessCapabilitySystemResource($businessCapabilitySystem);
    }

    public function update(UpdateBusinessCapabilitySystemRequest $request, BusinessCapabilitySystem $businessCapabilitySystem): BusinessCapabilitySystemResource
    {
        tap($businessCapabilitySystem)->update($request->validated());

        return new BusinessCapabilitySystemResource($businessCapabilitySystem);
    }

    public function destroy(BusinessCapabilitySystem $businessCapabilitySystem): Response
    {
        $businessCapabilitySystem->delete();

        return response()->noContent();
    }
}
