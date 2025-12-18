/**
 * Centralized API exports
 */

export { apiClient, ApiError } from "../api-client";
export { apisApi } from "./apis";
export { apiTypesApi } from "./api-types";
export { lifecyclesApi } from "./lifecycles";
export { programmingLanguagesApi } from "./programming-languages";

// API Extended Domain (Categories, Statuses, Access Policies)
export {
    apiExtendedApi,
    apiCategoriesApi,
    apiStatusesApi,
    apiAccessPoliciesApi,
} from "./api-extended";

// Business Domain
export {
    businessApi,
    businessDomainsApi,
    businessTiersApi,
    environmentsApi,
} from "./business";

// Technology Domain (Vendors, Frameworks, Authentication Methods)
export {
    technologyApi,
    vendorsApi,
    frameworksApi,
    authenticationMethodsApi,
} from "./technology";

// Groups Domain
export {
    groupsApiComplete,
    groupsApi,
    groupTypesApi,
    groupMemberRolesApi,
} from "./groups";

// Infrastructure Domain
export {
    infrastructureApi,
    clusterTypesApi,
    clustersApi,
    nodesApi,
    clusterServiceAccountsApi,
} from "./infrastructure";

// Infrastructure Types
export { infrastructureTypesApi } from "./infrastructure-types";

// Platform Domain
export { platformApi, platformsApi, componentTypesApi } from "./platform";

// Components Domain
export {
    componentsApi,
    componentTypesApi as componentTypesApiComplete,
    getComponentDisplayName,
    getOperationalStatusColor,
    getCriticalityColor,
    getTierLabel,
} from "./components";
export type {
    ComponentsQueryParams,
    CreateComponentData,
    UpdateComponentData,
    ComponentWithRelations,
} from "./components";

// Integration Domain
export { integrationApi, linkTypesApi, linksApi } from "./integration";

// Security Domain
export { securityApi, serviceAccountTokensApi } from "./security";

// Service Accounts
export { serviceAccountsApi } from "./service-accounts";

// Compliance Domain (Compliance Standards, Service Statuses)
export {
    complianceApi,
    complianceStandardsApi,
    serviceStatusesApi,
} from "./compliance";

// Resources Domain
export {
    resourcesApiComplete,
    resourcesApi,
    resourceCategoriesApi,
} from "./resources";

// API Dependencies (Component-API relationships)
export {
    apiDependenciesApi,
    getRelationshipLabel,
    getRelationshipColor,
    getRelationshipIcon,
} from "./api-dependencies";
export type {
    ApiRelationshipType,
    ApiDependency,
    ApiRelation,
    ApiDependencies,
    DependencyComponent,
} from "./api-dependencies";
