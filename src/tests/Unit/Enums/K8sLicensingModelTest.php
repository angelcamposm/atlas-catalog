<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\K8sLicensingModel;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(K8sLicensingModel::class)]
class K8sLicensingModelTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('none', K8sLicensingModel::None->value);
        $this->assertEquals('openshift', K8sLicensingModel::OpenShift->value);
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(K8sLicensingModel::class, K8sLicensingModel::None);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertCount(2, K8sLicensingModel::cases());
    }
}
