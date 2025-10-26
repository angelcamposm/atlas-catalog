<?php

declare(strict_types=1);

namespace App\Helpers;

use InvalidArgumentException;

/**
 * Provides utilities for converting memory sizes into bytes.
 */
class MemoryBytes
{
    const int BYTE = 1;
    const int KILOBYTE = 1024;
    const int MEGABYTE = 1048576;
    const int GIGABYTE = 1073741824;
    const int TERABYTE = 1099511627776;
    const int PETABYTE = 1125899906842624;
    const int EXABYTE = 1152921504606846976;

    /**
     * Get the total bytes for the given count.
     *
     * @param  int  $count
     *
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
     *
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
     *
     * @return int
     */
    public static function terabytes(int $count): int
    {
        self::validateCount($count);

        return self::TERABYTE * $count;
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
        if ($count < 0) {
            throw new InvalidArgumentException('Count must be greater than 0.');
        }
    }
}
