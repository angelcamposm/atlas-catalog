<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplianceStandardRequest;
use App\Http\Requests\UpdateComplianceStandardRequest;
use App\Http\Resources\ComplianceStandardResource;
use App\Http\Resources\ComplianceStandardResourceCollection;
use App\Models\ComplianceStandard;
use Illuminate\Http\Response;

class ComplianceStandardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ComplianceStandardResourceCollection
     */
    public function index(): ComplianceStandardResourceCollection
    {
        return new ComplianceStandardResourceCollection(ComplianceStandard::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreComplianceStandardRequest $request
     *
     * @return ComplianceStandardResource
     */
    public function store(StoreComplianceStandardRequest $request): ComplianceStandardResource
    {
        $model = ComplianceStandard::create($request->validated());

        return new ComplianceStandardResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ComplianceStandard $complianceStandard
     *
     * @return ComplianceStandardResource
     */
    public function show(ComplianceStandard $complianceStandard): ComplianceStandardResource
    {
        return new ComplianceStandardResource($complianceStandard);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateComplianceStandardRequest $request
     * @param ComplianceStandard $complianceStandard
     *
     * @return ComplianceStandardResource
     */
    public function update(UpdateComplianceStandardRequest $request, ComplianceStandard $complianceStandard): ComplianceStandardResource
    {
        $model = $complianceStandard->update($request->validated());

        return new ComplianceStandardResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ComplianceStandard $complianceStandard
     *
     * @return Response
     */
    public function destroy(ComplianceStandard $complianceStandard): Response
    {
        $complianceStandard->delete();

        return response()->noContent();
    }
}
