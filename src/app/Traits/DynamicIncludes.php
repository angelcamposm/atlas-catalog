<?php

declare(strict_types=1);

namespace App\Traits;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Trait DynamicIncludes
 *
 * Provides functionality to validate and retrieve relationships from a request
 * for dynamic eager loading in Eloquent models.
 */
trait DynamicIncludes
{
    /**
     * Validates and retrieves the relationships from the given request based on the allowed relationships.
     *
     * @param Request $request The request containing the relationships to be validated.
     * @param array<int, string> $allowedRelationships An array of relationships that are permitted.
     * @return array<int, string> An array of validated relationships.
     * @throws Exception If the requested relationships exceed the allowed limit.
     */
    protected function getValidatedRelationships(Request $request, array $allowedRelationships): array
    {
        $withParam = $request->query('with');

        if (empty($withParam)) {
            return [];
        }

        try {
            $this->validateWithParamConstraints($withParam, $allowedRelationships);

            $inputs = is_array($withParam) ? $withParam : explode(';', (string) $withParam);
            $safeRelationships = [];

            foreach ($inputs as $rawInput) {
                if (!is_string($rawInput)) {
                    continue;
                }

                $validated = $this->processRelationshipInput($rawInput, $allowedRelationships);
                if ($validated !== null) {
                    $safeRelationships[] = $validated;
                }
            }

            return $safeRelationships;
        } catch (Exception $e) {
            Log::error('DynamicIncludes validation failed', [
                'message' => $e->getMessage(),
                'with_param' => $withParam,
            ]);

            throw $e;
        }
    }

    /**
     * Validates the 'with' parameter against size and length constraints.
     *
     * @param mixed $withParam
     * @param array<int, string> $allowedRelationships
     * @throws Exception
     */
    private function validateWithParamConstraints(mixed $withParam, array $allowedRelationships): void
    {
        // SECURITY 0: Prevent gigantic arrays (application-level DDoS)
        if (is_array($withParam) && count($withParam) > count($allowedRelationships)) {
            throw new Exception('Requested relationships exceed the allowed limit.');
        }

        // SECURITY 0.1: Prevent massive strings
        if (is_string($withParam) && strlen($withParam) > 500) {
            throw new Exception('Requested relationships string exceeds the length limit.');
        }
    }

    /**
     * Processes and validates a single relationship input.
     *
     * @param string $rawInput
     * @param array<int, string> $allowedRelationships
     * @return string|null
     */
    private function processRelationshipInput(string $rawInput, array $allowedRelationships): ?string
    {
        // SECURITY 1: UTF-8 Encoding Validation
        if (!mb_check_encoding($rawInput, 'UTF-8')) {
            Log::warning('Invalid UTF-8 encoding in relationship input', ['input' => $rawInput]);
            return null;
        }

        // SECURITY 1.1: Cleanup of control and invisible characters
        $input = (string) preg_replace('/[\x00-\x1F\x7F]/', '', $rawInput);

        // Separate relation and fields
        $parts = explode(':', $input);
        $relation = trim($parts[0]);

        // SECURITY 2: Whitelist
        if (!in_array($relation, $allowedRelationships, true)) {
            Log::debug('Relationship not in whitelist', ['relation' => $relation]);
            return null;
        }

        // If there are no specific fields, return the relation
        if (!isset($parts[1]) || empty(trim($parts[1]))) {
            return $relation;
        }

        return $this->validateRelationshipFields($relation, $parts[1]);
    }

    /**
     * Validates the fields for a given relationship.
     *
     * @param string $relation
     * @param string $fieldsString
     * @return string|null
     */
    private function validateRelationshipFields(string $relation, string $fieldsString): ?string
    {
        $fields = explode(',', $fieldsString);
        $safeFields = [];

        foreach ($fields as $field) {
            $field = trim($field);

            // SECURITY 4: Strict Regex (Alphanumeric + Underscore)
            if (preg_match('/^[a-zA-Z0-9_]+$/', $field)) {
                $safeFields[] = $field;
            } else {
                Log::warning('Invalid field name detected in relationship', [
                    'field' => $field,
                    'relation' => $relation,
                ]);
            }
        }

        if (!empty($safeFields)) {
            return $relation . ':' . implode(',', $safeFields);
        }

        return null;
    }
}
