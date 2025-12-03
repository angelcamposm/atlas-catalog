<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\Relationship;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(Relationship::class)]
class RelationshipTest extends TestCase
{
    #[Test]
    public function all_relationships_have_a_description(): void
    {
        foreach (Relationship::cases() as $relationship) {
            $this->assertNotEmpty(
                $relationship->description(),
                "Relationship [{$relationship->value}] is missing a description."
            );
        }
    }

    #[Test]
    #[DataProvider('oppositeProvider')]
    public function it_returns_the_correct_opposite_relationship(Relationship $original, Relationship $expectedOpposite): void
    {
        $this->assertSame($expectedOpposite, $original->opposite());
    }

    public static function oppositeProvider(): array
    {
        return [
            'Relationship::ApiConsumedBy' => [Relationship::ApiConsumedBy, Relationship::ConsumesApi],
            'Relationship::ConsumesApi' => [Relationship::ConsumesApi, Relationship::ApiConsumedBy],
            'Relationship::ApiProvidedBy' => [Relationship::ApiProvidedBy, Relationship::ProvidesApi],
            'Relationship::ProvidesApi' => [Relationship::ProvidesApi, Relationship::ApiProvidedBy],
            'Relationship::ChildOf' => [Relationship::ChildOf, Relationship::ParentOf],
            'Relationship::ParentOf' => [Relationship::ParentOf, Relationship::ChildOf],
            'Relationship::DependencyOf' => [Relationship::DependencyOf, Relationship::DependsOn],
            'Relationship::DependsOn' => [Relationship::DependsOn, Relationship::DependencyOf],
            'Relationship::HasMember' => [Relationship::HasMember, Relationship::MemberOf],
            'Relationship::MemberOf' => [Relationship::MemberOf, Relationship::HasMember],
            'Relationship::OwnedBy' => [Relationship::OwnedBy, Relationship::OwnerOf],
            'Relationship::OwnerOf' => [Relationship::OwnerOf, Relationship::OwnedBy],
            'Relationship::DeployedOn' => [Relationship::DeployedOn, Relationship::Hosts],
            'Relationship::Hosts' => [Relationship::Hosts, Relationship::DeployedOn],
            'Relationship::HasPart' => [Relationship::HasPart, Relationship::PartOf],
            'Relationship::PartOf' => [Relationship::PartOf, Relationship::HasPart],
            'Relationship::ImplementedBy' => [Relationship::ImplementedBy, Relationship::Implements],
            'Relationship::Implements' => [Relationship::Implements, Relationship::ImplementedBy],
        ];
    }
}
