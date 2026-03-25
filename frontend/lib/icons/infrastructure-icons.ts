/**
 * Icon mappings for Infrastructure Types and Cluster Types
 *
 * Since InfrastructureType doesn't have an icon field in the backend,
 * we provide default icons based on common infrastructure type names.
 *
 * ClusterType has icon field in backend, but we provide fallback defaults.
 */

import {
    FaCloud,
    FaServer,
    FaNetworkWired,
    FaBuilding,
    FaDocker,
    FaCubes,
    FaDatabase,
    FaLayerGroup,
    FaProjectDiagram,
    FaMicrochip,
    FaGlobe,
    FaDesktop,
    FaThLarge,
    FaRedhat,
} from "react-icons/fa";
import { SiKubernetes, SiVmware, SiProxmox } from "react-icons/si";
import { IconType } from "react-icons";

/**
 * Default icons for Infrastructure Types based on name patterns
 */
export const INFRASTRUCTURE_TYPE_ICONS: Record<string, IconType> = {
    // Cloud providers
    cloud: FaCloud,
    aws: FaCloud,
    azure: FaCloud,
    gcp: FaCloud,
    google: FaCloud,

    // On-premise / Physical
    "on-premise": FaBuilding,
    "on-prem": FaBuilding,
    onprem: FaBuilding,
    physical: FaServer,
    bare_metal: FaServer,
    "bare-metal": FaServer,
    baremetal: FaServer,
    datacenter: FaBuilding,

    // Virtualization
    virtual: FaCubes,
    virtualized: FaCubes,
    vmware: SiVmware,
    hyperv: FaCubes,
    "hyper-v": FaCubes,
    proxmox: SiProxmox,
    kvm: FaCubes,

    // Container / Edge
    container: FaDocker,
    containerized: FaDocker,
    edge: FaMicrochip,

    // Hybrid
    hybrid: FaGlobe,

    // Default
    default: FaServer,
};

/**
 * Default icons for Cluster Types based on name patterns
 */
export const CLUSTER_TYPE_ICONS: Record<string, IconType> = {
    // Kubernetes variants
    kubernetes: SiKubernetes,
    k8s: SiKubernetes,
    aks: SiKubernetes,
    eks: SiKubernetes,
    gke: SiKubernetes,
    k3s: SiKubernetes,
    rke: SiKubernetes,
    rancher: SiKubernetes,
    microk8s: SiKubernetes,
    minikube: SiKubernetes,
    kind: SiKubernetes,

    // OpenShift (using RedHat icon as alternative)
    openshift: FaRedhat,
    ocp: FaRedhat,
    okd: FaRedhat,

    // Other container orchestrators
    swarm: FaDocker,
    "docker-swarm": FaDocker,
    nomad: FaLayerGroup,
    mesos: FaProjectDiagram,

    // VM/Traditional
    vmware: SiVmware,
    esxi: SiVmware,
    vcenter: SiVmware,
    proxmox: SiProxmox,
    hyperv: FaCubes,

    // Default
    default: FaNetworkWired,
};

/**
 * Get icon for an Infrastructure Type by name
 * @param name - Infrastructure type name
 * @returns React Icon component
 */
export function getInfrastructureTypeIcon(name: string): IconType {
    const normalizedName = name.toLowerCase().replace(/[\s_-]+/g, "_");

    // Try exact match first
    if (INFRASTRUCTURE_TYPE_ICONS[normalizedName]) {
        return INFRASTRUCTURE_TYPE_ICONS[normalizedName];
    }

    // Try partial match
    for (const [key, icon] of Object.entries(INFRASTRUCTURE_TYPE_ICONS)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return icon;
        }
    }

    return INFRASTRUCTURE_TYPE_ICONS.default;
}

/**
 * Get icon for a Cluster Type by name or icon field
 * @param name - Cluster type name
 * @param iconClass - Optional icon class from backend (e.g., "fas fa-kubernetes")
 * @returns React Icon component
 */
export function getClusterTypeIcon(
    name: string,
    iconClass?: string | null
): IconType {
    // If backend provides an icon class, we could parse it here
    // For now, we use name-based matching

    const normalizedName = name.toLowerCase().replace(/[\s_-]+/g, "_");

    // Try exact match first
    if (CLUSTER_TYPE_ICONS[normalizedName]) {
        return CLUSTER_TYPE_ICONS[normalizedName];
    }

    // Try partial match
    for (const [key, icon] of Object.entries(CLUSTER_TYPE_ICONS)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return icon;
        }
    }

    return CLUSTER_TYPE_ICONS.default;
}

/**
 * Icon color mapping for visual consistency
 */
export const ICON_COLORS: Record<string, string> = {
    kubernetes: "text-blue-500",
    openshift: "text-red-500",
    cloud: "text-sky-500",
    aws: "text-orange-500",
    azure: "text-blue-600",
    gcp: "text-green-500",
    vmware: "text-blue-700",
    docker: "text-blue-400",
    proxmox: "text-orange-600",
    default: "text-gray-500",
};

/**
 * Get color class for icon based on name pattern
 */
export function getIconColorClass(name: string): string {
    const normalizedName = name.toLowerCase();

    for (const [key, colorClass] of Object.entries(ICON_COLORS)) {
        if (normalizedName.includes(key)) {
            return colorClass;
        }
    }

    return ICON_COLORS.default;
}
