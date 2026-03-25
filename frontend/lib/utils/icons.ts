/**
 * Utility functions for handling icon URLs from the backend
 */

// Base URL for SVG icons served by nginx from /media/svg/
const getIconBaseUrl = () => {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    // Remove /api suffix to get the base URL
    return apiUrl.replace(/\/api\/?$/, "");
};

/**
 * Get the full URL for an icon file
 * @param icon - The icon filename (e.g., "aws.svg", "laravel.svg")
 * @returns Full URL to the icon or null if no icon provided
 */
export const getIconUrl = (icon: string | null | undefined): string | null => {
    if (!icon) return null;
    const baseUrl = getIconBaseUrl();
    return `${baseUrl}/media/svg/${icon}`;
};

/**
 * Get a list of color classes for dynamic coloring based on index
 */
export const getColorByIndex = (index: number): string => {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-orange-500",
        "bg-cyan-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-amber-500",
        "bg-red-500",
        "bg-teal-500",
    ];
    return colors[index % colors.length];
};

/**
 * Get color based on vendor/framework name patterns
 */
export const getVendorColor = (name: string): string => {
    const colorMap: Record<string, string> = {
        aws: "bg-orange-500",
        amazon: "bg-orange-500",
        google: "bg-blue-500",
        gcp: "bg-blue-500",
        microsoft: "bg-blue-600",
        azure: "bg-blue-600",
        ibm: "bg-blue-700",
        oracle: "bg-red-600",
        redhat: "bg-red-500",
        "red hat": "bg-red-500",
        vmware: "bg-green-600",
        suse: "bg-green-500",
        rancher: "bg-blue-400",
        kubernetes: "bg-blue-500",
        cncf: "bg-blue-500",
    };

    const lowerName = name.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
        if (lowerName.includes(key)) {
            return color;
        }
    }
    return "bg-gray-500";
};

export const getFrameworkColor = (name: string): string => {
    const colorMap: Record<string, string> = {
        laravel: "bg-red-500",
        symfony: "bg-black",
        django: "bg-green-700",
        flask: "bg-gray-700",
        fastapi: "bg-teal-500",
        spring: "bg-green-500",
        react: "bg-cyan-500",
        vue: "bg-emerald-500",
        angular: "bg-red-600",
        next: "bg-black",
        nest: "bg-red-500",
        express: "bg-gray-600",
        rails: "bg-red-600",
        quarkus: "bg-blue-600",
        dotnet: "bg-purple-600",
        ".net": "bg-purple-600",
    };

    const lowerName = name.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
        if (lowerName.includes(key)) {
            return color;
        }
    }
    return "bg-gray-500";
};
