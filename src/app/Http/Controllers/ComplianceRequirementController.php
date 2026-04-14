<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplianceRequirementRequest;
use App\Http\Requests\UpdateComplianceRequirementRequest;
use App\Http\Resources\ComplianceRequirementResource;
use App\Http\Resources\ComplianceRequirementResourceCollection;
use App\Models\ComplianceRequirement;
use Illuminate\Http\Response;

class ComplianceRequirementController extends Controller
{
    /**
     * List all compliance requirements with pagination.
     *
     * @operationId listComplianceRequirements
     * @return ComplianceRequirementResourceCollection
     */
    public function index(): ComplianceRequirementResourceCollection
    {
        return new ComplianceRequirementResourceCollection(ComplianceRequirement::paginate());
    }

    /**
     * Create a new compliance requirement.
     *
     * @operationId createComplianceRequirement
     * @param StoreComplianceRequirementRequest $request
     * @return ComplianceRequirementResource
     */
    public function store(StoreComplianceRequirementRequest $request): ComplianceRequirementResource
    {
        $model = ComplianceRequirement::create($request->validated());

        return new ComplianceRequirementResource($model);
    }

    /**
     * Retrieve a specific compliance requirement.
     *
     * @operationId getComplianceRequirement
     * @param ComplianceRequirement $compliance_requirement
     * @return ComplianceRequirementResource
     */
    public function show(ComplianceRequirement $compliance_requirement): ComplianceRequirementResource
    {
        return new ComplianceRequirementResource($compliance_requirement);
    }

    /**
     * Update an existing compliance requirement.
     *
     * @operationId updateComplianceRequirement
     * @param UpdateComplianceRequirementRequest $request
     * @param ComplianceRequirement $compliance_requirement
     * @return ComplianceRequirementResource
     */
    public function update(UpdateComplianceRequirementRequest $request, ComplianceRequirement $compliance_requirement): ComplianceRequirementResource
    {
        $model = tap($compliance_requirement)->update($request->validated());

        return new ComplianceRequirementResource($model);
    }

    /**
     * Delete a compliance requirement.
     *
     * @operationId deleteComplianceRequirement
     * @param ComplianceRequirement $compliance_requirement
     * @return Response
     */
    public function destroy(ComplianceRequirement $compliance_requirement): Response
    {
        $this->authorize('delete', $compliance_requirement);

        $compliance_requirement->delete();

        return response()->noContent();
    }
}
