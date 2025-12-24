<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\WorkflowRunCommitResource;
use App\Http\Resources\WorkflowRunCommitResourceCollection;
use App\Models\WorkflowRunCommit;
use Illuminate\Http\Request;

class WorkflowRunCommitController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return WorkflowRunCommitResourceCollection
     */
    public function index(): WorkflowRunCommitResourceCollection
    {
        return new WorkflowRunCommitResourceCollection(WorkflowRunCommit::paginate());
    }

    /**
     * Display the specified resource.
     *
     * @param WorkflowRunCommit $commit
     *
     * @return WorkflowRunCommitResource
     */
    public function show(WorkflowRunCommit $commit): WorkflowRunCommitResource
    {
        return new WorkflowRunCommitResource($commit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCategoryRequest $request
     *
     * @return WorkflowRunCommitResource
     */
    public function store(Request $request): WorkflowRunCommitResource
    {
        $model = WorkflowRunCommit::create($request->validated());

        return new WorkflowRunCommitResource($model);
    }
}
