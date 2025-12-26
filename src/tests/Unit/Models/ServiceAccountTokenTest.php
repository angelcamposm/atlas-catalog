<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\ServiceAccount;
use App\Models\ServiceAccountToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ServiceAccountToken::class)]
class ServiceAccountTokenTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $token = ServiceAccountToken::factory()->withServiceAccount()->create();
        $this->assertInstanceOf(ServiceAccountToken::class, $token);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['created_by' => $user->id]);
        $this->assertTrue($token->hasCreator());
        $this->assertInstanceOf(User::class, $token->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['updated_by' => $user->id]);
        $this->assertTrue($token->hasUpdater());
        $this->assertInstanceOf(User::class, $token->updater);
    }

    #[Test]
    public function it_belongs_to_a_service_account(): void
    {
        $serviceAccount = ServiceAccount::factory()->create();
        $token = ServiceAccountToken::factory()->create(['service_account_id' => $serviceAccount->id]);
        $this->assertInstanceOf(ServiceAccount::class, $token->serviceAccount);
        $this->assertEquals($serviceAccount->id, $token->serviceAccount->id);
    }

    #[Test]
    public function it_casts_expires_at_to_datetime(): void
    {
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['expires_at' => now()]);
        $this->assertInstanceOf(Carbon::class, $token->expires_at);
    }

    #[Test]
    public function it_can_be_expired(): void
    {
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['expires_at' => now()->subDay()]);
        $this->assertTrue($token->isExpired());
    }

    #[Test]
    public function it_can_be_not_expired(): void
    {
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['expires_at' => now()->addDay()]);
        $this->assertFalse($token->isExpired());
    }

    #[Test]
    public function it_has_masked_token_attribute(): void
    {
        $tokenValue = '1234567890123456789012345678901234567890';
        $token = ServiceAccountToken::factory()->withServiceAccount()->create(['token' => $tokenValue]);
        $this->assertStringContainsString('...', $token->masked_token);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'service_account_id' => ServiceAccount::factory()->create()->id,
            'token' => 'test-token',
            'expires_at' => now()->toDateTimeString(),
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $token = new ServiceAccountToken($data);

        $data['masked_token'] = $data['token'].Str::reverse($data['token']);
        unset($data['token']);

        $this->assertEquals($data, $token->toArray());
    }
}
