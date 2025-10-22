<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessDomain;
use Illuminate\Database\Seeder;

final class BusinessDomainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/business_domains.php');

        $collection = collect($rows);

        $collection->whereNull('parent')->each(function ($item) {
            BusinessDomain::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'display_name' => $item['name'],
                    'category' => $item['category']->value,
                    'is_active' => true,
                    'parent_id' => null,
                ],
            );
        });

        $domains = BusinessDomain::all(['id', 'name']);

        $collection->whereNotNull('parent_domain')->each(function ($item) use ($domains) {

            $parent = $domains->where('name', $item['parent_domain'])->first();

            BusinessDomain::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'display_name' => "$parent->name / {$item['name']}",
                    'category' => $item['category']->value,
                    'is_active' => true,
                    'parent_id' => $parent->id,
                ],
            );
        });
    }
}
