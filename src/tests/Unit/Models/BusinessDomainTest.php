<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Enums\BusinessDomainCategory;
use App\Models\BusinessDomain;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(BusinessDomain::class)]
class BusinessDomainTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $domain = BusinessDomain::factory()->create();
        $this->assertInstanceOf(BusinessDomain::class, $domain);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $domain = BusinessDomain::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($domain->hasCreator());
        $this->assertInstanceOf(User::class, $domain->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $domain = BusinessDomain::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($domain->hasUpdater());
        $this->assertInstanceOf(User::class, $domain->updater);
    }

    #[Test]
    public function it_has_a_parent(): void
    {
        $parent = BusinessDomain::factory()->create();
        $child = BusinessDomain::factory()->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(BusinessDomain::class, $child->parent);
        $this->assertTrue($child->hasParent());
        $this->assertEquals($parent->id, $child->parent->id);
    }

    #[Test]
    public function it_can_have_a_null_parent(): void
    {
        $domain = BusinessDomain::factory()->create(['parent_id' => null]);
        $this->assertNull($domain->parent);
    }

    #[Test]
    public function it_has_children(): void
    {
        $parent = BusinessDomain::factory()->create();
        BusinessDomain::factory()->count(3)->create(['parent_id' => $parent->id]);

        $this->assertInstanceOf(Collection::class, $parent->children);
        $this->assertCount(3, $parent->children);
        $this->assertInstanceOf(BusinessDomain::class, $parent->children->first());
    }

    #[Test]
    public function it_can_have_no_children(): void
    {
        $domain = BusinessDomain::factory()->create();
        $this->assertInstanceOf(Collection::class, $domain->children);
        $this->assertCount(0, $domain->children);
    }

    #[Test]
    public function it_can_be_active(): void
    {
        $domain = BusinessDomain::factory()->create(['is_active' => true]);
        $this->assertTrue($domain->isActive());
    }

    #[Test]
    public function it_can_be_inactive(): void
    {
        $domain = BusinessDomain::factory()->create(['is_active' => false]);
        $this->assertFalse($domain->isActive());
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Domain',
            'display_name' => 'Test Domain',
            'description' => 'This is a test domain.',
            'category' => BusinessDomainCategory::Core->value,
            'is_active' => true,
            'parent_id' => BusinessDomain::factory()->create()->id,
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $domain = new BusinessDomain($data);

        $this->assertEquals($data, $domain->getAttributes());
    }

    #[Test]
    public function it_is_not_fillable(): void
    {
        $data = [
            'id' => 1,
            'name' => 'Test Domain',
        ];

        $domain = new BusinessDomain($data);

        $this->assertNotEquals($data, $domain->getAttributes());
        $this->assertNull($domain->getAttribute('id'));
    }
}
