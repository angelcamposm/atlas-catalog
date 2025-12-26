<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Release;
use App\Models\ReleaseArtifact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ReleaseArtifact::class)]
class ReleaseArtifactTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $artifact = ReleaseArtifact::factory()->create();
        $this->assertInstanceOf(ReleaseArtifact::class, $artifact);
    }

    #[Test]
    public function it_belongs_to_a_release(): void
    {
        $release = Release::factory()->create();
        $artifact = ReleaseArtifact::factory()->create(['release_id' => $release->id]);
        $this->assertInstanceOf(Release::class, $artifact->release);
        $this->assertEquals($release->id, $artifact->release->id);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'release_id' => Release::factory()->create()->id,
            'type' => 'docker',
            'name' => 'test-image',
            'url' => 'https://example.com/image',
            'digest_md5' => 'md5',
            'digest_sha1' => 'sha1',
            'digest_sha256' => 'sha256',
            'size_bytes' => 1024,
        ];

        $artifact = new ReleaseArtifact($data);

        $this->assertEquals($data, $artifact->getAttributes());
    }
}
