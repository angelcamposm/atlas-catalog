<?php

declare(strict_types=1);

namespace App\Helpers;

use InvalidArgumentException;

/**
 * Provides utilities for converting memory sizes into bytes.
 */
class MemoryBytes
{
    public const int BYTE = 1;
    public const int KILOBYTE = 1024;
    public const int MEGABYTE = 1048576;
    public const int GIGABYTE = 1073741824;
    public const int TERABYTE = 1099511627776;
    public const int PETABYTE = 1125899906842624;
    public const int EXABYTE = 1152921504606846976;

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function kilobytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::KILOBYTE * $count;
    }

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function megabytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::MEGABYTE * $count;
    }

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function gigabytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::GIGABYTE * $count;
    }

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function terabytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::TERABYTE * $count;
    }

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function petabytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::PETABYTE * $count;
    }

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     * @return int
     */
    public static function exabytes(int $count = 1): int
    {
        self::validateCount($count);

        return self::EXABYTE * $count;
    }

    /**
     * Check if the given count is valid.
     *
     * @param  int  $count
     *
     * @return void
     */
    public static function validateCount(int $count): void
    {
        if ($count < 1) {
            throw new InvalidArgumentException('Count must be a positive integer.');
        }
    }
}
