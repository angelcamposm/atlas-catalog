/**
 * Icon mappings and utilities for Vendors
 *
 * Vendors can have SVG icons stored in the backend (/media/svg/)
 * This file provides fallback icons based on vendor name patterns
 * and utilities for handling vendor icon display.
 */

import { IconType } from "react-icons";
import {
    FaAws,
    FaGoogle,
    FaMicrosoft,
    FaRedhat,
    FaDocker,
    FaGithub,
    FaGitlab,
    FaLinux,
    FaApple,
    FaAndroid,
    FaJava,
    FaPython,
    FaNodeJs,
    FaPhp,
    FaBuilding,
} from "react-icons/fa";
import {
    SiKubernetes,
    SiVmware,
    SiOracle,
    SiSuse,
    SiRancher,
    SiHashicorp,
    SiTerraform,
    SiAnsible,
    SiJenkins,
    SiGrafana,
    SiPrometheus,
    SiElasticsearch,
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiRedis,
    SiApachekafka,
    SiNginx,
    SiApache,
    SiCloudflare,
    SiDigitalocean,
    SiHeroku,
    SiNetlify,
    SiVercel,
    SiDatadog,
    SiNewrelic,
    SiSplunk,
    SiPagerduty,
    SiConfluence,
    SiJira,
    SiSlack,
    SiTwilio,
    SiStripe,
    SiAuth0,
    SiOkta,
    SiSnowflake,
    SiDatabricks,
    SiTableau,
    SiSalesforce,
    SiSap,
    SiAtlassian,
    SiGitea,
    SiBitbucket,
} from "react-icons/si";

/**
 * Map of vendor name patterns to their react-icons
 */
export const VENDOR_ICONS: Record<string, IconType> = {
    // Cloud Providers
    aws: FaAws,
    amazon: FaAws,
    google: FaGoogle,
    gcp: FaGoogle,
    microsoft: FaMicrosoft,
    azure: FaMicrosoft,
    ibm: FaBuilding,
    oracle: SiOracle,
    digitalocean: SiDigitalocean,
    cloudflare: SiCloudflare,
    heroku: SiHeroku,
    netlify: SiNetlify,
    vercel: SiVercel,

    // Linux / OS
    redhat: FaRedhat,
    "red hat": FaRedhat,
    suse: SiSuse,
    linux: FaLinux,
    apple: FaApple,
    android: FaAndroid,

    // Container / Orchestration
    docker: FaDocker,
    kubernetes: SiKubernetes,
    k8s: SiKubernetes,
    vmware: SiVmware,
    rancher: SiRancher,

    // DevOps / CI/CD
    hashicorp: SiHashicorp,
    terraform: SiTerraform,
    ansible: SiAnsible,
    jenkins: SiJenkins,
    github: FaGithub,
    gitlab: FaGitlab,
    gitea: SiGitea,
    bitbucket: SiBitbucket,
    atlassian: SiAtlassian,
    jira: SiJira,
    confluence: SiConfluence,

    // Monitoring / Observability
    grafana: SiGrafana,
    prometheus: SiPrometheus,
    datadog: SiDatadog,
    newrelic: SiNewrelic,
    splunk: SiSplunk,
    pagerduty: SiPagerduty,
    elasticsearch: SiElasticsearch,
    elastic: SiElasticsearch,

    // Databases
    mongodb: SiMongodb,
    mongo: SiMongodb,
    postgresql: SiPostgresql,
    postgres: SiPostgresql,
    mysql: SiMysql,
    redis: SiRedis,
    kafka: SiApachekafka,
    snowflake: SiSnowflake,
    databricks: SiDatabricks,

    // Web Servers
    nginx: SiNginx,
    apache: SiApache,

    // Languages / Runtimes
    java: FaJava,
    python: FaPython,
    node: FaNodeJs,
    nodejs: FaNodeJs,
    php: FaPhp,

    // SaaS / Business
    salesforce: SiSalesforce,
    sap: SiSap,
    servicenow: FaBuilding,
    tableau: SiTableau,
    slack: SiSlack,
    twilio: SiTwilio,
    stripe: SiStripe,
    auth0: SiAuth0,
    okta: SiOkta,

    // Default
    default: FaBuilding,
};

/**
 * Color classes for vendor icons based on name patterns
 */
