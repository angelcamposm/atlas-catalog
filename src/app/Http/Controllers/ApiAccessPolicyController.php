<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiAccessPolicyRequest;
use App\Http\Requests\UpdateApiAccessPolicyRequest;
use App\Http\Resources\ApiAccessPolicyResource;
use App\Http\Resources\ApiAccessPolicyResourceCollection;
use App\Models\ApiAccessPolicy;
use Illuminate\Http\Response;

class ApiAccessPolicyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ApiAccessPolicyResourceCollection
     */
    public function index(): ApiAccessPolicyResourceCollection
    {
        return new ApiAccessPolicyResourceCollection(ApiAccessPolicy::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreApiAccessPolicyRequest $request
     *
     * @return ApiAccessPolicyResource
     */
    public function store(StoreApiAccessPolicyRequest $request): ApiAccessPolicyResource
    {
        $model = ApiAccessPolicy::create($request->validated());

        return new ApiAccessPolicyResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ApiAccessPolicy $access_policy
     *
     * @return ApiAccessPolicyResource
     */
    public function show(ApiAccessPolicy $access_policy): ApiAccessPolicyResource
    {
        return new ApiAccessPolicyResource($access_policy);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateApiAccessPolicyRequest $request
     * @param ApiAccessPolicy $access_policy
     *
     * @return ApiAccessPolicyResource
     */
    public function update(UpdateApiAccessPolicyRequest $request, ApiAccessPolicy $access_policy): ApiAccessPolicyResource
    {
        $model = $access_policy->update($request->validated());

        return new ApiAccessPolicyResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ApiAccessPolicy $access_policy
     *
     * @return Response
     */
    public function destroy(ApiAccessPolicy $access_policy): Response
    {
        $access_policy->delete();

        return response()->noContent();
    }
}
