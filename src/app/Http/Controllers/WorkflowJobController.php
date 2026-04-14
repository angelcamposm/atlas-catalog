<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\WorkflowJobResource;
use App\Models\WorkflowJob;
use App\Http\Requests\StoreWorkflowJobRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WorkflowJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return WorkflowJobResource::collection(WorkflowJob::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkflowJobRequest $request): WorkflowJobResource
    {
        $job = WorkflowJob::create($request->validated());

        return new WorkflowJobResource($job);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $workflow, WorkflowJob $job): WorkflowJobResource
    {
        return new WorkflowJobResource($job);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $workflow, WorkflowJob $job): Response
    {
        $job->delete();

        return response()->noContent();
    }
}
