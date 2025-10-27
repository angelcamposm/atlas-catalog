<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePlatformRequest;
use App\Http\Requests\UpdatePlatformRequest;
use App\Http\Resources\PlatformResource;
use App\Http\Resources\PlatformResourceCollection;
use App\Models\Platform;
use Illuminate\Http\Response;

class PlatformController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return PlatformResourceCollection
     */
    public function index(): PlatformResourceCollection
    {
        return new PlatformResourceCollection(Platform::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StorePlatformRequest $request
     *
     * @return PlatformResource
     */
    public function store(StorePlatformRequest $request): PlatformResource
    {
        $model = Platform::create($request->validated());

        return new PlatformResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param Platform $platform
     *
     * @return PlatformResource
     */
    public function show(Platform $platform): PlatformResource
    {
        return new PlatformResource($platform);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdatePlatformRequest $request
     * @param Platform $platform
     *
     * @return PlatformResource
     */
    public function update(UpdatePlatformRequest $request, Platform $platform): PlatformResource
    {
        $model = $platform->update($request->validated());

        return new PlatformResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Platform $platform
     *
     * @return Response
     */
    public function destroy(Platform $platform): Response
    {
        $platform->delete();

        return response()->noContent();
    }
}
