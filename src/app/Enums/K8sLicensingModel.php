<?php

declare(strict_types=1);

namespace App\Enums;

enum K8sLicensingModel: string
{
    case None = 'none';
    case OpenShift = 'openshift';
}
