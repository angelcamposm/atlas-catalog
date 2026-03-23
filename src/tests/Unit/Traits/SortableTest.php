<?php

declare(strict_types=1);

namespace Tests\Unit\Traits;

use App\Models\Component;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\CoversTrait;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversTrait(Component::class)]
class SortableTest extends TestCase
{
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        // Clear components before each test
        Component::query()->delete();
    }

    #[Test]
    public function it_sorts_ascending_by_id(): void
    {
        // Arrange
        $component1 = Component::factory()->create();
        $component2 = Component::factory()->create();
        $component3 = Component::factory()->create();

        $request = Request::create('/?sort=id', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert
        $this->assertEquals($component1->id, $results[0]->id);
        $this->assertEquals($component2->id, $results[1]->id);
        $this->assertEquals($component3->id, $results[2]->id);
    }

    #[Test]
    public function it_sorts_descending_with_minus_prefix(): void
    {
        // Arrange
        $component1 = Component::factory()->create();
        $component2 = Component::factory()->create();
        $component3 = Component::factory()->create();

        $request = Request::create('/?sort=-id', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert - should be in reverse order
        $this->assertEquals($component3->id, $results[0]->id);
        $this->assertEquals($component2->id, $results[1]->id);
        $this->assertEquals($component1->id, $results[2]->id);
    }

    #[Test]
    public function it_ignores_non_sortable_fields(): void
    {
        // Arrange
        $component1 = Component::factory()->create(['is_exposed' => true]);
        $component2 = Component::factory()->create(['is_exposed' => false]);
        $component3 = Component::factory()->create(['is_exposed' => true]);

        // Try to sort by 'is_exposed' which is NOT in the model's $sortable array
        $request = Request::create('/?sort=is_exposed', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert - should return results but not sorted by is_exposed
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_returns_all_results_when_no_sort_provided(): void
    {
        // Arrange
        Component::factory(3)->create();
        $request = Request::create('/', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_sorts_by_id_ascending(): void
    {
        // Arrange
        $component1 = Component::factory()->create();
        $component2 = Component::factory()->create();
        $component3 = Component::factory()->create();

        $request = Request::create('/?sort=id', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert
        $this->assertEquals($component1->id, $results[0]->id);
        $this->assertEquals($component2->id, $results[1]->id);
        $this->assertEquals($component3->id, $results[2]->id);
    }

    #[Test]
    public function it_sorts_by_created_at_descending(): void
    {
        // Arrange
        $component1 = Component::factory()->create();
        sleep(1); // Add delay to ensure different timestamps
        $component2 = Component::factory()->create();
        sleep(1); // Add delay to ensure different timestamps
        $component3 = Component::factory()->create();

        $request = Request::create('/?sort=-created_at', 'GET');

        // Act
        $results = Component::sort($request)->get();

        // Assert
        $this->assertEquals($component3->id, $results[0]->id);
        $this->assertEquals($component2->id, $results[1]->id);
        $this->assertEquals($component1->id, $results[2]->id);
    }

    #[Test]
    public function it_is_chainable_with_other_scopes(): void
    {
        // Arrange
        Component::factory(3)->create();
        $request = Request::create('/?sort=id', 'GET');

        // Act
        $results = Component::sort($request)->limit(2)->get();

        // Assert
        $this->assertCount(2, $results);
    }
}

