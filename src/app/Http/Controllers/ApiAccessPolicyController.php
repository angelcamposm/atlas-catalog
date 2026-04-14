<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ApiAccessPolicy;
use App\Http\Resources\ApiResourceCollection;
use App\Models\Api;
use App\Http\Resources\ApiAccessPolicyResource;
use App\Traits\DynamicIncludes;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAccessPolicyController extends Controller
{
    use DynamicIncludes;

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Since we are dealing with Enums, we can't use standard pagination or collection resources easily
        // without wrapping them.
        $items = ApiAccessPolicyResource::collection(collect(ApiAccessPolicy::cases()));

        return response()->json([
            'data' => $items,
            'kind' => 'Enum'
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  int      $policy
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function show(Request $request, int $policy): JsonResponse
    {
        $relationships = $this->getValidatedRelationships($request, ['api']);

        $fields = str_contains($relationships[0], ':')
            ? explode(':', $relationships[0])[1]
            : null;

        $apiAccessPolicy = ApiAccessPolicy::tryFrom($policy);

        if (!$apiAccessPolicy) {
            return response()->json([
                'error' => 'ApiAccessPolicy not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => new ApiAccessPolicyResource($apiAccessPolicy, $relationships, explode(',', $fields))->toArray($request),
            'kind' => 'Enum',
        ], Response::HTTP_OK);
    }

    /**
     * List APIs associated with an access policy.
     */
    public function apis(int $id): ApiResourceCollection|JsonResponse
    {
        $apiAccessPolicy = ApiAccessPolicy::tryFrom($id);

        if (! $apiAccessPolicy) {
            return response()->json([
                'error' => 'ApiAccessPolicy not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return new ApiResourceCollection(
            Api::query()
                ->where('access_policy', $apiAccessPolicy)
                ->paginate(),
        );
    }
}
