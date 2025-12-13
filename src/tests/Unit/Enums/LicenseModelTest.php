<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\LicenseModel;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(LicenseModel::class)]
class LicenseModelTest extends TestCase
{
    #[Test]
    #[DataProvider('license_model_values')]
    public function it_has_correct_values(LicenseModel $licenseModel, $expectedValue): void
    {
        $this->assertEquals($expectedValue, $licenseModel->value);
    }

    #[Test]
    #[DataProvider('license_model_label')]
    public function it_returns_correct_labels(LicenseModel $model, $expectedLabel): void
    {
        $this->assertEquals($expectedLabel, $model->label());
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(LicenseModel::class, LicenseModel::Community);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertIsArray(LicenseModel::cases());
        $this->assertNotEmpty(LicenseModel::cases());
        $this->assertCount(14, LicenseModel::cases());
    }

    public static function license_model_label(): array
    {
        return [
            'Community' => [LicenseModel::Community, 'Community Edition'],
            'ConsumptionVolume' => [LicenseModel::ConsumptionVolume, 'Pay-as-you-go (Volume)'],
            'CreditsBased' => [LicenseModel::CreditsBased, 'Pre-paid Credits'],
            'FlatFeeSubscription' => [LicenseModel::FlatFeeSubscription, 'Tiered Usage'],
            'Freemium' => [LicenseModel::Freemium, 'Freemium'],
            'OpenSource' => [LicenseModel::OpenSource, 'OpenSource License (FOSS)'],
            'PerActiveUser' => [LicenseModel::PerActiveUser, 'Active User (Monthly)'],
            'PerConcurrentUser' => [LicenseModel::PerConcurrentUser, 'By Concurrent User'],
            'PerCore' => [LicenseModel::PerCore, 'Per CPU Core'],
            'PerDevice' => [LicenseModel::PerDevice, 'Per Device/Endpoint'],
            'PerInstance' => [LicenseModel::PerInstance, 'Per Instance'],
            'PerNamedUser' => [LicenseModel::PerNamedUser, 'Per Named User'],
            'Perpetual' => [LicenseModel::Perpetual, 'Perpetual License'],
            'SiteLicense' => [LicenseModel::SiteLicense, 'Site License'],
        ];
    }

    public static function license_model_values(): array
    {
        return [
            'community' => [LicenseModel::Community, 'community'],
            'consumption_volume' => [LicenseModel::ConsumptionVolume, 'consumption_volume'],
            'credits_based' => [LicenseModel::CreditsBased, 'credits_based'],
            'flat_fee' => [LicenseModel::FlatFeeSubscription, 'flat_fee'],
            'freemium' => [LicenseModel::Freemium, 'freemium'],
            'opensource' => [LicenseModel::OpenSource, 'opensource'],
            'per_active_user' => [LicenseModel::PerActiveUser, 'per_active_user'],
            'per_concurrent_user' => [LicenseModel::PerConcurrentUser, 'per_concurrent_user'],
            'per_core' => [LicenseModel::PerCore, 'per_core'],
            'per_device' => [LicenseModel::PerDevice, 'per_device'],
            'per_instance' => [LicenseModel::PerInstance, 'per_instance'],
            'per_named_user' => [LicenseModel::PerNamedUser, 'per_named_user'],
            'perpetual' => [LicenseModel::Perpetual, 'perpetual'],
            'site_license' => [LicenseModel::SiteLicense, 'site_license'],
        ];
    }
}
