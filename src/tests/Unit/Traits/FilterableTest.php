<?php

declare(strict_types=1);

namespace Tests\Unit\Traits;

use App\Models\Component;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\CoversTrait;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversTrait(Component::class)]
class FilterableTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Clear components before each test
        Component::query()->delete();
    }

    #[Test]
    public function it_filters_by_single_field(): void
    {
        // Arrange
        Component::factory()->create(['is_exposed' => true]);
        Component::factory()->create(['is_exposed' => false]);

        $request = Request::create('/?filter[is_exposed]=1', 'GET');

        // Act
        $results = Component::filter($request)->get();

        // Assert
        $this->assertTrue($results->every(fn ($c) => $c->is_exposed));
    }

    #[Test]
    public function it_filters_by_multiple_fields(): void
    {
        // Arrange
        Component::factory()->create(['is_exposed' => true, 'is_stateless' => true]);
        Component::factory()->create(['is_exposed' => true, 'is_stateless' => false]);
        Component::factory()->create(['is_exposed' => false, 'is_stateless' => true]);

        $request = Request::create('/?filter[is_exposed]=1&filter[is_stateless]=1', 'GET');

        // Act
        $results = Component::filter($request)->get();

        // Assert
        $this->assertTrue($results->every(fn ($c) => $c->is_exposed && $c->is_stateless));
    }

    #[Test]
    public function it_ignores_non_filterable_fields(): void
    {
        // Arrange
        Component::factory(3)->create();

        // Try to filter by 'description' which is not in the model's $filterable array
        $request = Request::create('/?filter[description]=test', 'GET');

        // Act
        $results = Component::filter($request)->get();

        // Assert - should return all components (description filter ignored)
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_returns_all_results_when_no_filters_provided(): void
    {
        // Arrange
        Component::factory(3)->create();
        $request = Request::create('/', 'GET');

        // Act
        $results = Component::filter($request)->get();

        // Assert
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_handles_non_array_filter_parameter(): void
    {
        // Arrange
        Component::factory(3)->create();
        $request = Request::create('/?filter=invalid', 'GET');

        // Act
        $results = Component::filter($request)->get();

        // Assert
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_is_chainable_with_other_scopes(): void
    {
        // Arrange
        $component = Component::factory()->create(['is_exposed' => true]);
        Component::factory()->create(['is_exposed' => false]);

        $request = Request::create('/?filter[is_exposed]=1', 'GET');

        // Act
        $result = Component::filter($request)->where('id', $component->id)->first();

        // Assert
        $this->assertNotNull($result);
        $this->assertEquals($component->id, $result->id);
        $this->assertTrue($result->is_exposed);
    }
}

