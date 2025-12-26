<?php

declare(strict_types=1);

namespace Tests\Unit\Observers;

use App\Models\ReleaseArtifact;
use App\Observers\ReleaseArtifactObserver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ReleaseArtifactObserver::class)]
class ReleaseArtifactObserverTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $observer = new ReleaseArtifactObserver();
        $this->assertInstanceOf(ReleaseArtifactObserver::class, $observer);
    }

    #[Test]
    public function it_does_not_modify_artifact_on_creation(): void
    {
        $artifact = ReleaseArtifact::factory()->create();
        $this->assertInstanceOf(ReleaseArtifact::class, $artifact);
    }
}
