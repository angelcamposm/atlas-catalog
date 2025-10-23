<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreFrameworkRequest;
use App\Http\Requests\UpdateFrameworkRequest;
use App\Http\Resources\FrameworkResource;
use App\Http\Resources\FrameworkResourceCollection;
use App\Models\Framework;
use Illuminate\Http\Response;

class FrameworkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return FrameworkResourceCollection
     */
    public function index(): FrameworkResourceCollection
    {
        return new FrameworkResourceCollection(Framework::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreFrameworkRequest $request
     *
     * @return FrameworkResource
     */
    public function store(StoreFrameworkRequest $request): FrameworkResource
    {
        $model = Framework::create($request->validated());

        return new FrameworkResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Framework $framework
     *
     * @return FrameworkResource
     */
    public function show(Framework $framework): FrameworkResource
    {
        return new FrameworkResource($framework);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateFrameworkRequest $request
     * @param Framework $framework
     *
     * @return FrameworkResource
     */
    public function update(UpdateFrameworkRequest $request, Framework $framework): FrameworkResource
    {
        $model = $framework->update($request->validated());

        return new FrameworkResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Framework $framework
     *
     * @return Response
     */
    public function destroy(Framework $framework): Response
    {
        $framework->delete();

        return response()->noContent();
    }
}
