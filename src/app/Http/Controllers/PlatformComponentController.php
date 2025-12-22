<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\Platform;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

class PlatformComponentController extends Controller
{
    use AllowedRelationships;

    /**
     * List of relationships that can be eagerly loaded with component resources.
     *
     * This constant defines which component relationships are permitted to be
     * included in the API response through the 'with' query parameter.
     *
     * @var array<int, string>
     */
    public const array ALLOWED_RELATIONSHIPS = [
        'creator',
        'domain',
        'owner',
        'status',
        'tier',
        'updater',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Platform $platform): ComponentResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        $components = $platform->components()->with($relationships)->paginate();

        return new ComponentResourceCollection($components);
    }
}
