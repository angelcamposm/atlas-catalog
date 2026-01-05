<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\CommunicationStyle;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(CommunicationStyle::class)]
class CommunicationStyleTest extends TestCase
{
    #[Test]
    public function it_returns_correct_display_names(): void
    {
        $this->assertSame('Synchronous', CommunicationStyle::Synchronous->displayName());
        $this->assertSame('Asynchronous', CommunicationStyle::Asynchronous->displayName());
    }

    #[Test]
    public function it_returns_correct_icons(): void
    {
        $this->assertSame('sync', CommunicationStyle::Synchronous->icon());
        $this->assertSame('paper-plane', CommunicationStyle::Asynchronous->icon());
    }

    #[Test]
    public function it_returns_supported_authentication_schemes(): void
    {
        $syncSchemes = CommunicationStyle::Synchronous->supportedAuthenticationSchemes();
        $asyncSchemes = CommunicationStyle::Asynchronous->supportedAuthenticationSchemes();

        $this->assertContains('OAuth2', $syncSchemes);
        $this->assertContains('API Key', $syncSchemes);
        $this->assertNotContains('SASL', $syncSchemes);

        $this->assertContains('mTLS', $asyncSchemes);
        $this->assertContains('SASL', $asyncSchemes);
        $this->assertNotContains('OAuth2', $asyncSchemes);
    }
}
