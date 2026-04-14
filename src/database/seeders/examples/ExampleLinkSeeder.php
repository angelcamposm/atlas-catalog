<?php

namespace Database\Seeders\Examples;

use App\Models\Component;
use App\Models\Link;
use App\Models\LinkCategory;
use Illuminate\Database\Seeder;

/**
 * Example: Links
 *
 * Creates sample links (documentation, repositories, dashboards, etc.)
 * associated with components for reference and navigation.
 */
class ExampleLinkSeeder extends Seeder
{
    public function run(): void
    {
        $components = Component::limit(15)->get();
        $categories = LinkCategory::all();

        if ($components->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('⚠️  Missing required data (Components or LinkCategories)');
            return;
        }

        $linkTemplates = [
            [
                'category' => 'Documentation',
                'urls' => [
                    'https://docs.example.com/{component}',
                    'https://wiki.example.com/docs/{component}',
                ],
            ],
            [
                'category' => 'Repository',
                'urls' => [
                    'https://github.com/company/{component}',
                    'https://github.com/company/{component}-api',
                ],
            ],
            [
                'category' => 'Dashboard',
                'urls' => [
                    'https://dashboard.example.com/{component}',
                    'https://monitoring.example.com/{component}',
                ],
            ],
            [
                'category' => 'CI/CD',
                'urls' => [
                    'https://ci.example.com/{component}',
                    'https://jenkins.example.com/job/{component}',
                ],
            ],
        ];

        $count = 0;

        foreach ($components as $component) {
            // Add 2-4 links per component
            $numLinks = rand(2, 4);

            foreach (range(1, $numLinks) as $i) {
                $template = $linkTemplates[array_rand($linkTemplates)];
                $category = $categories->firstWhere('name', $template['category']);
                $url = str_replace('{component}', $component->slug, $template['urls'][array_rand($template['urls'])]);

                Link::factory()->create([
                    'component_id' => $component->id,
                    'link_category_id' => $category?->id,
                    'url' => $url,
                ]);

                $count++;
            }
        }

        $this->command->info("✅ Created {$count} example links");
    }
}
