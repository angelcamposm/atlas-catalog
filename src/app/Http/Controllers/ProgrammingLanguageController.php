<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgrammingLanguageRequest;
use App\Http\Requests\UpdateProgrammingLanguageRequest;
use App\Http\Resources\ProgrammingLanguageResource;
use App\Http\Resources\ProgrammingLanguageResourceCollection;
use App\Models\ProgrammingLanguage;
use Illuminate\Http\Response;

class ProgrammingLanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ProgrammingLanguageResourceCollection
     */
    public function index(): ProgrammingLanguageResourceCollection
    {
        return new ProgrammingLanguageResourceCollection(ProgrammingLanguage::paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreProgrammingLanguageRequest $request
     *
     * @return ProgrammingLanguageResource
     */
    public function store(StoreProgrammingLanguageRequest $request): ProgrammingLanguageResource
    {
        $model = ProgrammingLanguage::create($request->validated());

        return new ProgrammingLanguageResource($model);
    }

    /**
     * Display the specified resource.
     *
     * @param ProgrammingLanguage $programmingLanguage
     *
     * @return ProgrammingLanguageResource
     */
    public function show(ProgrammingLanguage $programmingLanguage): ProgrammingLanguageResource
    {
        return new ProgrammingLanguageResource($programmingLanguage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateProgrammingLanguageRequest $request
     * @param ProgrammingLanguage $programmingLanguage
     *
     * @return ProgrammingLanguageResource
     */
    public function update(UpdateProgrammingLanguageRequest $request, ProgrammingLanguage $programmingLanguage): ProgrammingLanguageResource
    {
        $model = $programmingLanguage->update($request->validated());

        return new ProgrammingLanguageResource($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ProgrammingLanguage $programmingLanguage
     *
     * @return Response
     */
    public function destroy(ProgrammingLanguage $programmingLanguage): Response
    {
        $programmingLanguage->delete();

        return response()->noContent();
    }
}
