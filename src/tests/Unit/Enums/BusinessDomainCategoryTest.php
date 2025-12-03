<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\BusinessDomainCategory;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(BusinessDomainCategory::class)]
class BusinessDomainCategoryTest extends TestCase
{
    #[Test]
    #[DataProvider('categoryNameProvider')]
    public function it_returns_the_correct_display_name(BusinessDomainCategory $category, string $expectedName): void
    {
        $this->assertSame($expectedName, $category->displayName());
    }

    #[Test]
    #[DataProvider('categoryColorProvider')]
    public function it_returns_the_correct_color(BusinessDomainCategory $category, string $expectedColor): void
    {
        $this->assertSame($expectedColor, $category->color());
    }

    public static function categoryColorProvider(): array
    {
        return [
            'Core' => [BusinessDomainCategory::Core, 'red'],
            'Generic' => [BusinessDomainCategory::Generic, 'gray'],
            'Supporting' => [BusinessDomainCategory::Supporting, 'blue'],
        ];
    }

    public static function categoryNameProvider(): array
    {
        return [
            'Core' => [BusinessDomainCategory::Core, 'Core'],
            'Generic' => [BusinessDomainCategory::Generic, 'Generic'],
            'Supporting' => [BusinessDomainCategory::Supporting, 'Supporting'],
        ];
    }
}
