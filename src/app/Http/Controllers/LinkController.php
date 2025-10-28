<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLinkRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Http\Resources\LinkResource;
use App\Http\Resources\LinkResourceCollection;
use App\Models\Link;
use Illuminate\Http\Response;

class LinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return LinkResourceCollection
     */
    public function index(): LinkResourceCollection
    {
        return new LinkResourceCollection(Link::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLinkRequest $request
     *
     * @return LinkResource
     */
    public function store(StoreLinkRequest $request): LinkResource
    {
        $model = Link::create($request->validated());

        return new LinkResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Link $link
     *
     * @return LinkResource
     */
    public function show(Link $link): LinkResource
    {
        return new LinkResource($link);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLinkRequest $request
     * @param Link $link
     *
     * @return LinkResource
     */
    public function update(UpdateLinkRequest $request, Link $link): LinkResource
    {
        $model = $link->update($request->validated());

        return new LinkResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Link $link
     *
     * @return Response
     */
    public function destroy(Link $link): Response
    {
        $link->delete();

        return response()->noContent();
    }
}
