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
    #[DataProvider('categoryProvider')]
    public function it_returns_the_correct_display_name(BusinessDomainCategory $category, string $expectedName): void
    {
        $this->assertSame($expectedName, $category->displayName());
    }

    #[Test]
    #[DataProvider('categoryProvider')]
    public function it_returns_the_correct_color(BusinessDomainCategory $category, string $expectedName, string $expectedColor): void
    {
        $this->assertSame($expectedColor, $category->color());
    }

    public static function categoryProvider(): array
    {
        return [
            'Core' => [BusinessDomainCategory::Core, 'Core', 'red'],
            'Generic' => [BusinessDomainCategory::Generic, 'Generic', 'gray'],
            'Supporting' => [BusinessDomainCategory::Supporting, 'Supporting', 'blue'],
        ];
    }
}
