<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ComponentResourceCollection;
use App\Models\Framework;
use App\Traits\AllowedRelationships;
use Illuminate\Http\Request;

/**
 * Handle GET requests for components related to a specific Framework.
 * 
 * This is an invokable controller that returns all components associated with a framework.
 */
class FrameworkComponentController extends Controller
{
    use AllowedRelationships;

    /**
     * Allowed relationships that can be eagerly loaded.
     */
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
     * Get all components for a given framework.
     *
     * @param Request $request
     * @param Framework $framework
     * @return ComponentResourceCollection
     */
    public function __invoke(Request $request, Framework $framework): ComponentResourceCollection
    {
        $relationships = $request->has('with')
            ? self::filterAllowedRelationships($request->get('with'))
            : [];

        return new ComponentResourceCollection(
            $framework->components()->with($relationships)->paginate(),
        );
    }
}
