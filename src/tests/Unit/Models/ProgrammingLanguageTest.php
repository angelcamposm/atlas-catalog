<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ProgrammingLanguage::class)]
class ProgrammingLanguageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $language = ProgrammingLanguage::factory()->create();
        $this->assertInstanceOf(ProgrammingLanguage::class, $language);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $language = ProgrammingLanguage::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($language->hasCreator());
        $this->assertInstanceOf(User::class, $language->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $language = ProgrammingLanguage::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($language->hasUpdater());
        $this->assertInstanceOf(User::class, $language->updater);
    }

    #[Test]
    public function it_has_frameworks(): void
    {
        $language = ProgrammingLanguage::factory()->create();
        Framework::factory()->count(3)->create(['language_id' => $language->id]);

        $this->assertInstanceOf(Collection::class, $language->frameworks);
        $this->assertCount(3, $language->frameworks);
        $this->assertInstanceOf(Framework::class, $language->frameworks->first());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Language',
            'icon' => 'icon.png',
            'is_enabled' => true,
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $language = new ProgrammingLanguage($data);

        $this->assertEquals($data, $language->getAttributes());
    }
}
