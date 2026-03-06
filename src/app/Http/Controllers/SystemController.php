<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreSystemRequest;
use App\Http\Requests\UpdateSystemRequest;
use App\Http\Resources\SystemResource;
use App\Http\Resources\SystemResourceCollection;
use App\Models\System;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SystemController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'components',
        'businessCapabilities',
        'owner',
        'creator',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * Supports filtering, searching, and sorting via query parameters:
     * - ?filter[field]=value - Filter by field value
     * - ?search=term - Search across searchable fields
     * - ?sort=field or ?sort=-field - Sort ascending or descending
     * - ?with=relation1,relation2 - Eager load relationships
     *
     * @return SystemResourceCollection
     */
    public function index(Request $request): SystemResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new SystemResourceCollection(
            System::query()
                ->filter($request)
                ->search($request)
                ->sort($request)
                ->with($relationships)
                ->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreSystemRequest $request
     *
     * @return SystemResource
     */
    public function store(StoreSystemRequest $request): SystemResource
    {
        $model = System::create($request->validated());

        return new SystemResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param System $system
     *
     * @return SystemResource
     */
    public function show(System $system): SystemResource
    {
        return new SystemResource($system);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateSystemRequest $request
     * @param System $system
     *
     * @return SystemResource
     */
    public function update(UpdateSystemRequest $request, System $system): SystemResource
    {
        $model = $system->update($request->validated());

        return new SystemResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param System $system
     *
     * @return Response
     */
    public function destroy(System $system): Response
    {
        $system->delete();

        return response()->noContent();
    }
}
