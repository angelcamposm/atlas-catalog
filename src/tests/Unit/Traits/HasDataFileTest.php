<?php

declare(strict_types=1);

namespace Tests\Unit\Traits;

use App\Traits\HasDataFile;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\CoversTrait;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversTrait(HasDataFile::class)]
class HasDataFileTest extends TestCase
{
    private string $dummyFilePath;
    private string $dummyDirectoryPath;

    protected function setUp(): void
    {
        parent::setUp();

        // Define a dummy class that uses the trait
        if (!class_exists(\Tests\Unit\Traits\DummyDataFileClass::class, false)) {
            require_once __DIR__ . '/DummyDataFileClass.php';
        }

        $this->dummyDirectoryPath = database_path('data');
        $this->dummyFilePath = $this->dummyDirectoryPath . '/dummy_data_file_class.php';
    }

    protected function tearDown(): void
    {
        if (File::exists($this->dummyFilePath)) {
            File::delete($this->dummyFilePath);
        }

        // Clean up directory if it's empty
        if (File::isDirectory($this->dummyDirectoryPath) && count(File::files($this->dummyDirectoryPath)) === 0) {
            File::deleteDirectory($this->dummyDirectoryPath);
        }

        parent::tearDown();
    }

    #[Test]
    public function it_retrieves_rows_from_data_file(): void
    {
        // Arrange
        $expectedData = [
            ['id' => 1, 'name' => 'Test Data 1'],
            ['id' => 2, 'name' => 'Test Data 2'],
        ];

        // Ensure the data directory exists
        if (!File::isDirectory($this->dummyDirectoryPath)) {
            File::makeDirectory($this->dummyDirectoryPath, 0755, true);
        }

        // Create the dummy data file
        $fileContent = '<?php return ' . var_export($expectedData, true) . ';';
        File::put($this->dummyFilePath, $fileContent);

        // Act
        $result = DummyDataFileClass::getRows();

        // Assert
        $this->assertTrue(File::exists($this->dummyFilePath));
        $this->assertEquals($expectedData, $result);
    }

    #[Test]
    public function it_returns_empty_array_if_file_is_empty(): void
    {
        // Arrange
        if (!File::isDirectory($this->dummyDirectoryPath)) {
            File::makeDirectory($this->dummyDirectoryPath, 0755, true);
        }
        File::put($this->dummyFilePath, '<?php return [];');

        // Act
        $result = DummyDataFileClass::getRows();

        // Assert
        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }
}

// Dummy class that uses the trait for testing purposes
class DummyDataFileClass
{
    use HasDataFile;
}
