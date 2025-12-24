<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\BusinessCapability;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessCapabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_belongs_to_a_creator(): void
    {
        $user = User::factory()->create();
        $capability = BusinessCapability::factory()->create(['created_by' => $user->id]);

        $this->assertInstanceOf(User::class, $capability->creator);
        $this->assertEquals($user->id, $capability->creator->id);
    }

    public function test_it_belongs_to_an_updater(): void
    {
        $user = User::factory()->create();
        $capability = BusinessCapability::factory()->create(['updated_by' => $user->id]);

        $this->assertInstanceOf(User::class, $capability->updater);
        $this->assertEquals($user->id, $capability->updater->id);
    }

    public function test_it_can_have_a_parent(): void
    {
        $parent = BusinessCapability::factory()->create();
        $child = BusinessCapability::factory()->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(BusinessCapability::class, $child->parent);
        $this->assertEquals($parent->id, $child->parent->id);
    }

    public function test_it_can_have_children(): void
    {
        $parent = BusinessCapability::factory()->create();
        BusinessCapability::factory()->count(3)->create(['parent_id' => $parent->id]);

        $this->assertCount(3, $parent->children);
        $this->assertInstanceOf(BusinessCapability::class, $parent->children->first());
    }

    public function test_is_root_returns_true_for_a_root_capability(): void
    {
        $model = BusinessCapability::factory()->create(['parent_id' => null]);

        $this->assertTrue($model->isRoot());
    }

    public function test_is_root_returns_false_for_a_child_capability(): void
    {
        $parent = BusinessCapability::factory()->create();
        $child = BusinessCapability::factory()->create(['parent_id' => $parent->id]);

        $this->assertFalse($child->isRoot());
    }

    public function test_has_children_method(): void
    {
        $parent = BusinessCapability::factory()->create();
        $this->assertFalse($parent->hasChildren());

        BusinessCapability::factory()->create(['parent_id' => $parent->id]);
        $this->assertTrue($parent->hasChildren());
    }

    public function test_has_parent_method(): void
    {
        $root = BusinessCapability::factory()->create(['parent_id' => null]);
        $this->assertFalse($root->hasParent());

        $child = BusinessCapability::factory()->create(['parent_id' => $root->id]);
        $this->assertTrue($child->hasParent());
    }

    public function test_only_parents_scope(): void
    {
        BusinessCapability::factory()->create(['parent_id' => null]);
        $parent = BusinessCapability::factory()->create(['parent_id' => null]);
        BusinessCapability::factory()->create(['parent_id' => $parent->id]);

        $this->assertEquals(2, BusinessCapability::onlyParents()->count());
    }

    public function test_only_children_scope(): void
    {
        $parent = BusinessCapability::factory()->create();
        BusinessCapability::factory()->count(2)->create(['parent_id' => $parent->id]);
        BusinessCapability::factory()->create();

        $this->assertEquals(2, BusinessCapability::onlyChildren()->count());
    }
}
