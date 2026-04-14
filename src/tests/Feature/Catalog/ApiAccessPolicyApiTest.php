<?php

declare(strict_types=1);

namespace Tests\Feature\Catalog;

use App\Enums\ApiAccessPolicy;
use App\Models\Api;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ApiAccessPolicyApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_only_apis_for_the_requested_access_policy(): void
    {
        Api::factory()->count(2)->create([
            'access_policy' => ApiAccessPolicy::PublicApi,
        ]);
        Api::factory()->create([
            'access_policy' => ApiAccessPolicy::InternalApi,
        ]);

        $response = $this->getJson('/api/v1/catalog/apis/access-policies/'.ApiAccessPolicy::PublicApi->value.'/apis');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.access_policy', ApiAccessPolicy::PublicApi->value);
    }
}
