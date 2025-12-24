<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Enums\Protocol;
use App\Models\Api;
use App\Enums\ApiAccessPolicy;
use App\Models\ApiCategory;
use App\Models\ApiStatus;
use App\Models\ApiType;
use App\Models\AuthenticationMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Api::class)]
class ApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_has_one_access_policy(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(ApiAccessPolicy::class, $api->access_policy);
    }

    #[Test]
    public function it_has_one_authentication_method(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(AuthenticationMethod::class, $api->authenticationMethod);
    }

    #[Test]
    public function it_has_one_category(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(ApiCategory::class, $api->category);
    }

    #[Test]
    public function it_has_one_status(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(ApiStatus::class, $api->status);
    }

    #[Test]
    public function it_has_one_type(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(ApiType::class, $api->type);
    }

    #[Test]
    public function it_has_one_deprecator(): void
    {
        $user = User::factory()->create();
        $api = Api::factory()->create(['deprecated_by' => $user->id]);
        $this->assertInstanceOf(User::class, $api->deprecator);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $api = Api::factory()->create(['created_by' => $user->id]);
        $this->assertInstanceOf(User::class, $api->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $api = Api::factory()->create(['updated_by' => $user->id]);
        $this->assertInstanceOf(User::class, $api->updater);
    }

    #[Test]
    public function it_can_be_deprecated(): void
    {
        $api = Api::factory()->create(['deprecated_at' => now()]);
        $this->assertTrue($api->isDeprecated());
    }

    #[Test]
    public function it_can_be_not_deprecated(): void
    {
        $api = Api::factory()->create(['deprecated_at' => null]);
        $this->assertFalse($api->isDeprecated());
    }

    #[Test]
    public function it_can_be_released(): void
    {
        $api = Api::factory()->create(['released_at' => now()]);
        $this->assertTrue($api->isReleased());
    }

    #[Test]
    public function it_can_be_not_released(): void
    {
        $api = Api::factory()->create(['released_at' => null]);
        $this->assertFalse($api->isReleased());
    }

    #[Test]
    public function it_casts_protocol_to_enum(): void
    {
        $api = Api::factory()->create(['protocol' => Protocol::Http->value]);
        $this->assertInstanceOf(Protocol::class, $api->protocol);
    }

    #[Test]
    public function it_casts_document_specification_to_array(): void
    {
        $api = Api::factory()->create(['document_specification' => ['foo' => 'bar']]);
        $this->assertIsArray($api->document_specification);
    }

    #[Test]
    public function it_casts_dates_to_carbon_instances(): void
    {
        $api = Api::factory()->create();
        $this->assertInstanceOf(Carbon::class, $api->released_at);
        $this->assertInstanceOf(Carbon::class, $api->deprecated_at);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'access_policy' => ApiAccessPolicy::InternalApi->value,
            'authentication_method_id' => AuthenticationMethod::factory()->create()->id,
            'category_id' => ApiCategory::factory()->create()->id,
            'deprecated_at' => now()->toDateTimeString(),
            'deprecated_by' => User::factory()->create()->id,
            'deprecation_reason' => 'test',
            'description' => 'test',
            'display_name' => 'test',
            'document_specification' => ['foo' => 'bar'],
            'name' => 'test',
            'protocol' => Protocol::Http->value,
            'released_at' => now()->toDateTimeString(),
            'status_id' => ApiStatus::factory()->create()->id,
            'type_id' => ApiType::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
            'url' => 'https://example.com',
            'version' => '1.0.0',
            'created_by' => User::factory()->create()->id,
        ];

        $api = new Api($data);

        $this->assertEquals($data, $api->toArray());
    }
}
