<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\EntityType;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

#[CoversClass(EntityType::class)]
class EntityTypeTest extends TestCase
{
    public static function arrayTypesProvider(): array
    {
        return [
            [EntityType::Array, true],
            [EntityType::ArrayString, true],
            [EntityType::ArrayInteger, true],
            [EntityType::ArrayBoolean, true],
            [EntityType::ArrayDecimal, true],
            [EntityType::ArrayDate, true],
            [EntityType::ArrayDateTime, true],
            [EntityType::ArrayTime, true],
            [EntityType::ArrayUUID, true],
            [EntityType::ArrayObject, true],
        ];
    }

    public static function nonArrayTypesProvider(): array
    {
        return [
            [EntityType::Boolean, false],
            [EntityType::Date, false],
            [EntityType::DateTime, false],
            [EntityType::Decimal, false],
            [EntityType::Integer, false],
            [EntityType::Object, false],
            [EntityType::String, false],
            [EntityType::Time, false],
            [EntityType::UUID, false],
        ];
    }

    #[DataProvider('arrayTypesProvider')]
    #[DataProvider('nonArrayTypesProvider')]
    public function testIsArray(EntityType $type, bool $expected): void
    {
        $this->assertSame($expected, $type->isArray());
    }

    public static function arraySubtypeProvider(): array
    {
        return [
            [EntityType::ArrayString, EntityType::String],
            [EntityType::ArrayInteger, EntityType::Integer],
            [EntityType::ArrayBoolean, EntityType::Boolean],
            [EntityType::ArrayDecimal, EntityType::Decimal],
            [EntityType::ArrayDate, EntityType::Date],
            [EntityType::ArrayDateTime, EntityType::DateTime],
            [EntityType::ArrayTime, EntityType::Time],
            [EntityType::ArrayUUID, EntityType::UUID],
            [EntityType::ArrayObject, EntityType::Object],
        ];
    }

    #[DataProvider('arraySubtypeProvider')]
    public function testGetArraySubtype(EntityType $type, EntityType $expectedSubtype): void
    {
        $this->assertSame($expectedSubtype, $type->getArraySubtype());
    }

    public static function nonArraySubtypeProvider(): array
    {
        return [
            [EntityType::Array],
            [EntityType::Boolean],
            [EntityType::Date],
            [EntityType::DateTime],
            [EntityType::Decimal],
            [EntityType::Integer],
            [EntityType::Object],
            [EntityType::String],
            [EntityType::Time],
            [EntityType::UUID],
        ];
    }

    #[DataProvider('nonArraySubtypeProvider')]
    public function testGetArraySubtypeReturnsNullForNonTypedArrays(EntityType $type): void
    {
        $this->assertNull($type->getArraySubtype());
    }
}
