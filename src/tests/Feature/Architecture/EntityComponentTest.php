<?php

declare(strict_types=1);

namespace Tests\Feature\Architecture;

use App\Models\Component;
use App\Models\Entity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EntityComponentTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_components_for_an_entity(): void
    {
        $entity = Entity::factory()->create();
        $components = Component::factory()->count(2)->create();

        $entity->components()->attach($components->pluck('id'));

        $response = $this->getJson('/api/v1/architecture/entities/'.$entity->id.'/components');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
