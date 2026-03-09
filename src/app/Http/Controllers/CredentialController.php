<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCredentialRequest;
use App\Http\Requests\UpdateCredentialRequest;
use App\Http\Resources\CredentialResource;
use App\Http\Resources\CredentialResourceCollection;
use App\Models\Credential;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CredentialController extends Controller
{
    use AllowedRelationships;

    /**
     * List of allowed relationships that can be eagerly loaded for CredentialController resources.
     *
     * These relationships can be included in API responses by passing them via the 'with' query parameter.
     * Available relationships:
     * - creator: User who created the CredentialController
     * - updater: User who last updated the CredentialController
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
     * @return CredentialResourceCollection
     */
    public function index(Request $request): CredentialResourceCollection
    {
        $requestedRelationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new CredentialResourceCollection(Credential::with($requestedRelationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCredentialRequest $request
     *
     * @return CredentialResource
     */
    public function store(StoreCredentialRequest $request): CredentialResource
    {
        $model = Credential::create($request->validated());

        return new CredentialResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  Credential  $credential
     *
     * @return CredentialResource
     */
    public function show(Request $request, Credential $credential): CredentialResource
    {
        if ($request->has('with')) {
            $requestedRelationships = self::filterAllowedRelationships($request->get('with'));
            $credential->load($requestedRelationships);
        }

        return new CredentialResource($credential);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCredentialRequest $request
     * @param Credential $credential
     *
     * @return CredentialResource
     */
    public function update(UpdateCredentialRequest $request, Credential $credential): CredentialResource
    {
        $model = $credential->update($request->validated());

        return new CredentialResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Credential $credential
     *
     * @return Response
     */
    public function destroy(Credential $credential): Response
    {
        $credential->delete();

        return response()->noContent();
    }
}
