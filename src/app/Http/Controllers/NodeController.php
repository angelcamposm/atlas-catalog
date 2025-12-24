<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreNodeRequest;
use App\Http\Requests\UpdateNodeRequest;
use App\Http\Resources\NodeResource;
use App\Http\Resources\NodeResourceCollection;
use App\Models\Node;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NodeController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'cluster',
        'creator',
        'updater',
    ];

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     *
     * @return NodeResourceCollection
     */
    public function index(Request $request): NodeResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new NodeResourceCollection(Node::with($relationships)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreNodeRequest $request
     *
     * @return NodeResource
     */
    public function store(StoreNodeRequest $request): NodeResource
    {
        $model = Node::create($request->validated());

        return new NodeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  Node     $node
     *
     * @return NodeResource
     */
    public function show(Request $request, Node $node): NodeResource
    {
        if ($request->has('with')) {
            $requestedRelationships = $request->get('with');
            $node->load(self::filterAllowedRelationships($requestedRelationships));
        }

        return new NodeResource($node);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateNodeRequest $request
     * @param Node $node
     *
     * @return NodeResource
     */
    public function update(UpdateNodeRequest $request, Node $node): NodeResource
    {
        $model = $node->update($request->validated());

        return new NodeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Node $node
     *
     * @return Response
     */
    public function destroy(Node $node): Response
    {
        $node->delete();

        return response()->noContent();
    }
}
