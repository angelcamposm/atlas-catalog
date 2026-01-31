<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\CiServerResource;
use App\Http\Resources\CiServerResourceCollection;
use App\Models\CiServer;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CiServerController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for CiServerController resources.
     *
     * These relationships can be included in API responses by passing them via the 'with' query parameter.
     * Available relationships:
     * - creator: User who created the CiServerController
     * - updater: User who last updated the CiServerController
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return CiServerResourceCollection
     */
    public function index(Request $request): CiServerResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new CiServerResourceCollection(CiServer::with($requestedRelationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return CiServerResource
     */
    public function store(Request $request): CiServerResource
    {
        $model = CiServer::create($request->validated());

        return new CiServerResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  CiServer  $ciServer
     *
     * @return CiServerResource
     */
    public function show(Request $request, CiServer $ciServer): CiServerResource
    {
        if ($request->has('with')) {
            $requestedRelationships = self::filterAllowedRelationships($request->get('with'));
            $ciServer->load($requestedRelationships);
        }

        return new CiServerResource($ciServer);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param CiServer $ciServer
     *
     * @return CiServerResource
     */
    public function update(Request $request, CiServer $ciServer): CiServerResource
    {
        $model = $ciServer->update($request->validated());

        return new CiServerResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param CiServer $ciServer
     *
     * @return Response
     */
    public function destroy(CiServer $ciServer): Response
    {
        $ciServer->delete();

        return response()->noContent();
    }
}
