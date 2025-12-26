<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReleaseArtifactRequest;
use App\Http\Requests\UpdateReleaseArtifactRequest;
use App\Http\Resources\ReleaseArtifactResource;
use App\Http\Resources\ReleaseArtifactResourceCollection;
use App\Models\ReleaseArtifact;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReleaseArtifactController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with ReleaseArtifact resources.
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'release',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return ReleaseArtifactResourceCollection
     */
    public function index(Request $request): ReleaseArtifactResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ReleaseArtifactResourceCollection(ReleaseArtifact::with($requestedRelationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreReleaseArtifactRequest $request
     *
     * @return ReleaseArtifactResource
     */
    public function store(StoreReleaseArtifactRequest $request): ReleaseArtifactResource
    {
        $model = ReleaseArtifact::create($request->validated());

        return new ReleaseArtifactResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param ReleaseArtifact $releaseArtifact
     *
     * @return ReleaseArtifactResource
     */
    public function show(Request $request, ReleaseArtifact $releaseArtifact): ReleaseArtifactResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $releaseArtifact->load($allowedRelationships);
        }

        return new ReleaseArtifactResource($releaseArtifact);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateReleaseArtifactRequest $request
     * @param ReleaseArtifact $releaseArtifact
     *
     * @return ReleaseArtifactResource
     */
    public function update(UpdateReleaseArtifactRequest $request, ReleaseArtifact $releaseArtifact): ReleaseArtifactResource
    {
        $model = $releaseArtifact->update($request->validated());

        return new ReleaseArtifactResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ReleaseArtifact $releaseArtifact
     *
     * @return Response
     */
    public function destroy(ReleaseArtifact $releaseArtifact): Response
    {
        $releaseArtifact->delete();

        return response()->noContent();
    }
}
