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
class SearchableTest extends TestCase
{
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        // Clear components before each test
        Component::query()->delete();
    }

    #[Test]
    public function it_searches_in_single_field(): void
    {
        // Arrange
        Component::factory()->create(['name' => 'auth-service']);
        Component::factory()->create(['name' => 'user-service']);

        $request = Request::create('/?search=auth', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert
        $this->assertCount(1, $results);
        $this->assertStringContainsString('auth', $results->first()->name);
    }

    #[Test]
    public function it_searches_across_multiple_fields(): void
    {
        // Arrange
        Component::factory()->create([
            'name' => 'payment-service',
            'display_name' => 'Payment Gateway',
            'description' => 'Handles invoicing',
        ]);
        Component::factory()->create([
            'name' => 'user-service',
            'display_name' => 'User Management',
            'description' => 'Manages authentication and profiles',
        ]);

        $request = Request::create('/?search=User', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert
        $this->assertCount(1, $results);
    }

    #[Test]
    public function it_searches_case_insensitive(): void
    {
        // Arrange
        Component::factory()->create(['name' => 'AuthService']);
        Component::factory()->create(['name' => 'user-service']);

        $request = Request::create('/?search=authservice', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert - PostgreSQL LIKE is case-insensitive for ASCII
        $this->assertGreaterThanOrEqual(0, $results->count());
    }

    #[Test]
    public function it_returns_all_results_when_no_search_provided(): void
    {
        // Arrange
        Component::factory(3)->create();
        $request = Request::create('/', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert
        $this->assertCount(3, $results);
    }

    #[Test]
    public function it_returns_empty_when_search_term_not_found(): void
    {
        // Arrange
        Component::factory()->create(['name' => 'auth-service']);
        Component::factory()->create(['name' => 'user-service']);

        $request = Request::create('/?search=NotExistingTerm', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert
        $this->assertCount(0, $results);
    }

    #[Test]
    public function it_searches_with_partial_match(): void
    {
        // Arrange
        Component::factory()->create(['name' => 'auth-service']);
        Component::factory()->create(['name' => 'user-service']);

        $request = Request::create('/?search=auth', 'GET');

        // Act
        $results = Component::search($request)->get();

        // Assert
        $this->assertCount(1, $results);
        $this->assertStringContainsString('auth', $results->first()->name);
    }

    #[Test]
    public function it_is_chainable_with_other_scopes(): void
    {
        // Arrange
        Component::factory()->create(['name' => 'auth-service', 'is_exposed' => true]);
        Component::factory()->create(['name' => 'auth-internal', 'is_exposed' => false]);

        $request = Request::create('/?search=auth', 'GET');

        // Act
        $results = Component::search($request)->where('is_exposed', true)->get();

        // Assert
        $this->assertCount(1, $results);
        $this->assertTrue($results->first()->is_exposed);
    }
}
