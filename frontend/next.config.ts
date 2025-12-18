import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Import package.json to get the version
import packageJson from "./package.json";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone", // Required for Docker deployment

    // Set the root directory to silence lockfile warning
    outputFileTracingRoot: __dirname,

    // Optional: Configure environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
        NEXT_PUBLIC_APP_VERSION: packageJson.version,
    },

    // Proxy API requests to backend to avoid CORS issues in development
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8080/api/:path*",
            },
            {
                source: "/media/:path*",
                destination: "http://localhost:8080/media/:path*",
            },
        ];
    },
};

export default withNextIntl(nextConfig);
