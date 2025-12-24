<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiRequest;
use App\Http\Requests\UpdateApiRequest;
use App\Http\Resources\ApiResource;
use App\Http\Resources\ApiResourceCollection;
use App\Models\Api;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with API resources.
     *
     * This constant is used by the AllowedRelationships trait to filter and validate
     * relationships requested via the 'with' query parameter. Only relationships listed
     * here can be included when fetching API resources to prevent unauthorized data exposure.
     *
     * Available relationships:
     * - accessPolicy: The access policy associated with the API
     * - authenticationMethod: The authentication method required for the API
     * - category: The category classification of the API
     * - components: Components that use or provide this API
     * - creator: The user who created the API
     * - deprecator: The user who deprecated the API (if applicable)
     * - status: The current status of the API (e.g., active, inactive)
     * - type: The type classification of the API (e.g., REST, SOAP, GraphQL)
     * - updater: The user who last updated the API
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'accessPolicy',
        'authenticationMethod',
        'category',
        'components',
        'creator',
        'deprecator',
        'status',
        'type',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return ApiResourceCollection
     */
    public function index(): ApiResourceCollection
    {
        return new ApiResourceCollection(Api::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiRequest $request
     *
     * @return ApiResource
     */
    public function store(StoreApiRequest $request): ApiResource
    {
        $model = Api::create($request->validated());

        return new ApiResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request  The incoming request.
     * @param  Api      $api
     *
     * @return ApiResource
     */
    public function show(Request $request, Api $api): ApiResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $api->load($allowedRelationships);
        }

        return new ApiResource($api);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiRequest $request
     * @param Api $api
     *
     * @return ApiResource
     */
    public function update(UpdateApiRequest $request, Api $api): ApiResource
    {
        $model = $api->update($request->validated());

        return new ApiResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Api $api
     *
     * @return Response
     */
    public function destroy(Api $api): Response
    {
        $api->delete();

        return response()->noContent();
    }
}
