<?php

declare(strict_types=1);

namespace App\Enums;

enum DeploymentStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Success = 'success';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
    case RolledBack = 'rolled_back';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
