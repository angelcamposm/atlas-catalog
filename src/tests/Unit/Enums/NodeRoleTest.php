<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\NodeRole;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(NodeRole::class)]
class NodeRoleTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('master', NodeRole::Master->value);
        $this->assertEquals('infra', NodeRole::Infra->value);
        $this->assertEquals('storage', NodeRole::Storage->value);
        $this->assertEquals('worker', NodeRole::Worker->value);
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(NodeRole::class, NodeRole::Master);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertCount(4, NodeRole::cases());
    }
}
