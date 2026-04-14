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
     * List all compliance standards with pagination.
     *
     * Retrieve a paginated list of compliance and regulatory standards (GDPR, HIPAA, PCI-DSS, ISO27001, etc.)
     * that your organization must adhere to.
     *
     * **Query Parameters:**
     * - `per_page=25` - Items per page (default: 15, max: 100)
     *
     * @operationId listComplianceStandards
     * @response 200 Successfully retrieved paginated list of compliance standards
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @return ComplianceStandardResourceCollection
     */
    public function index(): ComplianceStandardResourceCollection
    {
        return new ComplianceStandardResourceCollection(ComplianceStandard::paginate());
    }

    /**
     * Create a new compliance standard.
     *
     * Register a new compliance or regulatory standard (e.g., "GDPR", "HIPAA", "PCI-DSS", "ISO27001")
     * that affects your organization's systems and data.
     *
     * **Request Body:**
     * - `name` (required, string, 255 chars) - Standard name (e.g., "General Data Protection Regulation")
     * - `slug` (required, string, unique) - URL slug (e.g., "gdpr")
     * - `description` (optional, string) - Standard description and requirements summary
     *
     * @operationId createComplianceStandard
     * @response 201 Compliance standard created successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 422 Validation errors (duplicate slug)
     * @param StoreComplianceStandardRequest $request
     * @return ComplianceStandardResource
     */
    public function store(StoreComplianceStandardRequest $request): ComplianceStandardResource
    {
        $model = ComplianceStandard::create($request->validated());

        return new ComplianceStandardResource($model);
    }

    /**
     * Retrieve a specific compliance standard.
     *
     * Fetch detailed information about a single compliance standard.
     *
     * @operationId getComplianceStandard
     * @response 200 Compliance standard retrieved successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized
     * @response 404 Compliance standard not found
     * @param ComplianceStandard $compliance_standard
     * @return ComplianceStandardResource
     */
    public function show(ComplianceStandard $compliance_standard): ComplianceStandardResource
    {
        return new ComplianceStandardResource($compliance_standard);
    }

    /**
     * Update an existing compliance standard.
     *
     * Modify compliance standard properties like name or description.
     *
     * @operationId updateComplianceStandard
     * @response 200 Compliance standard updated successfully
     * @response 400 Validation failed
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 404 Compliance standard not found
     * @response 422 Validation errors
     * @param UpdateComplianceStandardRequest $request
     * @param ComplianceStandard $compliance_standard
     * @return ComplianceStandardResource
     */
    public function update(UpdateComplianceStandardRequest $request, ComplianceStandard $compliance_standard): ComplianceStandardResource
    {
        $model = tap($compliance_standard)->update($request->validated());

        return new ComplianceStandardResource($model);
    }

    /**
     * Delete a compliance standard.
     *
     * Remove a compliance standard from the system. This action is typically only valid if the standard
     * is no longer applicable to any systems or components.
     *
     * @operationId deleteComplianceStandard
     * @response 204 Compliance standard deleted successfully
     * @response 401 Unauthenticated
     * @response 403 Unauthorized - Insufficient permissions
     * @response 404 Compliance standard not found
     * @param ComplianceStandard $compliance_standard
     * @return Response
     */
    public function destroy(ComplianceStandard $compliance_standard): Response
    {
        $compliance_standard->delete();

        return response()->noContent();
    }
}
