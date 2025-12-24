<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ApiAccessPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class ApiAccessPolicyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $items = [];

        foreach (ApiAccessPolicy::cases() as $apiAccessPolicy) {
            $items[] = [
                'id' => $apiAccessPolicy->value,
                'name' => $apiAccessPolicy->name,
                'display_name' => $apiAccessPolicy->displayName(),
                'description' => $apiAccessPolicy->description(),
            ];
        }

        return response()->json([
            'data' => $items,
            'kind' => 'Enum'
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  int      $id
     *
     * @return JsonResource|JsonResponse
     */
    public function show(Request $request, int $id): JsonResource|JsonResponse
    {
        $apiAccessPolicy = ApiAccessPolicy::tryFrom($id);

        if (!$apiAccessPolicy) {
            return response()->json([
                'error' => 'ApiAccessPolicy not found',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => [
                'id' => $apiAccessPolicy->value,
                'name' => $apiAccessPolicy->name,
                'display_name' => $apiAccessPolicy->displayName(),
                'description' => $apiAccessPolicy->description(),
            ],
            'kind' => 'Enum',
        ], Response::HTTP_OK);
    }
}
