<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessCapability;
use App\Traits\HasDataFile;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection as SupportCollection;

final class BusinessCapabilitySeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = collect(self::getRows());

        $data->whereNull('parent_name')->each(function ($item) {
            $this->createBusinessCapability($item);
        });

        // Second level capabilities
        $rootCapabilities = BusinessCapability::select(['id', 'name'])->get();

        $this->createChildItems($rootCapabilities, $data);

        // Third level capabilities
        $secondLevelCapabilities = BusinessCapability::whereNotNull('parent_id')
            ->select(['id', 'name'])
            ->get();

        $this->createChildItems($secondLevelCapabilities, $data);
    }

    /**
     * @param  EloquentCollection  $models
     * @param  SupportCollection  $items
     *
     * @return void
     */
    public function createChildItems(EloquentCollection $models, SupportCollection $items): void
    {
        $models->each(function ($model) use ($items) {
            $items->where('parent_name', $model->name)->each(function ($item) use ($model) {
                $this->createBusinessCapability($item, $model->id);
            });
        });
    }

    public function createBusinessCapability(array $item, ?int $parent_id = null): void
    {
        $data = [
            'description' => $item['description'],
            'strategic_value' => $item['strategic_value'],
        ];

        if ($parent_id) {
            $data['parent_id'] = $parent_id;
        }

        BusinessCapability::updateOrCreate(
            ['name' => $item['name']],
            $data,
        );
    }
}
