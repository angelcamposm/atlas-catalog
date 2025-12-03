<?php

declare(strict_types=1);

namespace App\Enums;

enum WorkflowRunResult: string
{
    case Aborted = 'ABORTED';
    case Failure = 'FAILURE';
    case NotBuilt = 'NOT_BUILT';
    case Success = 'SUCCESS';
    case Unstable = 'UNSTABLE';
}
