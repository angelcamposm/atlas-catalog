<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\Entity;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class EntityComponentController extends Controller
{
    use AllowedRelationships;

    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'domain',
        'owner',
        'platform',
        'status',
        'tier',
        'updater',
    ];

    /**
     * List components associated with an entity.
     */
    public function __invoke(Request $request, Entity $entity): ComponentResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ComponentResourceCollection(
            $entity->components()->with($relationships)->paginate(),
        );
    }
}
