<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * @method static cases()
 * @method static values()
 */
enum WorkflowRunResult: string
{
    case Aborted = 'ABORTED';
    case Failure = 'FAILURE';
    case NotBuilt = 'NOT_BUILT';
    case Success = 'SUCCESS';
    case Unstable = 'UNSTABLE';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
