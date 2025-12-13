<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\WorkflowRun;
use App\Http\Requests\StoreWorkflowRunRequest;
use App\Http\Requests\UpdateWorkflowRunRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

class WorkflowRunController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return WorkflowRun::paginate()->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkflowRunRequest $request): JsonResource
    {
        $model = WorkflowRun::create($request->validated());

        return $model->toResource();
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkflowRun $workflowRun): JsonResource
    {
        return $workflowRun->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkflowRunRequest $request, WorkflowRun $workflowRun): JsonResource
    {
        $workflowRun->update($request->validated());

        return $workflowRun->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkflowRun $workflowRun): Response
    {
        $workflowRun->delete();

        return response()->noContent();
    }
}
