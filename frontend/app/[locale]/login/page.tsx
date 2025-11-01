import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "common" });

    return {
        title: `${t("login")} - Atlas Catalog`,
        description: "Sign in to Atlas Catalog",
    };
}

export default async function LoginPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-cta relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md space-y-6 text-center">
                        <div className="flex justify-center mb-8">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-2xl">
                                <span className="text-4xl font-bold text-white">
                                    A
                                </span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight">
                            Welcome to Atlas Catalog
                        </h1>
                        <p className="text-lg text-blue-100">
                            Your central hub for API management, discovery, and
                            documentation.
                        </p>
                        <div className="pt-8 space-y-4">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-left">
                                    Centralized API catalog management
                                </p>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-left">
                                    Real-time API monitoring and analytics
                                </p>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                </div>
                                <p className="text-left">
                                    Team collaboration and governance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
                <LoginForm locale={locale} />
            </div>
        </div>
    );
}
