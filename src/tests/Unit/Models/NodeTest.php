<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Node;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Node::class)]
class NodeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_be_created(): void
    {
        $node = Node::factory()->create();
        $this->assertInstanceOf(Node::class, $node);
    }

    #[Test]
    public function it_has_one_creator(): void
    {
        $user = User::factory()->create();
        $node = Node::factory()->create(['created_by' => $user->id]);
        $this->assertTrue($node->hasCreator());
        $this->assertInstanceOf(User::class, $node->creator);
    }

    #[Test]
    public function it_has_one_updater(): void
    {
        $user = User::factory()->create();
        $node = Node::factory()->create(['updated_by' => $user->id]);
        $this->assertTrue($node->hasUpdater());
        $this->assertInstanceOf(User::class, $node->updater);
    }

    #[Test]
    public function it_is_fillable(): void
    {
        $data = [
            'name' => 'Test Node',
            'discovery_source' => 'manual',
            'cpu_architecture' => 'x86_64',
            'cpu_sockets' => 1,
            'cpu_cores' => 4,
            'cpu_threads' => 8,
            'smt_enabled' => true,
            'ip_address' => '192.168.1.1',
            'mac_address' => '00:00:00:00:00:00',
            'memory_bytes' => 1024,
            'hostname' => 'test-node',
            'fqdn' => 'test-node.example.com',
            'node_type' => 'v',
            'os' => 'Linux',
            'os_version' => '5.15',
            'timezone' => 'UTC',
            'created_by' => User::factory()->create()->id,
            'updated_by' => User::factory()->create()->id,
        ];

        $node = new Node($data);

        $this->assertEquals($data, $node->getAttributes());
    }
}