export const VENDOR_COLORS: Record<string, string> = {
    // Cloud Providers
    aws: "text-[#FF9900]",
    amazon: "text-[#FF9900]",
    google: "text-[#4285F4]",
    gcp: "text-[#4285F4]",
    microsoft: "text-[#00A4EF]",
    azure: "text-[#0078D4]",
    ibm: "text-[#1F70C1]",
    oracle: "text-[#F80000]",
    digitalocean: "text-[#0080FF]",
    cloudflare: "text-[#F38020]",
    heroku: "text-[#430098]",
    netlify: "text-[#00C7B7]",
    vercel: "text-black dark:text-white",

    // Linux / OS
    redhat: "text-[#EE0000]",
    "red hat": "text-[#EE0000]",
    suse: "text-[#73BA25]",
    linux: "text-[#FCC624]",

    // Container / Orchestration
    docker: "text-[#2496ED]",
    kubernetes: "text-[#326CE5]",
    k8s: "text-[#326CE5]",
    vmware: "text-[#607078]",
    rancher: "text-[#0075A8]",

    // DevOps / CI/CD
    hashicorp: "text-black dark:text-white",
    terraform: "text-[#7B42BC]",
    ansible: "text-[#EE0000]",
    jenkins: "text-[#D24939]",
    github: "text-black dark:text-white",
    gitlab: "text-[#FC6D26]",
    atlassian: "text-[#0052CC]",
    jira: "text-[#0052CC]",

    // Monitoring
    grafana: "text-[#F46800]",
    prometheus: "text-[#E6522C]",
    datadog: "text-[#632CA6]",
    newrelic: "text-[#008C99]",
    splunk: "text-[#65A637]",
    elasticsearch: "text-[#FEC514]",

    // Databases
    mongodb: "text-[#47A248]",
    postgresql: "text-[#4169E1]",
    mysql: "text-[#4479A1]",
    redis: "text-[#DC382D]",
    kafka: "text-black dark:text-white",
    snowflake: "text-[#29B5E8]",

    // Default
    default: "text-gray-500",
};

/**
 * Background color classes for vendor badges
 */
export const VENDOR_BG_COLORS: Record<string, string> = {
    aws: "bg-[#FF9900]/10",
    amazon: "bg-[#FF9900]/10",
    google: "bg-[#4285F4]/10",
    microsoft: "bg-[#00A4EF]/10",
    azure: "bg-[#0078D4]/10",
    redhat: "bg-[#EE0000]/10",
    docker: "bg-[#2496ED]/10",
    kubernetes: "bg-[#326CE5]/10",
    vmware: "bg-[#607078]/10",
    github: "bg-gray-100 dark:bg-gray-800",
    gitlab: "bg-[#FC6D26]/10",
    default: "bg-gray-100 dark:bg-gray-800",
};

/**
 * Get the react-icon component for a vendor by name
 */
export function getVendorIcon(name: string): IconType {
    const normalizedName = name.toLowerCase().replace(/[\s_-]+/g, "");

    // Try exact match first
    for (const [key, icon] of Object.entries(VENDOR_ICONS)) {
        if (normalizedName === key.replace(/[\s_-]+/g, "")) {
            return icon;
        }
    }

    // Try partial match
    for (const [key, icon] of Object.entries(VENDOR_ICONS)) {
        if (
            normalizedName.includes(key.replace(/[\s_-]+/g, "")) ||
            key.replace(/[\s_-]+/g, "").includes(normalizedName)
        ) {
            return icon;
        }
    }

    return VENDOR_ICONS.default;
}

/**
 * Get the color class for a vendor icon
 */
export function getVendorIconColor(name: string): string {
    const normalizedName = name.toLowerCase();

    for (const [key, color] of Object.entries(VENDOR_COLORS)) {
        if (normalizedName.includes(key)) {
            return color;
        }
    }

    return VENDOR_COLORS.default;
}

/**
 * Get the background color class for a vendor
 */
export function getVendorBgColor(name: string): string {
    const normalizedName = name.toLowerCase();

    for (const [key, color] of Object.entries(VENDOR_BG_COLORS)) {
        if (normalizedName.includes(key)) {
            return color;
        }
    }

    return VENDOR_BG_COLORS.default;
}

/**
 * Check if a vendor has a known icon mapping
 */
export function hasVendorIcon(name: string): boolean {
    const normalizedName = name.toLowerCase().replace(/[\s_-]+/g, "");

    for (const key of Object.keys(VENDOR_ICONS)) {
        if (key === "default") continue;
        if (
            normalizedName.includes(key.replace(/[\s_-]+/g, "")) ||
            key.replace(/[\s_-]+/g, "").includes(normalizedName)
        ) {
            return true;
        }
    }

    return false;
}
