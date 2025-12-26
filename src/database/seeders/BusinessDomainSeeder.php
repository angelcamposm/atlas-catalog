<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessDomain;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class BusinessDomainSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collection = collect(self::getRows());

        $collection->whereNull('parent')->each(function ($item) {
            BusinessDomain::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'display_name' => $item['name'],
                    'category' => $item['category']->value,
                    'is_enabled' => false,
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
                    'is_enabled' => false,
                    'parent_id' => $parent->id,
                ],
            );
        });
    }
}
