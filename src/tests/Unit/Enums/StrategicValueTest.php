<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\StrategicValue;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(StrategicValue::class)]
class StrategicValueTest extends TestCase
{
    #[Test]
    #[DataProvider('strategic_values')]
    public function it_has_correct_values(StrategicValue $strategicValue, int $expectedValue): void
    {
        $this->assertEquals($expectedValue, $strategicValue->value);
    }

    #[Test]
    #[DataProvider('budget_approach')]
    public function it_returns_correct_budget_approaches(StrategicValue $strategicValue, string $expectedValue): void
    {
        $this->assertEquals($expectedValue, $strategicValue->budgetApproach());
    }

    #[Test]
    public function it_returns_correct_descriptions(): void
    {
        $this->assertEquals('Unique to your business. If this fails or is outdated, you lose competitive advantage', StrategicValue::Differentiator->getDescription());
        $this->assertEquals('Capabilities where performance directly impacts revenue or customer satisfaction.', StrategicValue::Competitive->getDescription());
        $this->assertEquals('Essential but standard. Must work efficiently, but innovation here yields lower ROI (e.g., Accounting).', StrategicValue::Core->getDescription());
        $this->assertEquals('Necessary back-office functions that support the core business but do not directly touch the customer or the product.', StrategicValue::Support->getDescription());
        $this->assertEquals('Necessary but adds no unique value. Often a candidate for heavy automation or outsourcing (e.g., Payroll).', StrategicValue::Commodity->getDescription());
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(StrategicValue::class, StrategicValue::Differentiator);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertIsArray(StrategicValue::cases());
        $this->assertNotEmpty(StrategicValue::cases());
        $this->assertCount(5, StrategicValue::cases());
    }

    public static function budget_approach(): array
    {
        return [
            'Differentiator' => [StrategicValue::Differentiator, 'High/CapEx'],
            'Competitive' => [StrategicValue::Competitive, 'High/Mixed'],
            'Core' => [StrategicValue::Core, 'Medium/OpEx'],
            'Support' => [StrategicValue::Support, 'Low/OpEx'],
            'Commodity' => [StrategicValue::Commodity, 'Lowest/OpEx'],
        ];
    }

    public static function strategic_values(): array
    {
        return [
            'Differentiator' => [StrategicValue::Differentiator, 5],
            'Competitive' => [StrategicValue::Competitive, 4],
            'Core' => [StrategicValue::Core, 3],
            'Support' => [StrategicValue::Support, 2],
            'Commodity' => [StrategicValue::Commodity, 1],
        ];
    }
}
