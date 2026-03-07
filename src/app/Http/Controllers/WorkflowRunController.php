<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\WorkflowRunResource;
use App\Models\WorkflowRun;
use App\Http\Requests\StoreWorkflowRunRequest;
use App\Http\Requests\UpdateWorkflowRunRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WorkflowRunController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return WorkflowRunResource::collection(WorkflowRun::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkflowRunRequest $request): WorkflowRunResource
    {
        $model = WorkflowRun::create($request->validated());

        return new WorkflowRunResource($model);
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkflowRun $run): WorkflowRunResource
    {
        return new WorkflowRunResource($run);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkflowRunRequest $request, WorkflowRun $run): WorkflowRunResource
    {
        $run->update($request->validated());

        return new WorkflowRunResource($run);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkflowRun $run): Response
    {
        $run->delete();

        return response()->noContent();
    }
}
