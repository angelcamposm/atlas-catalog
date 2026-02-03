<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ApiAccessPolicy;
use App\Http\Resources\ApiAccessPolicyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAccessPolicyController extends Controller
{
    /**
     * Display a listing of the resource.
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
     */
    public function show(Request $request, int $policy): JsonResponse
    {
        $apiAccessPolicy = ApiAccessPolicy::tryFrom($policy);

        if (!$apiAccessPolicy) {
            return response()->json([
                'error' => 'ApiAccessPolicy not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => new ApiAccessPolicyResource($apiAccessPolicy),
            'kind' => 'Enum',
        ], Response::HTTP_OK);
    }
}
