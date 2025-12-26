<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\DeploymentModel;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(DeploymentModel::class)]
class DeploymentModelTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('on-premise', DeploymentModel::OnPremise->value);
        $this->assertEquals('public-cloud', DeploymentModel::PublicCloud->value);
        $this->assertEquals('private-cloud', DeploymentModel::PrivateCloud->value);
        $this->assertEquals('hybrid-cloud', DeploymentModel::HybridCloud->value);
        $this->assertEquals('multi-cloud', DeploymentModel::MultiCloud->value);
    }

    #[Test]
    public function it_has_labels(): void
    {
        $this->assertEquals('On-Premise', DeploymentModel::OnPremise->label());
        $this->assertEquals('Public Cloud', DeploymentModel::PublicCloud->label());
        $this->assertEquals('Private Cloud', DeploymentModel::PrivateCloud->label());
        $this->assertEquals('Hybrid Cloud', DeploymentModel::HybridCloud->label());
        $this->assertEquals('Multi-Cloud', DeploymentModel::MultiCloud->label());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(DeploymentModel::OnPremise->description());
        $this->assertNotEmpty(DeploymentModel::PublicCloud->description());
        $this->assertNotEmpty(DeploymentModel::PrivateCloud->description());
        $this->assertNotEmpty(DeploymentModel::HybridCloud->description());
        $this->assertNotEmpty(DeploymentModel::MultiCloud->description());
    }
}
