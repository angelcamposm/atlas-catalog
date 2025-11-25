<?php

declare(strict_types=1);

namespace Tests\Unit\Helpers;

use App\Helpers\MemoryBytes;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(MemoryBytes::class)]
class MemoryBytesTest extends TestCase
{
    #[Test]
    public function it_converts_kilobytes_to_bytes(): void
    {
        $this->assertSame(1024, MemoryBytes::kilobytes());
        $this->assertSame(2048, MemoryBytes::kilobytes(2));
    }

    #[Test]
    public function it_converts_megabytes_to_bytes(): void
    {
        $this->assertSame(1048576, MemoryBytes::megabytes());
        $this->assertSame(5242880, MemoryBytes::megabytes(5));
    }

    #[Test]
    public function it_converts_gigabytes_to_bytes(): void
    {
        $this->assertSame(1073741824, MemoryBytes::gigabytes());
        $this->assertSame(3221225472, MemoryBytes::gigabytes(3));
    }

    #[Test]
    public function it_converts_terabytes_to_bytes(): void
    {
        $this->assertSame(1099511627776, MemoryBytes::terabytes());
        $this->assertSame(2199023255552, MemoryBytes::terabytes(2));
    }

    #[Test]
    public function it_converts_petabytes_to_bytes(): void
    {
        $this->assertSame(1125899906842624, MemoryBytes::petabytes());
        $this->assertSame(4503599627370496, MemoryBytes::petabytes(4));
    }

    #[Test]
    public function it_converts_exabytes_to_bytes(): void
    {
        $this->assertSame(1152921504606846976, MemoryBytes::exabytes());
        $this->assertSame(2305843009213693952, MemoryBytes::exabytes(2));
    }

    #[Test]
    public function it_throws_an_exception_for_a_zero_count(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Count must be a positive integer.');

        MemoryBytes::megabytes(0);
    }

    #[Test]
    public function it_throws_an_exception_for_a_negative_count(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Count must be a positive integer.');

        MemoryBytes::gigabytes(-5);
    }
}
