<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Str;

trait HasDataFile
{
    /**
     * Retrieves rows of data from a seed file in the database path.
     *
     * @return array The array of data contained in the specified file.
     */
    public static function getRows(): array
    {
        return include database_path(self::getFilePath());
    }

    /**
     * Constructs the full file path for a data file by appending the generated
     * filename to the predefined database data directory path.
     *
     * @return string The full file path for the data file.
     */
    private static function getFilePath(): string
    {
        return 'data/'.self::getFileName();
    }

    /**
     * Generates the filename for the current class by converting its basename
     * to snake_case and appending the '.php' extension.
     *
     * @return string The generated filename in snake_case with a '.php' extension.
     */
    private static function getFileName(): string
    {
        $class_basename = class_basename(static::class);

        return Str::snake($class_basename).'.php';
    }
}
