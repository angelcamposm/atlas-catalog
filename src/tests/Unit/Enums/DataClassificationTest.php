<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\DataClassification;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(DataClassification::class)]
class DataClassificationTest extends TestCase
{
    #[Test]
    public function it_has_correct_values(): void
    {
        $this->assertEquals('l0', DataClassification::Public->value);
        $this->assertEquals('l1', DataClassification::Sensitive->value);
        $this->assertEquals('l2', DataClassification::Restricted->value);
        $this->assertEquals('l3', DataClassification::Confidential->value);
    }

    #[Test]
    public function it_has_display_names(): void
    {
        $this->assertEquals('Public / Unclassified (L-0)', DataClassification::Public->displayName());
        $this->assertEquals('Sensitive (L-1)', DataClassification::Sensitive->displayName());
        $this->assertEquals('Restricted (L-2)', DataClassification::Restricted->displayName());
        $this->assertEquals('Confidential (L-3)', DataClassification::Confidential->displayName());
    }

    #[Test]
    public function it_has_descriptions(): void
    {
        $this->assertNotEmpty(DataClassification::Public->description());
        $this->assertNotEmpty(DataClassification::Sensitive->description());
        $this->assertNotEmpty(DataClassification::Restricted->description());
        $this->assertNotEmpty(DataClassification::Confidential->description());
    }
}
