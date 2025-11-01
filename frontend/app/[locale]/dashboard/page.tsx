import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { Metadata } from "next";
import { Construction } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Dashboard - Atlas Catalog`,
        description: "Atlas Catalog Dashboard",
    };
}

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <DashboardLayout locale={locale}>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-8">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* Construction Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-blue-indigo opacity-20 blur-3xl rounded-full" />
                            <div className="relative bg-gradient-blue-indigo p-8 rounded-full shadow-2xl">
                                <Construction className="h-24 w-24 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            Dashboard Under Construction
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            We&apos;re building something amazing!
                        </p>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Our dashboard is currently being developed with
                            exciting new features:
                        </p>
                        <ul className="space-y-3 text-left max-w-md mx-auto">
                            <li className="flex items-start space-x-3">
                                <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                                    <svg
                                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Real-time API metrics and monitoring
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                                    <svg
                                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Interactive analytics and insights
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                                    <svg
                                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Team collaboration tools
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                                    <svg
                                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                    Advanced reporting capabilities
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Development Progress</span>
                            <span className="font-semibold">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-blue-indigo h-full rounded-full transition-all duration-500"
                                style={{ width: "35%" }}
                            />
                        </div>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800">
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">
                            🚀 Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
