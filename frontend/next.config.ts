import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone", // Required for Docker deployment

    // Set the root directory to silence lockfile warning
    outputFileTracingRoot: __dirname,

    // Optional: Configure environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    },

    // Proxy API requests to backend to avoid CORS issues in development
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8080/api/:path*",
            },
        ];
    },
};

export default withNextIntl(nextConfig);
