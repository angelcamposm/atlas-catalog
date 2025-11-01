<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreLinkTypeRequest;
use App\Http\Requests\UpdateLinkTypeRequest;
use App\Http\Resources\LinkTypeResource;
use App\Http\Resources\LinkTypeResourceCollection;
use App\Models\LinkType;
use Illuminate\Http\Response;

class LinkTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return LinkTypeResourceCollection
     */
    public function index(): LinkTypeResourceCollection
    {
        return new LinkTypeResourceCollection(LinkType::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreLinkTypeRequest $request
     *
     * @return LinkTypeResource
     */
    public function store(StoreLinkTypeRequest $request): LinkTypeResource
    {
        $model = LinkType::create($request->validated());

        return new LinkTypeResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param LinkType $linkType
     *
     * @return LinkTypeResource
     */
    public function show(LinkType $linkType): LinkTypeResource
    {
        return new LinkTypeResource($linkType);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateLinkTypeRequest $request
     * @param LinkType $linkType
     *
     * @return LinkTypeResource
     */
    public function update(UpdateLinkTypeRequest $request, LinkType $linkType): LinkTypeResource
    {
        $model = $linkType->update($request->validated());

        return new LinkTypeResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LinkType $linkType
     *
     * @return Response
     */
    public function destroy(LinkType $linkType): Response
    {
        $linkType->delete();

        return response()->noContent();
    }
}
