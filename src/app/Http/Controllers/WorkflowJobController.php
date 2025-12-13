<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\WorkflowJob;
use App\Http\Requests\StoreWorkflowJobRequest;
use App\Http\Requests\UpdateWorkflowJobRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

class WorkflowJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return WorkflowJob::paginate()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkflowJobRequest $request): JsonResource
    {
        $model = WorkflowJob::create($request->validated());

        return $model->toResource();
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkflowJob $workflowJob): JsonResource
    {
        return $workflowJob->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkflowJobRequest $request, WorkflowJob $workflowJob): JsonResource
    {
        $workflowJob->update($request->validated());

        return $workflowJob->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkflowJob $workflowJob): Response
    {
        $workflowJob->delete();

        return response()->noContent();
    }
}
