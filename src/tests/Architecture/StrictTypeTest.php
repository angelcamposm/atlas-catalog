<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RegexIterator;

/**
 * Class StrictTypeTest
 *
 * Enforces strict type declarations across the codebase.
 */
class StrictTypeTest extends TestCase
{
    #[Test]
    #[DataProvider('getFiles')]
    public function it_enforces_strict_types_in_all_php_files($filePath): void
    {
        $content = file_get_contents($filePath);

        $this->assertStringContainsString(
            'declare(strict_types=1);',
            $content,
            "File {$filePath} does not declare strict types."
        );
    }

    public static function getFiles(): array
    {
        $files = [];

        $paths = [
            'app'.DIRECTORY_SEPARATOR.'controllers',
            'app'.DIRECTORY_SEPARATOR.'Enums',
            'app'.DIRECTORY_SEPARATOR.'Helpers',
            'app'.DIRECTORY_SEPARATOR.'Models',
            'app'.DIRECTORY_SEPARATOR.'Observers',
            'app'.DIRECTORY_SEPARATOR.'Policies',
            'app'.DIRECTORY_SEPARATOR.'Rules',
            'app'.DIRECTORY_SEPARATOR.'Traits',
            'database'.DIRECTORY_SEPARATOR.'data',
            'database'.DIRECTORY_SEPARATOR.'factories',
            'database'.DIRECTORY_SEPARATOR.'migrations',
            'database'.DIRECTORY_SEPARATOR.'seeders',
        ];

        foreach ($paths as $path) {
            if (!is_dir($path)) {
                continue;
            }

            $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
            $phpFiles = new RegexIterator($iterator, '/^.+\.php$/i', RegexIterator::GET_MATCH);

            foreach ($phpFiles as $file) {
                $files[basename($file[0])] = $file;
            }
        }

        return $files;
    }
}
