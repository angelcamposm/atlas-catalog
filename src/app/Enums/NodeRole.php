<?php

declare(strict_types=1);

namespace App\Enums;

enum NodeRole: string
{
    case Master = 'master';
    case Infra = 'infra';
    case Storage = 'storage';
    case Worker = 'worker';
}
