<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class CategorySeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = collect(self::getRows());

        // First, create the top-level categories
        $rows->whereNull('parent_id')->each(function ($item) {
            $this->createModel($item);
        });

        // Get the top-level categories
        $categories = Category::select(['id', 'name'])->whereNull('parent_id')->get();

        // Then, create the child categories
        $rows->whereNotNull('parent_id')->each(function ($item) use ($categories) {
            $parent = $categories->where('name', $item['parent_id'])->first();
            if ($parent) {
                $item['parent_id'] = $parent->id;
            }
            $this->createModel($item);
        });
    }

    private function createModel($item): void
    {
        Category::updateOrCreate(
            ['name' => $item['name']],
            [
                'description' => $item['description'],
                'icon' => $item['icon'],
                'model' => $item['model'],
                'parent_id' => $item['parent_id'],
            ],
        );
    }
}
