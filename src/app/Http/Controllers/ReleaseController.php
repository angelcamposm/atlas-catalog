<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReleaseRequest;
use App\Http\Requests\UpdateReleaseRequest;
use App\Http\Resources\ReleaseResource;
use App\Http\Resources\ReleaseResourceCollection;
use App\Models\Release;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReleaseController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with Release resources.
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'artifacts',
        'component',
        'creator',
        'updater',
        'workflowRun',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return ReleaseResourceCollection
     */
    public function index(): ReleaseResourceCollection
    {
        return new ReleaseResourceCollection(Release::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreReleaseRequest $request
     *
     * @return ReleaseResource
     */
    public function store(StoreReleaseRequest $request): ReleaseResource
    {
        $model = Release::create($request->validated());

        return new ReleaseResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param Release $release
     *
     * @return ReleaseResource
     */
    public function show(Request $request, Release $release): ReleaseResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $release->load($allowedRelationships);
        }

        return new ReleaseResource($release);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateReleaseRequest $request
     * @param Release $release
     *
     * @return ReleaseResource
     */
    public function update(UpdateReleaseRequest $request, Release $release): ReleaseResource
    {
        $model = $release->update($request->validated());

        return new ReleaseResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Release $release
     *
     * @return Response
     */
    public function destroy(Release $release): Response
    {
        $release->delete();

        return response()->noContent();
    }
}
