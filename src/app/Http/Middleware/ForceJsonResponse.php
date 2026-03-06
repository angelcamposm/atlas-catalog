<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force JSON responses for all API requests.
 *
 * This middleware ensures that even Laravel error responses (404, 500, etc.)
 * are returned as JSON instead of HTML, for consistency with API contracts.
 */
class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force Accept header to application/json for API requests
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        // Ensure response is JSON if not already
        if (!($response instanceof JsonResponse) && $response->headers->get('content-type') === 'text/html; charset=UTF-8') {
            return new JsonResponse(
                $this->parseHtmlContentAsJson($response),
                $response->status(),
                $response->headers->all()
            );
        }

        return $response;
    }

    /**
     * Parse HTML content to JSON (for error pages).
     */
    private function parseHtmlContentAsJson(Response $response): array
    {
        if ($response->status() >= 400) {
            return [
                'message' => 'Error',
                'status' => $response->status(),
            ];
        }

        return $response->getContent();
    }
}
