<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the types of relationships that can exist between entities in the catalog.
 *
 * Each relationship is part of a symmetrical pair (e.g., `ConsumesApi` and `ApiConsumedBy`).
 */
enum Relationship: string
{
    case ApiConsumedBy = 'apiConsumedBy';
    case ApiProvidedBy = 'apiProvidedBy';
    case ChildOf = 'childOf';
    case ConsumesApi = 'consumesApi';
    case DeployedOn = 'deployedOn';
    case DependencyOf = 'dependencyOf';
    case DependsOn = 'dependsOn';
    case HasMember = 'hasMember';
    case HasPart = 'hasPart';
    case Hosts = 'hosts';
    case ImplementedBy = 'implementedBy';
    case Implements = 'implements';
    case MemberOf = 'memberOf';
    case OwnedBy = 'ownedBy';
    case OwnerOf = 'ownerOf';
    case ParentOf = 'parentOf';
    case PartOf = 'partOf';
    case ProvidesApi = 'providesApi';

    /**
     * Get the inverse relationship.
     *
     * For example, the opposite of `OwnedBy` is `OwnerOf`.
     */
    public static function oppositeFor(Relationship $relationship): self
    {
        return match ($relationship) {
            self::ApiConsumedBy => self::ConsumesApi,
            self::ConsumesApi => self::ApiConsumedBy,
            self::ApiProvidedBy => self::ProvidesApi,
            self::ProvidesApi => self::ApiProvidedBy,
            self::ChildOf => self::ParentOf,
            self::ParentOf => self::ChildOf,
            self::DependencyOf => self::DependsOn,
            self::DependsOn => self::DependencyOf,
            self::HasMember => self::MemberOf,
            self::MemberOf => self::HasMember,
            self::OwnedBy => self::OwnerOf,
            self::OwnerOf => self::OwnedBy,
            self::DeployedOn => self::Hosts,
            self::HasPart => self::PartOf,
            self::Hosts => self::DeployedOn,
            self::ImplementedBy => self::Implements,
            self::Implements => self::ImplementedBy,
            self::PartOf => self::HasPart,
        };
    }

    /**
     * Get a human-readable description of the relationship.
     */
    public function description(): string
    {
        return match ($this) {
            self::ApiConsumedBy => 'The API is consumed by the entity.',
            self::ApiProvidedBy => 'The API is provided by the entity.',
            self::ChildOf => 'Is a child of the entity.',
            self::ConsumesApi => 'Consumes the API.',
            self::DeployedOn => 'Is deployed on the entity.',
            self::DependencyOf => 'Is a dependency of the entity.',
            self::DependsOn => 'Depends on the entity.',
            self::HasMember => 'Has the entity as a member.',
            self::HasPart => 'Has the entity as a part.',
            self::Hosts => 'Hosts the entity.',
            self::ImplementedBy => 'Is implemented by the entity.',
            self::Implements => 'Implements the business capability.',
            self::MemberOf => 'Is a member of the entity.',
            self::OwnedBy => 'Is owned by the entity.',
            self::OwnerOf => 'Is the owner of the entity.',
            self::ParentOf => 'Is a parent of the entity.',
            self::PartOf => 'Is part of the entity.',
            self::ProvidesApi => 'Provides the API.',
        };
    }
}
