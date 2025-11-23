<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Represents supported CPU architectures for system compatibility checks.
 *
 * This enum defines the available CPU architectures that can be used
 * for system compatibility verification and platform-specific optimizations.
 * It provides both the internal representation and display-friendly names
 * for ARM, ARM64, and x86_64 architectures.
 */
enum CpuArchitecture: string
{
    case ARM = 'arm';
    case ARM64 = 'arm64';
    case X86_64 = 'x86-64';

    public function displayName(): string
    {
        return match ($this) {
            self::ARM => 'ARM',
            self::ARM64 => 'ARM64',
            self::X86_64 => 'x86-64',
        };
    }

    /**
     * Returns the bitness of the architecture (32 or 64).
     */
    public function bits(): int
    {
        return match ($this) {
            self::ARM => 32,
            self::ARM64 => 64,
            self::X86_64 => 64,
        };
    }
}
