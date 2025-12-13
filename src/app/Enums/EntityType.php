<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Represents the various possible data types for an entity.
 */
enum EntityType: string
{
    case Array = 'array';
    case Boolean = 'boolean';
    case Date = 'Date';
    case DateTime = 'DateTime';
    case Decimal = 'decimal';
    case Custom = 'custom';
    case Integer = 'integer';
    case Object = 'object';
    case String = 'string';
    case Time = 'Time';
    case UUID = 'UUID';

    // Typed array cases
    case ArrayString = 'array<string>';
    case ArrayInteger = 'array<integer>';
    case ArrayBoolean = 'array<boolean>';
    case ArrayDecimal = 'array<decimal>';
    case ArrayDate = 'array<Date>';
    case ArrayDateTime = 'array<DateTime>';
    case ArrayTime = 'array<Time>';
    case ArrayUUID = 'array<UUID>';
    case ArrayObject = 'array<object>';

    /**
     * Checks if the entity type is an array.
     *
     * @return bool
     */
    public function isArray(): bool
    {
        return $this->getArraySubtype() !== null || $this === self::Array;
    }

    /**
     * Gets the subtype of an array.
     *
     * @return ?self The subtype, or null if it's not a typed array.
     */
    public function getArraySubtype(): ?self
    {
        return match ($this) {
            self::ArrayString => self::String,
            self::ArrayInteger => self::Integer,
            self::ArrayBoolean => self::Boolean,
            self::ArrayDecimal => self::Decimal,
            self::ArrayDate => self::Date,
            self::ArrayDateTime => self::DateTime,
            self::ArrayTime => self::Time,
            self::ArrayUUID => self::UUID,
            self::ArrayObject => self::Object,
            default => null,
        };
    }
}
