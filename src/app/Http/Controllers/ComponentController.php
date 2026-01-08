<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComponentRequest;
use App\Http\Requests\UpdateComponentRequest;
use App\Http\Resources\ComponentResource;
use App\Http\Resources\ComponentResourceCollection;
use App\Models\Component;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ComponentController extends Controller
{
    use AllowedRelationships;

    /**
     * Defines the relationships that can be eager-loaded with Component resources.
     *
     * This constant is used by the AllowedRelationships trait to filter and validate
     * relationships requested via the 'with' query parameter. Only relationships listed
     * here can be included when fetching Component resources to prevent unauthorized data exposure.
     *
     * Available relationships:
     * - apis: APIs associated with this component
     * - creator: The user who created the component
     * - domain: The business domain of the component
     * - lifecyclePhases: The lifecycle phases of the component
     * - owner: The group that owns this component
     * - platform: The platform of the component
     * - status: The current status of the component
     * - systems: Systems that include this component
     * - tier: The business tier of the component
     * - updater: The user who last updated the component
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'apis',
        'creator',
        'domain',
        'lifecyclePhases',
        'owner',
        'platform',
        'status',
        'systems',
        'tier',
        'updater',
    ];
    /**
     * Display a listing of the resource.
     *
     * @return ComponentResourceCollection
     */
    public function index(): ComponentResourceCollection
    {
        return new ComponentResourceCollection(Component::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreComponentRequest $request
     *
     * @return ComponentResource
     */
    public function store(StoreComponentRequest $request): ComponentResource
    {
        $model = Component::create($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request The incoming request.
     * @param Component $component
     *
     * @return ComponentResource
     */
    public function show(Request $request, Component $component): ComponentResource
    {
        if ($request->has('with')) {
            $allowedRelationships = self::filterAllowedRelationships($request->get('with'));
            $component->load($allowedRelationships);
        }

        return new ComponentResource($component);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateComponentRequest $request
     * @param Component $component
     *
     * @return ComponentResource
     */
    public function update(UpdateComponentRequest $request, Component $component): ComponentResource
    {
        $model = $component->update($request->validated());

        return new ComponentResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Component $component
     *
     * @return Response
     */
    public function destroy(Component $component): Response
    {
        $component->delete();

        return response()->noContent();
    }
}
