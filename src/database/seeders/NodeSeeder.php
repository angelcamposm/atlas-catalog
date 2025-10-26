<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Node;
use Illuminate\Database\Seeder;

final class NodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Node::factory(15)->create();
    }
}
