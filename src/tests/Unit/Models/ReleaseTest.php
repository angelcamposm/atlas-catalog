<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Component;
use App\Models\Release;
use App\Models\ReleaseArtifact;
use App\Models\User;
use App\Models\WorkflowRun;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Release::class)]
class ReleaseTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $release = Release::factory()->create();
        $this->assertInstanceOf(Release::class, $release);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $release = Release::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($release->hasCreator());
        $this->assertInstanceOf(User::class, $release->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $release = Release::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($release->hasUpdater());
        $this->assertInstanceOf(User::class, $release->updater);
    }

    #[Test]
    public function it_belongs_to_a_component(): void
    {
        $component = Component::factory()->create();
        $release = Release::factory()->create(['component_id' => $component->id]);
        $this->assertInstanceOf(Component::class, $release->component);
        $this->assertEquals($component->id, $release->component->id);
    }

    #[Test]
    public function it_belongs_to_a_workflow_run(): void
    {
        $workflowRun = WorkflowRun::factory()->create();
        $release = Release::factory()->create(['workflow_run_id' => $workflowRun->id]);
        $this->assertInstanceOf(WorkflowRun::class, $release->workflowRun);
        $this->assertEquals($workflowRun->id, $release->workflowRun->id);
    }

    #[Test]
    public function it_has_artifacts(): void
    {
        $release = Release::factory()->create();
        ReleaseArtifact::factory()->count(3)->create(['release_id' => $release->id]);

        $this->assertInstanceOf(Collection::class, $release->artifacts);
        $this->assertCount(3, $release->artifacts);
        $this->assertInstanceOf(ReleaseArtifact::class, $release->artifacts->first());
    }

    #[Test]
    public function it_casts_metadata_to_array(): void
    {
        $release = Release::factory()->create(['metadata' => ['foo' => 'bar']]);
        $this->assertIsArray($release->metadata);
    }

    #[Test]
    public function it_casts_released_at_to_datetime(): void
    {
        $release = Release::factory()->create(['released_at' => now()]);
        $this->assertInstanceOf(Carbon::class, $release->released_at);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'component_id' => Component::factory()->create()->id,
            'workflow_run_id' => WorkflowRun::factory()->create()->id,
            'version' => '1.0.0',
            'status' => 'published',
            'changelog' => 'Initial release',
            'metadata' => ['foo' => 'bar'],
            'released_at' => now()->toDateTimeString(),
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $release = new Release($data);

        $this->assertEquals($data, $release->toArray());
    }
}
