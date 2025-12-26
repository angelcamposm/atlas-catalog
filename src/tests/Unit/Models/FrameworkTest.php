<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Framework::class)]
class FrameworkTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $framework = Framework::factory()->create();
        $this->assertInstanceOf(Framework::class, $framework);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $framework = Framework::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($framework->hasCreator());
        $this->assertInstanceOf(User::class, $framework->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $framework = Framework::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($framework->hasUpdater());
        $this->assertInstanceOf(User::class, $framework->updater);
    }

    #[Test]
    public function it_belongs_to_a_language(): void
    {
        $language = ProgrammingLanguage::factory()->create();
        $framework = Framework::factory()->create(['language_id' => $language->id]);
        $this->assertInstanceOf(ProgrammingLanguage::class, $framework->language);
        $this->assertEquals($language->id, $framework->language->id);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Framework',
            'description' => 'Test Description',
            'icon' => 'icon.png',
            'is_enabled' => true,
            'language_id' => ProgrammingLanguage::factory()->create()->id,
            'url' => 'https://example.com',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $framework = new Framework($data);

        $this->assertEquals($data, $framework->getAttributes());
    }
}
